import { Router } from 'express';
import {
  getFeeAnalytics,
  getPerformanceAnalytics,
  getAttendanceAnalytics,
  getRevenueForecast,
  getDashboardStats,
} from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = Router();

// All analytics routes require authentication
// Most require admin role
router.get('/fees', authenticate, requireAdmin, getFeeAnalytics);
router.get('/performance', authenticate, getPerformanceAnalytics);
router.get('/attendance', authenticate, getAttendanceAnalytics);
router.get('/forecast', authenticate, requireAdmin, getRevenueForecast);
router.get('/dashboard', authenticate, getDashboardStats);

export default router;

