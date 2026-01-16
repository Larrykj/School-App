import prisma from '../utils/prisma';
import GPAService from './gpaService';

/**
 * Transcript Generation Service
 */

interface TranscriptData {
  student: {
    name: string;
    registrationNumber: string;
    nationalId?: string;
    program: string;
    department: string;
  };
  academic: {
    enrollmentDate: Date;
    expectedGraduation?: Date;
    yearOfStudy: number;
    currentGPA: number;
    cumulativeCredits: number;
    status: string;
    academicStanding: string;
  };
  semesters: Array<{
    semester: string;
    academicYear: string;
    courses: Array<{
      code: string;
      name: string;
      creditHours: number;
      grade: string;
      gradePoints: number;
    }>;
    semesterGPA: number;
    cumulativeGPA: number;
    creditsEarned: number;
  }>;
  summary: {
    totalCreditsRequired: number;
    totalCreditsEarned: number;
    overallGPA: number;
    academicStanding: string;
    graduationEligibility: {
      eligible: boolean;
      reason?: string;
    };
  };
}

export class TranscriptService {
  /**
   * Generate comprehensive transcript data
   */
  static async generateTranscriptData(enrollmentId: string): Promise<TranscriptData | null> {
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        student: true,
        program: {
          include: {
            department: true,
          },
        },
        grades: {
          where: {
            isPublished: true,
          },
          include: {
            offering: {
              include: {
                course: true,
                semester: {
                  include: {
                    academicYear: true,
                  },
                },
              },
            },
          },
          orderBy: [
            { offering: { semester: { startDate: 'asc' } } },
            { offering: { course: { code: 'asc' } } },
          ],
        },
      },
    });

    if (!enrollment) {
      return null;
    }

    // Group grades by semester
    const semesterMap = new Map<string, typeof enrollment.grades>();
    
    for (const grade of enrollment.grades) {
      const semesterId = grade.offering.semester.id;
      if (!semesterMap.has(semesterId)) {
        semesterMap.set(semesterId, []);
      }
      semesterMap.get(semesterId)!.push(grade);
    }

    // Build semester data
    const semesters = [];
    let cumulativeGPA = 0;
    let totalCreditsEarned = 0;

    for (const [semesterId, grades] of semesterMap.entries()) {
      const semesterInfo = grades[0].offering.semester;
      const semesterGPA = await GPAService.calculateSemesterGPA(enrollmentId, semesterId);
      
      const courses = grades.map(grade => ({
        code: grade.offering.course.code,
        name: grade.offering.course.name,
        creditHours: grade.creditHours,
        grade: grade.letterGrade || 'N/A',
        gradePoints: Number(grade.gradePoints || 0),
      }));

      const creditsEarned = grades
        .filter(g => Number(g.gradePoints || 0) > 0)
        .reduce((sum, g) => sum + g.creditHours, 0);

      totalCreditsEarned += creditsEarned;
      cumulativeGPA = await GPAService.calculateCumulativeGPA(enrollmentId);

      semesters.push({
        semester: semesterInfo.name,
        academicYear: semesterInfo.academicYear.name,
        courses,
        semesterGPA,
        cumulativeGPA,
        creditsEarned,
      });
    }

    // Check graduation eligibility
    const graduationEligibility = await GPAService.checkGraduationEligibility(enrollmentId);

    const transcriptData: TranscriptData = {
      student: {
        name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        registrationNumber: enrollment.registrationNumber,
        nationalId: enrollment.student.nationalId || undefined,
        program: enrollment.program.name,
        department: enrollment.program.department?.name || 'N/A',
      },
      academic: {
        enrollmentDate: enrollment.enrollmentDate,
        expectedGraduation: enrollment.expectedGraduation || undefined,
        yearOfStudy: enrollment.yearOfStudy,
        currentGPA: Number(enrollment.currentGPA || 0),
        cumulativeCredits: enrollment.cumulativeCredits,
        status: enrollment.status,
        academicStanding: GPAService.getAcademicStanding(Number(enrollment.currentGPA || 0)),
      },
      semesters,
      summary: {
        totalCreditsRequired: enrollment.program.creditHours,
        totalCreditsEarned,
        overallGPA: cumulativeGPA,
        academicStanding: GPAService.getAcademicStanding(cumulativeGPA),
        graduationEligibility: {
          eligible: graduationEligibility.eligible,
          reason: graduationEligibility.reason,
        },
      },
    };

    return transcriptData;
  }

  /**
   * Save transcript record
   */
  static async saveTranscript(
    enrollmentId: string,
    generatedBy?: string,
    isOfficial: boolean = false
  ): Promise<string> {
    const transcriptData = await this.generateTranscriptData(enrollmentId);

    if (!transcriptData) {
      throw new Error('Could not generate transcript data');
    }

    const transcript = await prisma.transcript.create({
      data: {
        enrollmentId,
        generatedBy,
        academicData: JSON.stringify(transcriptData),
        isOfficial,
      },
    });

    return transcript.id;
  }

  /**
   * Get transcript by ID
   */
  static async getTranscript(transcriptId: string) {
    const transcript = await prisma.transcript.findUnique({
      where: { id: transcriptId },
      include: {
        enrollment: {
          include: {
            student: true,
            program: true,
          },
        },
      },
    });

    if (!transcript) {
      return null;
    }

    return {
      id: transcript.id,
      student: {
        name: `${transcript.enrollment.student.firstName} ${transcript.enrollment.student.lastName}`,
        registrationNumber: transcript.enrollment.registrationNumber,
      },
      program: transcript.enrollment.program.name,
      generatedDate: transcript.generatedDate,
      isOfficial: transcript.isOfficial,
      data: JSON.parse(transcript.academicData),
    };
  }

  /**
   * Get all transcripts for a student
   */
  static async getStudentTranscripts(enrollmentId: string) {
    const transcripts = await prisma.transcript.findMany({
      where: { enrollmentId },
      orderBy: { generatedDate: 'desc' },
    });

    return transcripts.map(t => ({
      id: t.id,
      generatedDate: t.generatedDate,
      isOfficial: t.isOfficial,
    }));
  }

  /**
   * Generate HTML transcript for printing/PDF
   */
  static generateHTMLTranscript(data: TranscriptData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Academic Transcript</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      background: white;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #333;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24pt;
      color: #1a1a1a;
    }
    .header h2 {
      margin: 5px 0;
      font-size: 18pt;
      color: #333;
    }
    .student-info {
      margin-bottom: 30px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      font-size: 11pt;
    }
    .label {
      font-weight: bold;
      width: 200px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 10pt;
    }
    th {
      background: #f0f0f0;
      padding: 10px;
      text-align: left;
      border: 1px solid #333;
      font-weight: bold;
    }
    td {
      padding: 8px;
      border: 1px solid #999;
    }
    .semester-header {
      background: #e0e0e0;
      font-weight: bold;
      padding: 12px;
      margin-top: 20px;
    }
    .gpa-row {
      background: #f9f9f9;
      font-weight: bold;
    }
    .summary {
      margin-top: 30px;
      padding: 20px;
      background: #f5f5f5;
      border: 2px solid #333;
    }
    .summary h3 {
      margin-top: 0;
    }
    .grading-scale {
      margin-top: 30px;
      font-size: 9pt;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #999;
      font-size: 9pt;
      color: #666;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ACADEMIC TRANSCRIPT</h1>
    <h2>Official Record of Academic Achievement</h2>
  </div>

  <div class="student-info">
    <div class="info-row">
      <span class="label">Student Name:</span>
      <span>${data.student.name}</span>
    </div>
    <div class="info-row">
      <span class="label">Registration Number:</span>
      <span>${data.student.registrationNumber}</span>
    </div>
    ${data.student.nationalId ? `
    <div class="info-row">
      <span class="label">National ID:</span>
      <span>${data.student.nationalId}</span>
    </div>
    ` : ''}
    <div class="info-row">
      <span class="label">Program:</span>
      <span>${data.student.program}</span>
    </div>
    <div class="info-row">
      <span class="label">Department:</span>
      <span>${data.student.department}</span>
    </div>
    <div class="info-row">
      <span class="label">Enrollment Date:</span>
      <span>${new Date(data.academic.enrollmentDate).toLocaleDateString()}</span>
    </div>
  </div>

  ${data.semesters.map(semester => `
    <div class="semester-header">
      ${semester.semester} - ${semester.academicYear}
    </div>
    <table>
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Course Name</th>
          <th style="text-align: center;">Credits</th>
          <th style="text-align: center;">Grade</th>
          <th style="text-align: center;">Grade Points</th>
        </tr>
      </thead>
      <tbody>
        ${semester.courses.map(course => `
          <tr>
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td style="text-align: center;">${course.creditHours}</td>
            <td style="text-align: center;">${course.grade}</td>
            <td style="text-align: center;">${course.gradePoints.toFixed(2)}</td>
          </tr>
        `).join('')}
        <tr class="gpa-row">
          <td colspan="2">Semester Summary</td>
          <td style="text-align: center;">${semester.creditsEarned} earned</td>
          <td colspan="2" style="text-align: center;">Semester GPA: ${semester.semesterGPA.toFixed(2)} | Cumulative GPA: ${semester.cumulativeGPA.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  `).join('')}

  <div class="summary">
    <h3>Academic Summary</h3>
    <div class="info-row">
      <span class="label">Cumulative GPA:</span>
      <span>${data.summary.overallGPA.toFixed(2)} / 4.0</span>
    </div>
    <div class="info-row">
      <span class="label">Credits Earned:</span>
      <span>${data.summary.totalCreditsEarned} / ${data.summary.totalCreditsRequired}</span>
    </div>
    <div class="info-row">
      <span class="label">Academic Standing:</span>
      <span>${data.summary.academicStanding}</span>
    </div>
    <div class="info-row">
      <span class="label">Graduation Status:</span>
      <span>${data.summary.graduationEligibility.eligible ? 'Eligible for Graduation' : data.summary.graduationEligibility.reason}</span>
    </div>
  </div>

  <div class="grading-scale">
    <strong>Grading Scale:</strong> A (70-100) = 4.0 | B (60-69) = 3.0 | C (50-59) = 2.0 | D (40-49) = 1.0 | E (0-39) = 0.0
  </div>

  <div class="footer">
    <p>This is an official academic transcript generated on ${new Date().toLocaleDateString()}.</p>
    <p>This document contains the complete academic record as maintained by the institution.</p>
  </div>
</body>
</html>
    `.trim();
  }
}

export default TranscriptService;

