import { Router } from 'express';
import {
  createFeeStructure,
  getFeeStructures,
  getFeeStructureById,
  assignFeesToStudent,
  assignFeesToMultipleStudents,
  getStudentFees,
  getClassFeeReport,
  exportClassFeeReport,
  getTermFeeSummary,
} from '../controllers/feeController';
import { authenticate } from '../middleware/auth';
import { requireAccountant } from '../middleware/rbac';

const router = Router();

router.post('/structures', authenticate, requireAccountant, createFeeStructure);
router.get('/structures', authenticate, getFeeStructures);
router.get('/structures/:id', authenticate, getFeeStructureById);
router.post('/assign', authenticate, requireAccountant, assignFeesToMultipleStudents);
router.post('/assign-single', authenticate, requireAccountant, assignFeesToStudent);
router.get('/student/:studentId', authenticate, getStudentFees);
router.get('/class/:classId/report', authenticate, getClassFeeReport);
router.get('/class/:classId/export', authenticate, requireAccountant, exportClassFeeReport);
router.get('/summary', authenticate, requireAccountant, getTermFeeSummary);

export default router;

