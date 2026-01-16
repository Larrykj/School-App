import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import CourseRegistrationService from '../services/courseRegistrationService';
import GPAService from '../services/gpaService';
import TranscriptService from '../services/transcriptService';

// ============================================
// PROGRAMS
// ============================================

export const getAllPrograms = async (req: Request, res: Response): Promise<void> => {
  try {
    const programs = await prisma.academicProgram.findMany({
      where: { isActive: true },
      include: {
        department: true,
        _count: {
          select: { students: true, courses: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ programs });
  } catch (error: any) {
    console.error('Get programs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, programType, departmentId, duration, creditHours, description } = req.body;

    const program = await prisma.academicProgram.create({
      data: {
        code,
        name,
        programType,
        departmentId,
        duration,
        creditHours,
        description,
      },
      include: {
        department: true,
      },
    });

    res.status(201).json({ message: 'Program created successfully', program });
  } catch (error: any) {
    console.error('Create program error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ============================================
// DEPARTMENTS
// ============================================

export const getAllDepartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { programs: true, courses: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ departments });
  } catch (error: any) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ============================================
// COURSES
// ============================================

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { departmentId, level } = req.query;

    const where: any = { isActive: true };
    if (departmentId) where.departmentId = departmentId;
    if (level) where.level = parseInt(level as string);

    const courses = await prisma.course.findMany({
      where,
      include: {
        department: true,
        prerequisites: {
          include: {
            prerequisite: true,
          },
        },
      },
      orderBy: [{ code: 'asc' }],
    });

    res.json({ courses });
  } catch (error: any) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, description, creditHours, departmentId, level, isElective } = req.body;

    const course = await prisma.course.create({
      data: {
        code,
        name,
        description,
        creditHours,
        departmentId,
        level,
        isElective,
      },
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error: any) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ============================================
// SEMESTERS
// ============================================

export const getAllSemesters = async (req: Request, res: Response): Promise<void> => {
  try {
    const semesters = await prisma.semester.findMany({
      include: {
        academicYear: true,
        _count: {
          select: { offerings: true, registrations: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    res.json({ semesters });
  } catch (error: any) {
    console.error('Get semesters error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActiveSemester = async (req: Request, res: Response): Promise<void> => {
  try {
    const semester = await prisma.semester.findFirst({
      where: { status: 'ACTIVE' },
      include: {
        academicYear: true,
      },
    });

    if (!semester) {
      res.status(404).json({ error: 'No active semester found' });
      return;
    }

    res.json({ semester });
  } catch (error: any) {
    console.error('Get active semester error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createSemester = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      academicYearId,
      name,
      startDate,
      endDate,
      registrationStart,
      registrationEnd,
    } = req.body;

    const semester = await prisma.semester.create({
      data: {
        academicYearId,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registrationStart: new Date(registrationStart),
        registrationEnd: new Date(registrationEnd),
      },
      include: {
        academicYear: true,
      },
    });

    res.status(201).json({ message: 'Semester created successfully', semester });
  } catch (error: any) {
    console.error('Create semester error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ============================================
// COURSE OFFERINGS
// ============================================

export const getCourseOfferings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { semesterId } = req.query;

    const where: any = {};
    if (semesterId) where.semesterId = semesterId;

    const offerings = await prisma.courseOffering.findMany({
      where,
      include: {
        course: true,
        semester: {
          include: {
            academicYear: true,
          },
        },
        lecturer: {
          include: {
            user: true,
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: [{ semester: { startDate: 'desc' } }, { course: { code: 'asc' } }],
    });

    res.json({ offerings });
  } catch (error: any) {
    console.error('Get course offerings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCourseOffering = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, semesterId, lecturerId, venue, maxStudents, schedule } = req.body;

    const offering = await prisma.courseOffering.create({
      data: {
        courseId,
        semesterId,
        lecturerId,
        venue,
        maxStudents,
        schedule,
      },
      include: {
        course: true,
        semester: true,
        lecturer: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json({ message: 'Course offering created successfully', offering });
  } catch (error: any) {
    console.error('Create course offering error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ============================================
// COURSE REGISTRATION
// ============================================

export const registerCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId, offeringId, semesterId } = req.body;

    const result = await CourseRegistrationService.registerCourse(
      enrollmentId,
      offeringId,
      semesterId
    );

    if (!result.success) {
      res.status(400).json({ error: result.message });
      return;
    }

    res.status(201).json({
      message: result.message,
      registrationId: result.registrationId,
    });
  } catch (error: any) {
    console.error('Register course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const dropCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId } = req.params;
    const { reason } = req.body;

    const result = await CourseRegistrationService.dropCourse(registrationId, reason);

    if (!result.success) {
      res.status(400).json({ error: result.message });
      return;
    }

    res.json({ message: result.message });
  } catch (error: any) {
    console.error('Drop course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId, semesterId } = req.query;

    if (!enrollmentId || !semesterId) {
      res.status(400).json({ error: 'enrollmentId and semesterId are required' });
      return;
    }

    const courses = await CourseRegistrationService.getStudentCourses(
      enrollmentId as string,
      semesterId as string
    );

    res.json({ courses });
  } catch (error: any) {
    console.error('Get student courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAvailableCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId, semesterId } = req.query;

    if (!enrollmentId || !semesterId) {
      res.status(400).json({ error: 'enrollmentId and semesterId are required' });
      return;
    }

    const courses = await CourseRegistrationService.getAvailableCourses(
      enrollmentId as string,
      semesterId as string
    );

    res.json({ courses });
  } catch (error: any) {
    console.error('Get available courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ============================================
// GRADES & GPA
// ============================================

export const submitGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId, offeringId, catMarks, examMarks, submittedBy } = req.body;

    await GPAService.calculateCourseGrade(enrollmentId, offeringId, catMarks, examMarks);

    // Mark as submitted
    await prisma.courseGrade.updateMany({
      where: {
        enrollmentId,
        offeringId,
      },
      data: {
        submittedBy,
        submittedDate: new Date(),
      },
    });

    res.json({ message: 'Grade submitted successfully' });
  } catch (error: any) {
    console.error('Submit grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentGPA = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      res.status(404).json({ error: 'Enrollment not found' });
      return;
    }

    const cgpa = await GPAService.calculateCumulativeGPA(enrollmentId);
    const academicStanding = GPAService.getAcademicStanding(cgpa);
    const graduationEligibility = await GPAService.checkGraduationEligibility(enrollmentId);

    res.json({
      currentGPA: Number(enrollment.currentGPA || 0),
      cumulativeGPA: cgpa,
      cumulativeCredits: enrollment.cumulativeCredits,
      academicStanding,
      graduationEligibility,
    });
  } catch (error: any) {
    console.error('Get student GPA error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ============================================
// TRANSCRIPTS
// ============================================

export const generateTranscript = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId } = req.params;
    const { isOfficial } = req.body;
    const userId = (req as any).user?.id;

    const transcriptId = await TranscriptService.saveTranscript(
      enrollmentId,
      userId,
      isOfficial || false
    );

    res.status(201).json({
      message: 'Transcript generated successfully',
      transcriptId,
    });
  } catch (error: any) {
    console.error('Generate transcript error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTranscript = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transcriptId } = req.params;

    const transcript = await TranscriptService.getTranscript(transcriptId);

    if (!transcript) {
      res.status(404).json({ error: 'Transcript not found' });
      return;
    }

    res.json({ transcript });
  } catch (error: any) {
    console.error('Get transcript error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTranscriptHTML = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId } = req.params;

    const transcriptData = await TranscriptService.generateTranscriptData(enrollmentId);

    if (!transcriptData) {
      res.status(404).json({ error: 'Transcript data not found' });
      return;
    }

    const html = TranscriptService.generateHTMLTranscript(transcriptData);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error: any) {
    console.error('Get transcript HTML error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

