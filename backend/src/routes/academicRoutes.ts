import { Router } from 'express';
import {
  // Programs
  getAllPrograms,
  createProgram,
  // Departments
  getAllDepartments,
  // Courses
  getAllCourses,
  createCourse,
  // Semesters
  getAllSemesters,
  getActiveSemester,
  createSemester,
  // Course Offerings
  getCourseOfferings,
  createCourseOffering,
  // Course Registration
  registerCourse,
  dropCourse,
  getStudentCourses,
  getAvailableCourses,
  // Grades & GPA
  submitGrade,
  getStudentGPA,
  // Transcripts
  generateTranscript,
  getTranscript,
  getTranscriptHTML,
} from '../controllers/academicController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = Router();

// ============================================
// PROGRAMS
// ============================================
router.get('/programs', authenticate, getAllPrograms);
router.post('/programs', authenticate, requireAdmin, createProgram);

// ============================================
// DEPARTMENTS
// ============================================
router.get('/departments', authenticate, getAllDepartments);

// ============================================
// COURSES
// ============================================
router.get('/courses', authenticate, getAllCourses);
router.post('/courses', authenticate, requireAdmin, createCourse);

// ============================================
// SEMESTERS
// ============================================
router.get('/semesters', authenticate, getAllSemesters);
router.get('/semesters/active', authenticate, getActiveSemester);
router.post('/semesters', authenticate, requireAdmin, createSemester);

// ============================================
// COURSE OFFERINGS
// ============================================
router.get('/offerings', authenticate, getCourseOfferings);
router.post('/offerings', authenticate, requireAdmin, createCourseOffering);

// ============================================
// COURSE REGISTRATION
// ============================================
router.post('/registrations', authenticate, registerCourse);
router.delete('/registrations/:registrationId', authenticate, dropCourse);
router.get('/registrations/student', authenticate, getStudentCourses);
router.get('/registrations/available', authenticate, getAvailableCourses);

// ============================================
// GRADES & GPA
// ============================================
router.post('/grades', authenticate, submitGrade);
router.get('/gpa/:enrollmentId', authenticate, getStudentGPA);

// ============================================
// TRANSCRIPTS
// ============================================
router.post('/transcripts/:enrollmentId', authenticate, generateTranscript);
router.get('/transcripts/:transcriptId', authenticate, getTranscript);
router.get('/transcripts/:enrollmentId/html', authenticate, getTranscriptHTML);

export default router;

