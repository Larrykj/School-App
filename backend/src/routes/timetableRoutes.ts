import { Router } from 'express';
import {
  createTimetableEntry,
  getTimetable,
  deleteTimetableEntry,
  getTimetableByClass,
  updateTimetable,
} from '../controllers/timetableController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = Router();

router.post('/', authenticate, requireAdmin, createTimetableEntry);
router.get('/', authenticate, getTimetable);
router.get('/class/:classId', authenticate, getTimetableByClass);
router.put('/class/:classId', authenticate, requireAdmin, updateTimetable);
router.delete('/:id', authenticate, requireAdmin, deleteTimetableEntry);

export default router;

