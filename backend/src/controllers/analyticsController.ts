import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';

export const getFeeAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { academicYear, term } = req.query;

    if (!academicYear) {
      res.status(400).json({ error: 'Academic year is required' });
      return;
    }

    const analytics = await AnalyticsService.getFeeAnalytics(
      academicYear as string,
      term as string | undefined
    );

    res.json({ analytics });
  } catch (error: any) {
    console.error('Get fee analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPerformanceAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { academicYear, term, classId } = req.query;

    if (!academicYear) {
      res.status(400).json({ error: 'Academic year is required' });
      return;
    }

    const analytics = await AnalyticsService.getStudentPerformanceAnalytics(
      academicYear as string,
      term as string | undefined,
      classId as string | undefined
    );

    res.json({ analytics });
  } catch (error: any) {
    console.error('Get performance analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAttendanceAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, classId } = req.query;

    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;

    const analytics = await AnalyticsService.getAttendanceAnalytics(
      start,
      end,
      classId as string | undefined
    );

    res.json({ analytics });
  } catch (error: any) {
    console.error('Get attendance analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRevenueForecast = async (req: Request, res: Response): Promise<void> => {
  try {
    const { months = 6 } = req.query;

    const forecast = await AnalyticsService.getRevenueForecast(Number(months));

    res.json({ forecast });
  } catch (error: any) {
    console.error('Get revenue forecast error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { academicYear, term } = req.query;

    if (!academicYear) {
      res.status(400).json({ error: 'Academic year is required' });
      return;
    }

    // Fetch all analytics in parallel
    const [feeAnalytics, performanceAnalytics, attendanceAnalytics, forecast] = await Promise.all([
      AnalyticsService.getFeeAnalytics(academicYear as string, term as string | undefined),
      AnalyticsService.getStudentPerformanceAnalytics(academicYear as string, term as string | undefined),
      AnalyticsService.getAttendanceAnalytics(),
      AnalyticsService.getRevenueForecast(3),
    ]);

    res.json({
      stats: {
        fees: {
          collectionRate: feeAnalytics.collectionRate,
          outstanding: feeAnalytics.totalOutstanding,
          collected: feeAnalytics.totalCollected,
        },
        performance: {
          averageScore: performanceAnalytics.averageScore,
          failureRate: performanceAnalytics.failureRate,
        },
        attendance: {
          overallRate: attendanceAnalytics.overallRate,
        },
        forecast: forecast.slice(0, 1)[0]?.forecast || 0,
      },
      detailedAnalytics: {
        feeAnalytics,
        performanceAnalytics,
        attendanceAnalytics,
        forecast,
      },
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

