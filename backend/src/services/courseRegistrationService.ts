import prisma from '../utils/prisma';

/**
 * Course Registration Service with Prerequisite Validation
 */

interface RegistrationValidation {
  canRegister: boolean;
  reason?: string;
  missingPrerequisites?: string[];
}

export class CourseRegistrationService {
  /**
   * Validate if student can register for a course
   */
  static async validateRegistration(
    enrollmentId: string,
    courseId: string
  ): Promise<RegistrationValidation> {
    // Get student enrollment
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      return { canRegister: false, reason: 'Enrollment not found' };
    }

    // Check if student is active
    if (enrollment.status !== 'ACTIVE') {
      return { canRegister: false, reason: `Student status is ${enrollment.status}` };
    }

    // Get course with prerequisites
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        prerequisites: {
          include: {
            prerequisite: true,
          },
        },
      },
    });

    if (!course) {
      return { canRegister: false, reason: 'Course not found' };
    }

    if (!course.isActive) {
      return { canRegister: false, reason: 'Course is not active' };
    }

    // Check prerequisites
    const missingPrerequisites: string[] = [];

    for (const prereqRelation of course.prerequisites) {
      if (!prereqRelation.isStrict) continue; // Skip non-strict prerequisites

      const prerequisiteCourse = prereqRelation.prerequisite;
      
      // Check if student has completed and passed the prerequisite
      const prerequisiteGrade = await prisma.courseGrade.findFirst({
        where: {
          enrollmentId,
          offering: {
            courseId: prerequisiteCourse.id,
          },
          isPublished: true,
          gradePoints: { gt: 0 }, // Must have passed (grade points > 0)
        },
      });

      if (!prerequisiteGrade) {
        missingPrerequisites.push(
          `${prerequisiteCourse.code} - ${prerequisiteCourse.name}`
        );
      }
    }

    if (missingPrerequisites.length > 0) {
      return {
        canRegister: false,
        reason: 'Missing required prerequisites',
        missingPrerequisites,
      };
    }

    return { canRegister: true };
  }

  /**
   * Register student for a course
   */
  static async registerCourse(
    enrollmentId: string,
    offeringId: string,
    semesterId: string
  ): Promise<{ success: boolean; message: string; registrationId?: string }> {
    // Get offering details
    const offering = await prisma.courseOffering.findUnique({
      where: { id: offeringId },
      include: {
        course: true,
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!offering) {
      return { success: false, message: 'Course offering not found' };
    }

    // Check if offering is full
    if (offering._count.registrations >= offering.maxStudents) {
      return { success: false, message: 'Course is full' };
    }

    // Validate prerequisites
    const validation = await this.validateRegistration(enrollmentId, offering.courseId);
    
    if (!validation.canRegister) {
      return {
        success: false,
        message: validation.reason || 'Cannot register',
      };
    }

    // Check if already registered
    const existingRegistration = await prisma.courseRegistration.findUnique({
      where: {
        enrollmentId_offeringId: {
          enrollmentId,
          offeringId,
        },
      },
    });

    if (existingRegistration) {
      if (existingRegistration.status === 'DROPPED') {
        // Re-register dropped course
        const updated = await prisma.courseRegistration.update({
          where: { id: existingRegistration.id },
          data: {
            status: 'PENDING',
            registeredDate: new Date(),
            droppedDate: null,
            dropReason: null,
          },
        });

        return {
          success: true,
          message: 'Re-registered for course successfully',
          registrationId: updated.id,
        };
      }

      return { success: false, message: 'Already registered for this course' };
    }

    // Create registration
    const registration = await prisma.courseRegistration.create({
      data: {
        enrollmentId,
        offeringId,
        semesterId,
        status: 'PENDING', // Requires approval
      },
    });

    return {
      success: true,
      message: 'Course registration submitted successfully',
      registrationId: registration.id,
    };
  }

  /**
   * Drop a course
   */
  static async dropCourse(
    registrationId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    const registration = await prisma.courseRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return { success: false, message: 'Registration not found' };
    }

    if (registration.status === 'DROPPED') {
      return { success: false, message: 'Course already dropped' };
    }

    await prisma.courseRegistration.update({
      where: { id: registrationId },
      data: {
        status: 'DROPPED',
        droppedDate: new Date(),
        dropReason: reason,
      },
    });

    return { success: true, message: 'Course dropped successfully' };
  }

  /**
   * Approve/Reject course registration
   */
  static async approveRegistration(
    registrationId: string,
    approverId: string,
    approved: boolean
  ): Promise<{ success: boolean; message: string }> {
    const registration = await prisma.courseRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return { success: false, message: 'Registration not found' };
    }

    if (registration.status !== 'PENDING') {
      return { success: false, message: 'Registration is not pending' };
    }

    await prisma.courseRegistration.update({
      where: { id: registrationId },
      data: {
        status: approved ? 'APPROVED' : 'REJECTED',
        approvedBy: approverId,
        approvedDate: new Date(),
      },
    });

    return {
      success: true,
      message: approved ? 'Registration approved' : 'Registration rejected',
    };
  }

  /**
   * Get student's registered courses for a semester
   */
  static async getStudentCourses(enrollmentId: string, semesterId: string) {
    const registrations = await prisma.courseRegistration.findMany({
      where: {
        enrollmentId,
        semesterId,
        status: { in: ['PENDING', 'APPROVED'] },
      },
      include: {
        offering: {
          include: {
            course: true,
            lecturer: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        registeredDate: 'desc',
      },
    });

    return registrations.map(reg => ({
      registrationId: reg.id,
      status: reg.status,
      registeredDate: reg.registeredDate,
      courseCode: reg.offering.course.code,
      courseName: reg.offering.course.name,
      creditHours: reg.offering.course.creditHours,
      lecturer: reg.offering.lecturer
        ? `${reg.offering.lecturer.user.firstName} ${reg.offering.lecturer.user.lastName}`
        : 'TBA',
      venue: reg.offering.venue,
    }));
  }

  /**
   * Get available courses for registration
   */
  static async getAvailableCourses(enrollmentId: string, semesterId: string) {
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        program: {
          include: {
            courses: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return [];
    }

    // Get courses for current semester of study
    const programCourses = enrollment.program.courses.filter(
      pc => pc.semester === enrollment.semesterOfStudy
    );

    // Get course offerings for this semester
    const offerings = await prisma.courseOffering.findMany({
      where: {
        semesterId,
        courseId: {
          in: programCourses.map(pc => pc.courseId),
        },
      },
      include: {
        course: true,
        lecturer: {
          include: {
            user: true,
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });

    // Get already registered courses
    const registeredCourses = await prisma.courseRegistration.findMany({
      where: {
        enrollmentId,
        semesterId,
        status: { not: 'DROPPED' },
      },
      select: {
        offeringId: true,
      },
    });

    const registeredOfferingIds = registeredCourses.map(r => r.offeringId);

    // Filter and validate each course
    const availableCourses = [];

    for (const offering of offerings) {
      if (registeredOfferingIds.includes(offering.id)) {
        continue; // Already registered
      }

      const validation = await this.validateRegistration(
        enrollmentId,
        offering.courseId
      );

      const spotsLeft = offering.maxStudents - offering._count.registrations;

      availableCourses.push({
        offeringId: offering.id,
        courseCode: offering.course.code,
        courseName: offering.course.name,
        creditHours: offering.course.creditHours,
        isElective: offering.course.isElective,
        lecturer: offering.lecturer
          ? `${offering.lecturer.user.firstName} ${offering.lecturer.user.lastName}`
          : 'TBA',
        venue: offering.venue,
        maxStudents: offering.maxStudents,
        enrolled: offering._count.registrations,
        spotsLeft,
        isFull: spotsLeft <= 0,
        canRegister: validation.canRegister,
        prerequisitesMet: validation.canRegister,
        missingPrerequisites: validation.missingPrerequisites || [],
      });
    }

    return availableCourses;
  }
}

export default CourseRegistrationService;

