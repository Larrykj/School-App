import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { ExamType } from '@prisma/client';
import { PdfService } from '../services/pdfService';
import { addReportCardJob } from '../services/queueService';

export const createExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, examType, classId, subject, date, maxMarks, academicYear, term } = req.body;
    const createdById = (req as any).user?.userId;

    if (!createdById) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        examType: examType as ExamType,
        classId,
        subject,
        date: new Date(date),
        maxMarks,
        academicYear,
        term,
        createdById,
      },
      include: {
        class: true,
        createdBy: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error: any) {
    console.error('Create exam error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getExams = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, academicYear, term, examType } = req.query;

    const where: any = {};
    if (classId) where.classId = classId;
    if (academicYear) where.academicYear = academicYear;
    if (term) where.term = term;
    if (examType) where.examType = examType;

    const exams = await prisma.exam.findMany({
      where,
      include: {
        class: true,
        createdBy: {
          include: {
            user: true,
          },
        },
        _count: {
          select: { marks: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json({ exams });
  } catch (error: any) {
    console.error('Get exams error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const enterMarks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId, marks } = req.body; // marks is array of { studentId, marks, grade?, remarks? }

    const created = [];

    for (const markData of marks) {
      const { studentId, marks: markValue, grade, remarks } = markData;

      // Check if mark exists
      const existing = await prisma.mark.findUnique({
        where: {
          studentId_examId: {
            studentId,
            examId,
          },
        },
      });

      if (existing) {
        const updated = await prisma.mark.update({
          where: { id: existing.id },
          data: {
            marks: markValue,
            grade,
            remarks,
          },
        });
        created.push(updated);
      } else {
        const newMark = await prisma.mark.create({
          data: {
            studentId,
            examId,
            marks: markValue,
            grade,
            remarks,
          },
        });
        created.push(newMark);
      }
    }

    res.status(201).json({ message: 'Marks entered successfully', marks: created });
  } catch (error: any) {
    console.error('Enter marks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getExamMarks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;

    const marks = await prisma.mark.findMany({
      where: { examId },
      include: {
        student: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        marks: 'desc',
      },
    });

    res.json({ marks });
  } catch (error: any) {
    console.error('Get exam marks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const generateReportCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, academicYear, term } = req.body;

    // Get all exams for this term
    const exams = await prisma.exam.findMany({
      where: {
        academicYear,
        term,
        class: {
          students: {
            some: { id: studentId },
          },
        },
      },
      include: {
        marks: {
          where: { studentId },
        },
      },
    });

    // Calculate totals and average
    let totalMarks = 0;
    let count = 0;

    exams.forEach((exam) => {
      const mark = exam.marks[0];
      if (mark) {
        totalMarks += Number(mark.marks);
        count++;
      }
    });

    const average = count > 0 ? totalMarks / count : 0;

    // Calculate position (simplified - would need to compare with all students)
    // For now, we'll leave it null and calculate it separately if needed

    // Determine grade based on KCPE/KCSE scale (simplified)
    let grade = 'E';
    if (average >= 80) grade = 'A';
    else if (average >= 70) grade = 'B';
    else if (average >= 60) grade = 'C';
    else if (average >= 50) grade = 'D';

    // Check if report card already exists
    const existing = await prisma.reportCard.findUnique({
      where: {
        studentId_academicYear_term: {
          studentId,
          academicYear,
          term,
        },
      },
    });

    let reportCard;
    if (existing) {
      reportCard = await prisma.reportCard.update({
        where: { id: existing.id },
        data: {
          totalMarks,
          average,
          grade,
        },
      });
    } else {
      reportCard = await prisma.reportCard.create({
        data: {
          studentId,
          academicYear,
          term,
          totalMarks,
          average,
          grade,
        },
      });
    }

    // Generate PDF (Async via Queue)
    await addReportCardJob(reportCard.id);

    res.json({ message: 'Report card generation started', reportCard });
  } catch (error: any) {
    console.error('Generate report card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const downloadReportCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const reportCard = await prisma.reportCard.findUnique({
      where: { id },
    });

    if (!reportCard || !reportCard.pdfPath) {
      res.status(404).json({ error: 'Report card not found or PDF not generated' });
      return;
    }

    res.download(reportCard.pdfPath, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download report card' });
      }
    });
  } catch (error: any) {
    console.error('Download report card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

