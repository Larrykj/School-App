import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { FeeService } from '../services/feeService';

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationalId,
      phone,
      address,
      classId,
      parentId,
      dormitoryId,
      transportId,
    } = req.body;

    // Generate admission number
    const year = new Date().getFullYear();
    const count = await prisma.student.count({
      where: {
        admissionNumber: {
          startsWith: `ADM${year}`,
        },
      },
    });
    const admissionNumber = `ADM${year}${String(count + 1).padStart(4, '0')}`;

    const student = await prisma.student.create({
      data: {
        admissionNumber,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        nationalId,
        phone,
        address,
        classId,
        parentId,
        dormitoryId,
        transportId,
      },
      include: {
        class: true,
        parent: {
          include: {
            user: true,
          },
        },
        dormitory: true,
        transport: true,
      },
    });

    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error: any) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, search, page = '1', limit = '50' } = req.query;

    const where: any = { isActive: true };
    if (classId) where.classId = classId;
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { admissionNumber: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          class: true,
          parent: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where }),
    ]);

    res.json({
      students,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: true,
        parent: {
          include: {
            user: true,
          },
        },
        dormitory: true,
        transport: true,
        fees: {
          include: {
            feeStructure: true,
          },
        },
      },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    // Calculate fee balance
    const balance = await FeeService.calculateBalance(student.id);

    res.json({ student, feeBalance: balance });
  } catch (error: any) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const student = await prisma.student.update({
      where: { id },
      data: updateData,
      include: {
        class: true,
        parent: {
          include: {
            user: true,
          },
        },
      },
    });

    res.json({ message: 'Student updated successfully', student });
  } catch (error: any) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.student.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Student deactivated successfully' });
  } catch (error: any) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

