import { Router } from 'express';
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController';
import { authenticate } from '../middleware/auth';
import { requireAdmin, requireAccountant } from '../middleware/rbac';

const router = Router();

router.post('/', authenticate, requireAdmin, createStudent);
router.get('/', authenticate, getStudents);
router.get('/:id', authenticate, getStudent);
router.put('/:id', authenticate, requireAdmin, updateStudent);
router.delete('/:id', authenticate, requireAdmin, deleteStudent);

export default router;

