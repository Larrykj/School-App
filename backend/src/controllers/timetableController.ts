import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createTimetableEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      classId,
      day,
      period,
      startTime,
      endTime,
      subject,
      teacherId,
      room,
      academicYear,
      term,
    } = req.body;

    const entry = await prisma.timetable.create({
      data: {
        classId,
        day,
        period,
        startTime,
        endTime,
        subject,
        teacherId,
        room,
        academicYear,
        term,
      },
      include: {
        class: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json({ message: 'Timetable entry created successfully', entry });
  } catch (error: any) {
    console.error('Create timetable entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTimetable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, academicYear, term } = req.query;

    const where: any = {};
    if (classId) where.classId = classId;
    if (academicYear) where.academicYear = academicYear;
    if (term) where.term = term;

    const timetable = await prisma.timetable.findMany({
      where,
      include: {
        class: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [{ day: 'asc' }, { period: 'asc' }],
    });

    // Group by day for easier display
    const grouped = timetable.reduce((acc: any, entry: any) => {
      if (!acc[entry.day]) {
        acc[entry.day] = [];
      }
      acc[entry.day].push(entry);
      return acc;
    }, {});

    res.json({ timetable: grouped });
  } catch (error: any) {
    console.error('Get timetable error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTimetableEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.timetable.delete({
      where: { id },
    });

    res.json({ message: 'Timetable entry deleted successfully' });
  } catch (error: any) {
    console.error('Delete timetable entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTimetableByClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const { academicYear, term } = req.query;

    const where: any = { classId };
    if (academicYear) where.academicYear = academicYear as string;
    if (term) where.term = term as string;

    const timetable = await prisma.timetable.findMany({
      where,
      include: {
        class: true,
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: [{ day: 'asc' }, { period: 'asc' }],
    });

    // Group by day and period for easier frontend consumption
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const grouped: any = {};
    
    days.forEach(day => {
      grouped[day] = timetable
        .filter(entry => entry.day.toUpperCase() === day)
        .sort((a, b) => a.period - b.period)
        .map(entry => ({
          id: entry.id,
          period: entry.period,
          subject: entry.subject,
          startTime: entry.startTime,
          endTime: entry.endTime,
          room: entry.room,
          teacher: entry.teacher && entry.teacher.user
            ? `${entry.teacher.user.firstName} ${entry.teacher.user.lastName}`
            : null,
          teacherId: entry.teacherId,
        }));
    });

    res.json({ timetable: grouped, classId });
  } catch (error: any) {
    console.error('Get timetable by class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTimetable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const { periods, academicYear, term } = req.body;

    // Delete existing timetable for this class, academic year, and term
    await prisma.timetable.deleteMany({
      where: {
        classId,
        academicYear,
        term,
      },
    });

    // Create new timetable entries
    const entries = [];
    for (const period of periods) {
      // Validate teacherId if provided
      let validTeacherId = null;
      if (period.teacherId) {
        // Check if teacher exists in database
        const teacherExists = await prisma.staff.findUnique({
          where: { id: period.teacherId },
        });
        
        if (teacherExists) {
          validTeacherId = period.teacherId;
        } else {
          console.warn(`Teacher ID ${period.teacherId} not found in database, skipping teacher assignment`);
        }
      }
      
      const entry = await prisma.timetable.create({
        data: {
          classId,
          day: period.day,
          period: period.periodNumber,
          startTime: period.startTime || '08:00',
          endTime: period.endTime || '09:00',
          subject: period.subject,
          teacherId: validTeacherId,
          room: period.room || null,
          academicYear,
          term,
        },
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
      entries.push(entry);
    }

    res.json({ message: 'Timetable updated successfully', entries });
  } catch (error: any) {
    console.error('Update timetable error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.meta : undefined,
    });
  }
};

