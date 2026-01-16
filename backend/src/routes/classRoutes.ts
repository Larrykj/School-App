import { Router } from 'express';
import { createClass, getClasses, getClass } from '../controllers/classController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = Router();

router.post('/', authenticate, requireAdmin, createClass);
router.get('/', authenticate, getClasses);
router.get('/:id', authenticate, getClass);

export default router;

