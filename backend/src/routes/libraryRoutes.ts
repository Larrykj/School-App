import { Router } from 'express';
import {
  createBook,
  getBooks,
  borrowBook,
  returnBook,
  getBorrowHistory,
} from '../controllers/libraryController';
import { authenticate } from '../middleware/auth';
import { requireAdmin, requireTeacher } from '../middleware/rbac';

const router = Router();

router.post('/books', authenticate, requireAdmin, createBook);
router.get('/books', authenticate, getBooks);
router.post('/borrow', authenticate, requireTeacher, borrowBook);
router.post('/return/:id', authenticate, requireTeacher, returnBook);
router.get('/borrow-history', authenticate, getBorrowHistory);

export default router;

