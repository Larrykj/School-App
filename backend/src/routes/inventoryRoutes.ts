import { Router } from 'express';
import {
  createInventoryItem,
  getInventoryItems,
  recordMovement,
  getMovementHistory,
} from '../controllers/inventoryController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = Router();

router.post('/items', authenticate, requireAdmin, createInventoryItem);
router.get('/items', authenticate, getInventoryItems);
router.post('/movements', authenticate, requireAdmin, recordMovement);
router.get('/movements', authenticate, getMovementHistory);

export default router;

