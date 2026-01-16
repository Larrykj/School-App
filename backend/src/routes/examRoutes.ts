import { Router } from 'express';
import {
  createExam,
  getExams,
  enterMarks,
  getExamMarks,
  generateReportCard,
  downloadReportCard,
} from '../controllers/examController';
import { authenticate } from '../middleware/auth';
import { requireTeacher } from '../middleware/rbac';

const router = Router();

router.post('/', authenticate, requireTeacher, createExam);
router.get('/', authenticate, getExams);
router.post('/marks', authenticate, requireTeacher, enterMarks);
router.get('/:examId/marks', authenticate, getExamMarks);
router.post('/report-card', authenticate, requireTeacher, generateReportCard);
router.get('/report-card/:id/download', authenticate, downloadReportCard);

export default router;

