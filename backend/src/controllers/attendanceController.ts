import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AttendanceStatus } from '@prisma/client';

export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, date, attendanceRecords } = req.body;
    const markedById = (req as any).user?.userId;

    if (!markedById) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const created = [];

    for (const record of attendanceRecords) {
      const { studentId, status, remarks } = record;

      // Check if attendance already exists
      const existing = await prisma.attendance.findUnique({
        where: {
          studentId_date: {
            studentId,
            date: attendanceDate,
          },
        },
      });

      if (existing) {
        // Update existing
        const updated = await prisma.attendance.update({
          where: { id: existing.id },
          data: {
            status: status as AttendanceStatus,
            remarks,
          },
        });
        created.push(updated);
      } else {
        // Create new
        const newAttendance = await prisma.attendance.create({
          data: {
            studentId,
            classId,
            date: attendanceDate,
            status: status as AttendanceStatus,
            remarks,
            markedById,
          },
        });
        created.push(newAttendance);
      }
    }

    res.status(201).json({ message: 'Attendance marked successfully', attendance: created });
  } catch (error: any) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, date, studentId } = req.query;

    const where: any = {};
    if (classId) where.classId = classId;
    if (studentId) where.studentId = studentId;
    if (date) {
      const attendanceDate = new Date(date as string);
      attendanceDate.setHours(0, 0, 0, 0);
      where.date = attendanceDate;
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            lastName: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        markedBy: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json({ attendance });
  } catch (error: any) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAttendanceStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, startDate, endDate } = req.query;

    if (!studentId) {
      res.status(400).json({ error: 'Student ID is required' });
      return;
    }

    const where: any = { studentId };
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const attendance = await prisma.attendance.findMany({
      where,
    });

    const stats = {
      total: attendance.length,
      present: attendance.filter((a) => a.status === 'PRESENT').length,
      absent: attendance.filter((a) => a.status === 'ABSENT').length,
      late: attendance.filter((a) => a.status === 'LATE').length,
      excused: attendance.filter((a) => a.status === 'EXCUSED').length,
      attendanceRate:
        attendance.length > 0
          ? (attendance.filter((a) => a.status === 'PRESENT').length / attendance.length) * 100
          : 0,
    };

    res.json({ stats });
  } catch (error: any) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Batch sync offline attendance records
 * This endpoint accepts multiple attendance records and syncs them in batch
 */
export const syncOfflineAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { records } = req.body; // Array of attendance records from IndexedDB
    const markedById = (req as any).user?.userId;

    if (!markedById) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
      res.status(400).json({ error: 'No records to sync' });
      return;
    }

    const results = {
      synced: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (const record of records) {
      try {
        const { studentId, classId, date, status, remarks } = record;
        
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        // Check if attendance already exists
        const existing = await prisma.attendance.findUnique({
          where: {
            studentId_date: {
              studentId,
              date: attendanceDate,
            },
          },
        });

        if (existing) {
          // Update existing
          await prisma.attendance.update({
            where: { id: existing.id },
            data: {
              status: status as AttendanceStatus,
              remarks,
            },
          });
        } else {
          // Create new
          await prisma.attendance.create({
            data: {
              studentId,
              classId,
              date: attendanceDate,
              status: status as AttendanceStatus,
              remarks,
              markedById,
            },
          });
        }

        results.synced++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          record,
          error: error.message,
        });
      }
    }

    res.json({
      message: `Synced ${results.synced} of ${records.length} records`,
      results,
    });
  } catch (error: any) {
    console.error('Sync offline attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

