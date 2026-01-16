import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, level, stream, capacity, classTeacherId } = req.body;

    const classData = await prisma.class.create({
      data: {
        name,
        level,
        stream,
        capacity,
        classTeacherId,
      },
      include: {
        classTeacher: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json({ message: 'Class created successfully', class: classData });
  } catch (error: any) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        classTeacher: {
          include: {
            user: true,
          },
        },
        _count: {
          select: { students: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ classes });
  } catch (error: any) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        classTeacher: {
          include: {
            user: true,
          },
        },
        students: {
          include: {
            parent: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!classData) {
      res.status(404).json({ error: 'Class not found' });
      return;
    }

    res.json({ class: classData });
  } catch (error: any) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

