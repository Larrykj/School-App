import { Router } from 'express';
import {
  markAttendance,
  getAttendance,
  getAttendanceStats,
  syncOfflineAttendance,
} from '../controllers/attendanceController';
import { authenticate } from '../middleware/auth';
import { requireTeacher } from '../middleware/rbac';

const router = Router();

router.post('/', authenticate, requireTeacher, markAttendance);
router.get('/', authenticate, getAttendance);
router.get('/stats', authenticate, getAttendanceStats);
router.post('/sync', authenticate, requireTeacher, syncOfflineAttendance);

export default router;

