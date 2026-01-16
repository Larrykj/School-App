import { Router } from 'express';
import { getSubjects, createSubject } from '../controllers/subjectController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = Router();

router.get('/', authenticate, getSubjects);
router.post('/', authenticate, requireAdmin, createSubject);

export default router;

