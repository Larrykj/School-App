import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getTeachers = async (req: Request, res: Response): Promise<void> => {
  try {
    const teachers = await prisma.staff.findMany({
      where: {
        user: {
          role: 'TEACHER',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        user: {
          firstName: 'asc',
        },
      },
    });

    const formattedTeachers = teachers.map(teacher => ({
      id: teacher.id,
      userId: teacher.userId,
      staffNumber: teacher.staffNumber,
      department: teacher.department,
      position: teacher.position,
      hireDate: teacher.hireDate,
      name: `${teacher.user.firstName} ${teacher.user.lastName}`,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email,
      phone: teacher.user.phone,
    }));

    res.json({ teachers: formattedTeachers });
  } catch (error: any) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTeacherById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const teacher = await prisma.staff.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!teacher) {
      res.status(404).json({ error: 'Teacher not found' });
      return;
    }

    const formattedTeacher = {
      id: teacher.id,
      userId: teacher.userId,
      staffNumber: teacher.staffNumber,
      department: teacher.department,
      position: teacher.position,
      hireDate: teacher.hireDate,
      name: `${teacher.user.firstName} ${teacher.user.lastName}`,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email,
      phone: teacher.user.phone,
    };

    res.json({ teacher: formattedTeacher });
  } catch (error: any) {
    console.error('Get teacher by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      staffNumber,
      department,
      position,
      hireDate,
    } = req.body;

    // Create user first
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: 'temp123', // Temporary password - should be changed on first login
        role: 'TEACHER',
      },
    });

    // Create staff record
    const teacher = await prisma.staff.create({
      data: {
        userId: user.id,
        staffNumber,
        department,
        position,
        hireDate: hireDate ? new Date(hireDate) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Teacher created successfully',
      teacher: {
        id: teacher.id,
        userId: teacher.userId,
        staffNumber: teacher.staffNumber,
        department: teacher.department,
        position: teacher.position,
        hireDate: teacher.hireDate,
        name: `${teacher.user.firstName} ${teacher.user.lastName}`,
        firstName: teacher.user.firstName,
        lastName: teacher.user.lastName,
        email: teacher.user.email,
        phone: teacher.user.phone,
      },
    });
  } catch (error: any) {
    console.error('Create teacher error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

