import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { FeeService } from '../services/feeService';
import { ExcelService } from '../services/excelService';

export const createFeeStructure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, amount, term, academicYear } = req.body;

    const feeStructure = await prisma.feeStructure.create({
      data: {
        name,
        amount,
        term,
        academicYear,
      },
    });

    res.status(201).json({ message: 'Fee structure created successfully', feeStructure });
  } catch (error: any) {
    console.error('Create fee structure error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFeeStructures = async (req: Request, res: Response): Promise<void> => {
  try {
    const { academicYear, term, isActive } = req.query;

    const where: any = {};
    if (academicYear) where.academicYear = academicYear;
    if (term) where.term = term;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const feeStructures = await prisma.feeStructure.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ feeStructures });
  } catch (error: any) {
    console.error('Get fee structures error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFeeStructureById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id },
    });

    if (!feeStructure) {
      res.status(404).json({ error: 'Fee structure not found' });
      return;
    }

    res.json({ feeStructure });
  } catch (error: any) {
    console.error('Get fee structure by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const assignFeesToStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, feeStructureIds, term, academicYear } = req.body;

    await FeeService.assignFees(studentId, feeStructureIds, term, academicYear);

    res.json({ message: 'Fees assigned successfully' });
  } catch (error: any) {
    console.error('Assign fees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const assignFeesToMultipleStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { feeStructureId, studentIds } = req.body;

    if (!feeStructureId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      res.status(400).json({ error: 'Invalid request. Provide feeStructureId and studentIds array' });
      return;
    }

    // Get fee structure
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });

    if (!feeStructure) {
      res.status(404).json({ error: 'Fee structure not found' });
      return;
    }

    // Set due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create student fees for all selected students
    const studentFees = studentIds.map((studentId) => ({
      studentId,
      feeStructureId,
      amount: feeStructure.amount,
      amountPaid: '0',
      balance: feeStructure.amount,
      status: 'PENDING' as const,
      dueDate,
    }));

    await prisma.studentFee.createMany({
      data: studentFees,
      skipDuplicates: true, // Skip if already assigned
    });

    res.json({ 
      message: `Fee assigned to ${studentIds.length} student(s) successfully`,
      count: studentIds.length 
    });
  } catch (error: any) {
    console.error('Assign fees to multiple students error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export const getStudentFees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    const fees = await prisma.studentFee.findMany({
      where: { studentId },
      include: {
        feeStructure: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    const balance = await FeeService.calculateBalance(studentId);

    res.json({ fees, balance });
  } catch (error: any) {
    console.error('Get student fees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClassFeeReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;

    const report = await FeeService.getClassFeeReport(classId);

    res.json({ report });
  } catch (error: any) {
    console.error('Get class fee report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const exportClassFeeReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;

    const filePath = await ExcelService.exportFeeReport(classId);

    res.download(filePath, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download file' });
      }
    });
  } catch (error: any) {
    console.error('Export fee report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTermFeeSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { term, academicYear } = req.query;

    if (!term || !academicYear) {
      res.status(400).json({ error: 'Term and academic year are required' });
      return;
    }

    const summary = await FeeService.getTermFeeSummary(
      term as string,
      academicYear as string
    );

    res.json({ summary });
  } catch (error: any) {
    console.error('Get term fee summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

