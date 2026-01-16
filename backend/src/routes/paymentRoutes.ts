import { Router } from 'express';
import {
  createPayment,
  getPayments,
  getPayment,
  downloadReceipt,
  sendFeeReminder,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { requireAccountant } from '../middleware/rbac';

const router = Router();

router.post('/', authenticate, createPayment);
router.get('/', authenticate, getPayments);
router.get('/:id', authenticate, getPayment);
router.get('/:id/receipt', authenticate, downloadReceipt);
router.post('/reminder', authenticate, requireAccountant, sendFeeReminder);

export default router;

