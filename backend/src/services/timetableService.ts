import prisma from '../utils/prisma';

interface Subject {
  name: string;
  periodsPerWeek: number;
  teacherId?: string;
}

interface Period {
  day: string;
  periodNumber: number;
  subject: string;
  teacherId?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS_PER_DAY = 8; // Customizable

export class TimetableService {
  /**
   * Generate a timetable for a class
   * Simple algorithm that tries to distribute subjects evenly across the week
   */
  static async generateTimetable(
    classId: string,
    academicYear: string,
    term: string,
    subjects: Subject[]
  ): Promise<Period[]> {
    const timetable: Period[] = [];
    const subjectPool: string[] = [];

    // Build a pool of subjects based on periods per week
    subjects.forEach((subject) => {
      for (let i = 0; i < subject.periodsPerWeek; i++) {
        subjectPool.push(subject.name);
      }
    });

    // Shuffle the pool for better distribution
    this.shuffleArray(subjectPool);

    let poolIndex = 0;

    // Allocate subjects to periods
    for (const day of DAYS) {
      for (let period = 1; period <= PERIODS_PER_DAY; period++) {
        if (poolIndex < subjectPool.length) {
          const subjectName = subjectPool[poolIndex];
          const subject = subjects.find((s) => s.name === subjectName);

          timetable.push({
            day,
            periodNumber: period,
            subject: subjectName,
            teacherId: subject?.teacherId,
          });

          poolIndex++;
        } else {
          // Fill remaining periods with breaks or free periods
          timetable.push({
            day,
            periodNumber: period,
            subject: period === 4 ? 'Lunch Break' : 'Free Period',
          });
        }
      }
    }

    // Save to database
    await this.saveTimetable(classId, academicYear, term, timetable);

    return timetable;
  }

  /**
   * Save timetable to database
   */
  private static async saveTimetable(
    classId: string,
    academicYear: string,
    term: string,
    periods: Period[]
  ): Promise<void> {
    // Delete existing timetable for this class/term
    await prisma.timetable.deleteMany({
      where: {
        classId,
        academicYear,
        term,
      },
    });

    // Create new timetable entries
    for (const period of periods) {
      await prisma.timetable.create({
        data: {
          classId,
          day: period.day,
          period: period.periodNumber,
          startTime: period.startTime || '08:00',
          endTime: period.endTime || '09:00',
          subject: period.subject,
          teacherId: period.teacherId,
          academicYear,
          term,
          room: period.room,
        },
      });
    }
  }

  /**
   * Get timetable for a class
   */
  static async getTimetable(
    classId: string,
    academicYear?: string,
    term?: string
  ): Promise<any> {
    const where: any = { classId };
    if (academicYear) where.academicYear = academicYear;
    if (term) where.term = term;

    const timetable = await prisma.timetable.findMany({
      where,
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
      orderBy: [
        { day: 'asc' },
        { period: 'asc' },
      ],
    });

    // Group by day
    const grouped: { [day: string]: any[] } = {};
    DAYS.forEach((day) => {
      grouped[day] = timetable
        .filter((t) => t.day === day)
        .map((t) => ({
          period: t.period,
          periodNumber: t.period, // Alias for compatibility
          subject: t.subject,
          startTime: t.startTime,
          endTime: t.endTime,
          room: t.room,
          teacher: t.teacher && 'user' in t.teacher && t.teacher.user
            ? `${t.teacher.user.firstName} ${t.teacher.user.lastName}`
            : null,
        }));
    });

    return grouped;
  }

  /**
   * Helper function to shuffle an array
   */
  private static shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Validate timetable (check for conflicts)
   */
  static async validateTimetable(
    classId: string,
    academicYear: string,
    term: string
  ): Promise<{ isValid: boolean; conflicts: string[] }> {
    const timetable = await prisma.timetable.findMany({
      where: { classId, academicYear, term },
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

    const conflicts: string[] = [];
    const teacherSchedule: { [key: string]: Set<string> } = {};

    timetable.forEach((entry) => {
      if (entry.teacherId) {
        const key = `${entry.day}-${entry.period}`;
        
        if (!teacherSchedule[entry.teacherId]) {
          teacherSchedule[entry.teacherId] = new Set();
        }

        if (teacherSchedule[entry.teacherId].has(key)) {
          const teacherName = entry.teacher && 'user' in entry.teacher && entry.teacher.user
            ? `${entry.teacher.user.firstName} ${entry.teacher.user.lastName}`
            : 'Unknown Teacher';
          conflicts.push(
            `Teacher conflict: ${teacherName} has multiple classes on ${entry.day}, Period ${entry.period}`
          );
        } else {
          teacherSchedule[entry.teacherId].add(key);
        }
      }
    });

    return {
      isValid: conflicts.length === 0,
      conflicts,
    };
  }
}

