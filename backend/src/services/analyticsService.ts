import prisma from '../utils/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { CacheService } from './cacheService';

export interface FeeAnalytics {
  totalExpected: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  monthlyTrends: Array<{
    month: string;
    collected: number;
    expected: number;
  }>;
  paymentModeBreakdown: Array<{
    mode: string;
    amount: number;
    percentage: number;
  }>;
  defaulters: Array<{
    studentId: string;
    studentName: string;
    outstandingAmount: number;
    daysPastDue: number;
  }>;
}

export interface StudentPerformanceAnalytics {
  averageScore: number;
  topPerformers: Array<{
    studentId: string;
    studentName: string;
    average: number;
    grade: string;
  }>;
  subjectAnalysis: Array<{
    subject: string;
    average: number;
    passingRate: number;
  }>;
  gradeTrends: Array<{
    term: string;
    average: number;
  }>;
  failureRate: number;
}

export interface AttendanceAnalytics {
  overallRate: number;
  monthlyTrends: Array<{
    month: string;
    rate: number;
  }>;
  lowAttendanceStudents: Array<{
    studentId: string;
    studentName: string;
    attendanceRate: number;
    absences: number;
  }>;
  classComparison: Array<{
    className: string;
    attendanceRate: number;
  }>;
}

export class AnalyticsService {
  /**
   * Get comprehensive fee analytics
   */
  static async getFeeAnalytics(
    academicYear: string,
    term?: string
  ): Promise<FeeAnalytics> {
    try {
      const cacheKey = `analytics:fee:${academicYear}:${term || 'all'}`;
      const cached = await CacheService.get<FeeAnalytics>(cacheKey);
      if (cached) return cached;

      const where: any = {};
      if (term) where.term = term;

      // Get all fee structures
      const feeStructures = await prisma.feeStructure.findMany({
        where: {
          academicYear,
          ...where,
          isActive: true,
        },
        include: {
          studentFees: {
            include: {
              student: true,
            },
          },
        },
      });

      let totalExpected = 0;
      let totalCollected = 0;
      const defaulters: any[] = [];

      feeStructures.forEach((structure) => {
        structure.studentFees.forEach((fee) => {
          const expected = Number(fee.amount);
          const collected = Number(fee.paidAmount);
          totalExpected += expected;
          totalCollected += collected;

          // Check for defaulters
          if (!fee.isPaid && fee.dueDate < new Date()) {
            const daysPastDue = Math.floor(
              (Date.now() - fee.dueDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            defaulters.push({
              studentId: fee.studentId,
              studentName: `${fee.student.firstName} ${fee.student.lastName}`,
              outstandingAmount: expected - collected,
              daysPastDue,
            });
          }
        });
      });

      // Get monthly trends (last 6 months)
      const monthlyTrends = await this.getMonthlyFeeTrends(academicYear);

      // Get payment mode breakdown
      const paymentModeBreakdown = await this.getPaymentModeBreakdown(academicYear);

      const totalOutstanding = totalExpected - totalCollected;
      const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

      const result = {
        totalExpected,
        totalCollected,
        totalOutstanding,
        collectionRate: Math.round(collectionRate * 100) / 100,
        monthlyTrends,
        paymentModeBreakdown,
        defaulters: defaulters.slice(0, 20), // Top 20 defaulters
      };

      await CacheService.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;
    } catch (error) {
      console.error('Get fee analytics error:', error);
      throw error;
    }
  }

  /**
   * Get monthly fee collection trends
   */
  private static async getMonthlyFeeTrends(
    academicYear: string
  ): Promise<Array<{ month: string; collected: number; expected: number }>> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
        status: 'COMPLETED',
      },
    });

    const monthlyData: { [key: string]: { collected: number; expected: number } } = {};
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    payments.forEach((payment) => {
      const month = months[payment.createdAt.getMonth()];
      if (!monthlyData[month]) {
        monthlyData[month] = { collected: 0, expected: 0 };
      }
      monthlyData[month].collected += Number(payment.amount);
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      collected: data.collected,
      expected: data.expected || data.collected * 1.2, // Estimate expected
    }));
  }

  /**
   * Get payment mode breakdown
   */
  private static async getPaymentModeBreakdown(
    academicYear: string
  ): Promise<Array<{ mode: string; amount: number; percentage: number }>> {
    const payments = await prisma.payment.findMany({
      where: { status: 'COMPLETED' },
    });

    const breakdown: { [key: string]: number } = {};
    let total = 0;

    payments.forEach((payment) => {
      const mode = payment.paymentMode;
      const amount = Number(payment.amount);
      breakdown[mode] = (breakdown[mode] || 0) + amount;
      total += amount;
    });

    return Object.entries(breakdown).map(([mode, amount]) => ({
      mode,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100 * 100) / 100 : 0,
    }));
  }

  /**
   * Get student performance analytics
   */
  static async getStudentPerformanceAnalytics(
    academicYear: string,
    term?: string,
    classId?: string
  ): Promise<StudentPerformanceAnalytics> {
    try {
      const cacheKey = `analytics:performance:${academicYear}:${term || 'all'}:${classId || 'all'}`;
      const cached = await CacheService.get<StudentPerformanceAnalytics>(cacheKey);
      if (cached) return cached;

      const where: any = { academicYear };
      if (term) where.term = term;
      if (classId) where.classId = classId;

      const exams = await prisma.exam.findMany({
        where,
        include: {
          marks: {
            include: {
              student: true,
            },
          },
        },
      });

      let totalMarks = 0;
      let markCount = 0;
      const studentScores: { [key: string]: { total: number; count: number; name: string } } = {};
      const subjectScores: { [key: string]: { total: number; count: number; passing: number } } = {};

      exams.forEach((exam) => {
        exam.marks.forEach((mark) => {
          const score = Number(mark.marks);
          totalMarks += score;
          markCount++;

          // Student scores
          if (!studentScores[mark.studentId]) {
            studentScores[mark.studentId] = {
              total: 0,
              count: 0,
              name: `${mark.student.firstName} ${mark.student.lastName}`,
            };
          }
          studentScores[mark.studentId].total += score;
          studentScores[mark.studentId].count++;

          // Subject scores
          const subject = exam.subject || exam.name;
          if (!subjectScores[subject]) {
            subjectScores[subject] = { total: 0, count: 0, passing: 0 };
          }
          subjectScores[subject].total += score;
          subjectScores[subject].count++;
          if (score >= 50) subjectScores[subject].passing++;
        });
      });

      const averageScore = markCount > 0 ? totalMarks / markCount : 0;

      // Top performers
      const topPerformers = Object.entries(studentScores)
        .map(([studentId, data]) => ({
          studentId,
          studentName: data.name,
          average: data.count > 0 ? data.total / data.count : 0,
          grade: this.calculateGrade(data.count > 0 ? data.total / data.count : 0),
        }))
        .sort((a, b) => b.average - a.average)
        .slice(0, 10);

      // Subject analysis
      const subjectAnalysis = Object.entries(subjectScores).map(([subject, data]) => ({
        subject,
        average: data.count > 0 ? data.total / data.count : 0,
        passingRate: data.count > 0 ? (data.passing / data.count) * 100 : 0,
      }));

      const failureRate =
        markCount > 0 ? ((markCount - Object.values(subjectScores).reduce((sum, s) => sum + s.passing, 0)) / markCount) * 100 : 0;

      const result = {
        averageScore: Math.round(averageScore * 100) / 100,
        topPerformers,
        subjectAnalysis,
        gradeTrends: [], // Would need historical data
        failureRate: Math.round(failureRate * 100) / 100,
      };

      await CacheService.set(cacheKey, result, 1800);
      return result;
    } catch (error) {
      console.error('Get performance analytics error:', error);
      throw error;
    }
  }

  /**
   * Get attendance analytics
   */
  static async getAttendanceAnalytics(
    startDate?: Date,
    endDate?: Date,
    classId?: string
  ): Promise<AttendanceAnalytics> {
    try {
      const cacheKey = `analytics:attendance:${startDate?.toISOString() || 'all'}:${endDate?.toISOString() || 'all'}:${classId || 'all'}`;
      const cached = await CacheService.get<AttendanceAnalytics>(cacheKey);
      if (cached) return cached;

      const where: any = {};
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = startDate;
        if (endDate) where.date.lte = endDate;
      }
      if (classId) where.classId = classId;

      const attendance = await prisma.attendance.findMany({
        where,
        include: {
          student: true,
          class: true,
        },
      });

      const totalRecords = attendance.length;
      const presentRecords = attendance.filter((a) => a.status === 'PRESENT').length;
      const overallRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

      // Student attendance rates
      const studentAttendance: { [key: string]: { present: number; total: number; name: string } } = {};

      attendance.forEach((record) => {
        if (!studentAttendance[record.studentId]) {
          studentAttendance[record.studentId] = {
            present: 0,
            total: 0,
            name: `${record.student.firstName} ${record.student.lastName}`,
          };
        }
        studentAttendance[record.studentId].total++;
        if (record.status === 'PRESENT') {
          studentAttendance[record.studentId].present++;
        }
      });

      const lowAttendanceStudents = Object.entries(studentAttendance)
        .map(([studentId, data]) => ({
          studentId,
          studentName: data.name,
          attendanceRate: data.total > 0 ? (data.present / data.total) * 100 : 0,
          absences: data.total - data.present,
        }))
        .filter((s) => s.attendanceRate < 75)
        .sort((a, b) => a.attendanceRate - b.attendanceRate)
        .slice(0, 20);

      // Monthly trends (last 6 months)
      const monthlyTrends = await this.getMonthlyAttendanceTrends(classId);

      // Class comparison
      const classComparison = await this.getClassAttendanceComparison();

      const result = {
        overallRate: Math.round(overallRate * 100) / 100,
        monthlyTrends,
        lowAttendanceStudents,
        classComparison,
      };

      await CacheService.set(cacheKey, result, 1800);
      return result;
    } catch (error) {
      console.error('Get attendance analytics error:', error);
      throw error;
    }
  }

  /**
   * Get monthly attendance trends
   */
  private static async getMonthlyAttendanceTrends(
    classId?: string
  ): Promise<Array<{ month: string; rate: number }>> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const where: any = {
      date: { gte: sixMonthsAgo },
    };
    if (classId) where.classId = classId;

    const attendance = await prisma.attendance.findMany({ where });

    const monthlyData: { [key: string]: { present: number; total: number } } = {};
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    attendance.forEach((record) => {
      const month = months[record.date.getMonth()];
      if (!monthlyData[month]) {
        monthlyData[month] = { present: 0, total: 0 };
      }
      monthlyData[month].total++;
      if (record.status === 'PRESENT') {
        monthlyData[month].present++;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      rate: data.total > 0 ? Math.round((data.present / data.total) * 100 * 100) / 100 : 0,
    }));
  }

  /**
   * Get class attendance comparison
   */
  private static async getClassAttendanceComparison(): Promise<
    Array<{ className: string; attendanceRate: number }>
  > {
    const classes = await prisma.class.findMany({
      include: {
        attendance: true,
      },
    });

    return classes.map((cls) => {
      const total = cls.attendance.length;
      const present = cls.attendance.filter((a) => a.status === 'PRESENT').length;
      return {
        className: cls.name,
        attendanceRate: total > 0 ? Math.round((present / total) * 100 * 100) / 100 : 0,
      };
    });
  }

  /**
   * Calculate grade from score
   */
  private static calculateGrade(score: number): string {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'E';
  }

  /**
   * Revenue forecasting based on historical data
   */
  static async getRevenueForecast(months: number = 6): Promise<Array<{ month: string; forecast: number }>> {
    try {
      const cacheKey = `analytics:forecast:${months}`;
      const cached = await CacheService.get<Array<{ month: string; forecast: number }>>(cacheKey);
      if (cached) return cached;

      // Get historical payment data from last year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const payments = await prisma.payment.findMany({
        where: {
          createdAt: { gte: oneYearAgo },
          status: 'COMPLETED',
        },
      });

      const monthlyRevenue: { [key: number]: number } = {};

      payments.forEach((payment) => {
        const month = payment.createdAt.getMonth();
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
      });

      // Simple forecast: average of same months + 10% growth
      const forecast: Array<{ month: string; forecast: number }> = [];
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const currentMonth = new Date().getMonth();

      for (let i = 0; i < months; i++) {
        const futureMonth = (currentMonth + i) % 12;
        const historicalAvg = monthlyRevenue[futureMonth] || 0;
        const forecastValue = historicalAvg * 1.1; // 10% growth assumption

        forecast.push({
          month: monthNames[futureMonth],
          forecast: Math.round(forecastValue * 100) / 100,
        });
      }

      await CacheService.set(cacheKey, forecast, 3600 * 24); // Cache for 24 hours
      return forecast;
    } catch (error) {
      console.error('Get revenue forecast error:', error);
      throw error;
    }
  }
}

