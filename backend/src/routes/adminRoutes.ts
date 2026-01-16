import { Router } from 'express';
import { getDashboardStats, getFeeCollectionSummary } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = Router();

router.get('/dashboard', authenticate, requireAdmin, getDashboardStats);
router.get('/fee-collection', authenticate, requireAdmin, getFeeCollectionSummary);

export default router;

