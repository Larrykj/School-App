import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  submitApplication,
  reviewApplication,
  approveApplication,
  rejectApplication,
  getApplicationStatistics,
  deleteApplication,
} from '../controllers/applicationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes (for applicants)
router.post('/', createApplication);

// Protected routes
router.get('/', authenticate, getApplications);
router.get('/statistics', authenticate, getApplicationStatistics);
router.get('/:id', authenticate, getApplicationById);
router.put('/:id', authenticate, updateApplication);
router.delete('/:id', authenticate, deleteApplication);

// Application workflow
router.post('/:id/submit', authenticate, submitApplication);
router.put('/:id/review', authenticate, reviewApplication);
router.put('/:id/approve', authenticate, approveApplication);
router.put('/:id/reject', authenticate, rejectApplication);

export default router;

