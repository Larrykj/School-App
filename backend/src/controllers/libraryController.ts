import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, isbn, category, quantity, location, purchaseDate, price } = req.body;

    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        category,
        quantity,
        available: quantity,
        location,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        price,
      },
    });

    res.status(201).json({ message: 'Book added successfully', book });
  } catch (error: any) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { author: { contains: search as string, mode: 'insensitive' } },
        { isbn: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;

    const books = await prisma.book.findMany({
      where,
      orderBy: { title: 'asc' },
    });

    res.json({ books });
  } catch (error: any) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const borrowBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId, studentId, dueDate } = req.body;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.available <= 0) {
      res.status(400).json({ error: 'Book not available' });
      return;
    }

    const borrow = await prisma.bookBorrow.create({
      data: {
        bookId,
        studentId,
        dueDate: new Date(dueDate),
      },
    });

    await prisma.book.update({
      where: { id: bookId },
      data: { available: book.available - 1 },
    });

    res.status(201).json({ message: 'Book borrowed successfully', borrow });
  } catch (error: any) {
    console.error('Borrow book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const returnBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const borrow = await prisma.bookBorrow.findUnique({
      where: { id },
      include: { book: true },
    });

    if (!borrow) {
      res.status(404).json({ error: 'Borrow record not found' });
      return;
    }

    const returnDate = new Date();
    const fine = returnDate > borrow.dueDate ? 50 : 0; // KSh 50 per day overdue

    await prisma.bookBorrow.update({
      where: { id },
      data: {
        returnDate,
        status: 'RETURNED',
        fine,
      },
    });

    await prisma.book.update({
      where: { id: borrow.bookId },
      data: { available: borrow.book.available + 1 },
    });

    res.json({ message: 'Book returned successfully', fine });
  } catch (error: any) {
    console.error('Return book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBorrowHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.query;

    const where: any = {};
    if (studentId) where.studentId = studentId;

    const borrows = await prisma.bookBorrow.findMany({
      where,
      include: {
        book: true,
        student: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { borrowDate: 'desc' },
    });

    res.json({ borrows });
  } catch (error: any) {
    console.error('Get borrow history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

