import { Router } from 'express';
import {
  createTransportRoute,
  getTransportRoutes,
  assignStudentToRoute,
  trackTransport,
  getTransportTracking,
} from '../controllers/transportController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = Router();

router.post('/routes', authenticate, requireAdmin, createTransportRoute);
router.get('/routes', authenticate, getTransportRoutes);
router.post('/assignments', authenticate, requireAdmin, assignStudentToRoute);
router.post('/track', authenticate, trackTransport);
router.get('/track', authenticate, getTransportTracking);

export default router;

