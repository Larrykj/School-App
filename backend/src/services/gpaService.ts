import prisma from '../utils/prisma';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * GPA Calculation Service for Kenyan Grading System
 * 
 * Grading Scale:
 * A (70-100) = 4.0
 * B (60-69) = 3.0
 * C (50-59) = 2.0
 * D (40-49) = 1.0
 * E (0-39) = 0.0
 */

interface GradeCalculation {
  letterGrade: string;
  gradePoints: number;
  totalMarks: number;
}

export class GPAService {
  /**
   * Calculate letter grade and grade points from marks
   */
  static async calculateGrade(totalMarks: number): Promise<GradeCalculation> {
    const gradingScale = await prisma.gradingScale.findFirst({
      where: {
        AND: [
          { minPercentage: { lte: totalMarks } },
          { maxPercentage: { gte: totalMarks } },
          { isActive: true },
        ],
      },
    });

    if (!gradingScale) {
      // Default to fail if no grading scale found
      return {
        letterGrade: 'E',
        gradePoints: 0.0,
        totalMarks,
      };
    }

    return {
      letterGrade: gradingScale.letterGrade,
      gradePoints: Number(gradingScale.gradePoints),
      totalMarks,
    };
  }

  /**
   * Calculate GPA for a semester
   */
  static async calculateSemesterGPA(enrollmentId: string, semesterId: string): Promise<number> {
    const grades = await prisma.courseGrade.findMany({
      where: {
        enrollmentId,
        offering: {
          semesterId,
        },
        isPublished: true,
        totalMarks: { not: null },
      },
      include: {
        offering: {
          include: {
            course: true,
          },
        },
      },
    });

    if (grades.length === 0) {
      return 0.0;
    }

    let totalQualityPoints = 0;
    let totalCreditHours = 0;

    for (const grade of grades) {
      const creditHours = grade.creditHours;
      const gradePoints = Number(grade.gradePoints || 0);
      
      totalQualityPoints += gradePoints * creditHours;
      totalCreditHours += creditHours;
    }

    if (totalCreditHours === 0) {
      return 0.0;
    }

    return Math.round((totalQualityPoints / totalCreditHours) * 100) / 100;
  }

  /**
   * Calculate cumulative GPA (CGPA)
   */
  static async calculateCumulativeGPA(enrollmentId: string): Promise<number> {
    const grades = await prisma.courseGrade.findMany({
      where: {
        enrollmentId,
        isPublished: true,
        totalMarks: { not: null },
      },
    });

    if (grades.length === 0) {
      return 0.0;
    }

    let totalQualityPoints = 0;
    let totalCreditHours = 0;

    for (const grade of grades) {
      const creditHours = grade.creditHours;
      const gradePoints = Number(grade.gradePoints || 0);
      
      totalQualityPoints += gradePoints * creditHours;
      totalCreditHours += creditHours;
    }

    if (totalCreditHours === 0) {
      return 0.0;
    }

    return Math.round((totalQualityPoints / totalCreditHours) * 100) / 100;
  }

  /**
   * Update student's cumulative GPA
   */
  static async updateStudentGPA(enrollmentId: string): Promise<void> {
    const cgpa = await this.calculateCumulativeGPA(enrollmentId);
    
    const totalCredits = await prisma.courseGrade.aggregate({
      where: {
        enrollmentId,
        isPublished: true,
        totalMarks: { not: null },
        gradePoints: { gt: 0 }, // Only count passed courses
      },
      _sum: {
        creditHours: true,
      },
    });

    await prisma.studentEnrollment.update({
      where: { id: enrollmentId },
      data: {
        currentGPA: cgpa,
        cumulativeCredits: totalCredits._sum.creditHours || 0,
      },
    });
  }

  /**
   * Calculate marks and grade for a course
   */
  static async calculateCourseGrade(
    enrollmentId: string,
    offeringId: string,
    catMarks: number,
    examMarks: number
  ): Promise<void> {
    // Total marks = CAT (30%) + Exam (70%)
    const totalMarks = (catMarks * 0.3) + (examMarks * 0.7);
    
    const gradeInfo = await this.calculateGrade(totalMarks);

    await prisma.courseGrade.upsert({
      where: {
        enrollmentId_offeringId: {
          enrollmentId,
          offeringId,
        },
      },
      update: {
        catMarks,
        examMarks,
        totalMarks,
        letterGrade: gradeInfo.letterGrade,
        gradePoints: gradeInfo.gradePoints,
      },
      create: {
        enrollmentId,
        offeringId,
        catMarks,
        examMarks,
        totalMarks,
        letterGrade: gradeInfo.letterGrade,
        gradePoints: gradeInfo.gradePoints,
      },
    });

    // Update student's CGPA
    await this.updateStudentGPA(enrollmentId);
  }

  /**
   * Get student's academic standing
   */
  static getAcademicStanding(gpa: number): string {
    if (gpa >= 3.5) return 'First Class Honors';
    if (gpa >= 3.0) return 'Second Class Honors (Upper Division)';
    if (gpa >= 2.5) return 'Second Class Honors (Lower Division)';
    if (gpa >= 2.0) return 'Pass';
    if (gpa >= 1.0) return 'Probation';
    return 'Academic Warning';
  }

  /**
   * Check if student is eligible for graduation
   */
  static async checkGraduationEligibility(enrollmentId: string): Promise<{
    eligible: boolean;
    reason?: string;
    missingCredits?: number;
    currentGPA?: number;
  }> {
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        program: true,
      },
    });

    if (!enrollment) {
      return { eligible: false, reason: 'Enrollment not found' };
    }

    const cgpa = enrollment.currentGPA ? Number(enrollment.currentGPA) : 0;
    const earnedCredits = enrollment.cumulativeCredits;
    const requiredCredits = enrollment.program.creditHours;

    // Check minimum GPA requirement (typically 2.0)
    if (cgpa < 2.0) {
      return {
        eligible: false,
        reason: 'GPA below minimum requirement (2.0)',
        currentGPA: cgpa,
      };
    }

    // Check credit hours
    if (earnedCredits < requiredCredits) {
      return {
        eligible: false,
        reason: 'Insufficient credit hours',
        missingCredits: requiredCredits - earnedCredits,
      };
    }

    return { eligible: true };
  }

  /**
   * Get semester summary for a student
   */
  static async getSemesterSummary(enrollmentId: string, semesterId: string) {
    const grades = await prisma.courseGrade.findMany({
      where: {
        enrollmentId,
        offering: {
          semesterId,
        },
        isPublished: true,
      },
      include: {
        offering: {
          include: {
            course: true,
            semester: true,
          },
        },
      },
    });

    const semesterGPA = await this.calculateSemesterGPA(enrollmentId, semesterId);
    const cumulativeGPA = await this.calculateCumulativeGPA(enrollmentId);

    const totalCredits = grades.reduce((sum, grade) => sum + grade.creditHours, 0);
    const earnedCredits = grades
      .filter(grade => Number(grade.gradePoints || 0) > 0)
      .reduce((sum, grade) => sum + grade.creditHours, 0);

    return {
      semesterId,
      semesterGPA,
      cumulativeGPA,
      totalCredits,
      earnedCredits,
      courses: grades.map(grade => ({
        courseCode: grade.offering.course.code,
        courseName: grade.offering.course.name,
        creditHours: grade.creditHours,
        catMarks: Number(grade.catMarks || 0),
        examMarks: Number(grade.examMarks || 0),
        totalMarks: Number(grade.totalMarks || 0),
        letterGrade: grade.letterGrade,
        gradePoints: Number(grade.gradePoints || 0),
      })),
      academicStanding: this.getAcademicStanding(cumulativeGPA),
    };
  }
}

export default GPAService;

