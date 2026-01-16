import { Router } from 'express';
import { getTeachers, getTeacherById, createTeacher } from '../controllers/teacherController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = Router();

router.get('/', authenticate, getTeachers);
router.get('/:id', authenticate, getTeacherById);
router.post('/', authenticate, requireAdmin, createTeacher);

export default router;

