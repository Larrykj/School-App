import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { FeeService } from '../services/feeService';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalStudents,
      activeStudents,
      totalStaff,
      totalClasses,
      totalParents,
      recentPayments,
      outstandingBalance,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { isActive: true } }),
      prisma.staff.count(),
      prisma.class.count(),
      prisma.parent.count(),
      prisma.payment.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
          status: 'COMPLETED',
        },
      }),
      prisma.studentFee.aggregate({
        _sum: {
          balance: true,
        },
        where: {
          balance: {
            gt: 0,
          },
        },
      }),
    ]);

    // Get top defaulters
    const studentsWithFees = await prisma.student.findMany({
      where: { isActive: true },
      include: {
        fees: true,
      },
    });

    const defaulters = studentsWithFees
      .map((student) => {
        const totalDue = student.fees.reduce((sum, fee) => sum + Number(fee.amount), 0);
        const totalPaid = student.fees.reduce((sum, fee) => sum + Number(fee.paidAmount), 0);
        const balance = totalDue - totalPaid;

        return {
          studentId: student.id,
          admissionNumber: student.admissionNumber,
          name: `${student.firstName} ${student.lastName}`,
          balance,
        };
      })
      .filter((s) => s.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);

    // Get recent payments
    const recentPaymentList = await prisma.payment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: {
            admissionNumber: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get upcoming exams
    const upcomingExams = await prisma.exam.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      take: 5,
      orderBy: { date: 'asc' },
      include: {
        class: true,
      },
    });

    res.json({
      stats: {
        totalStudents,
        activeStudents,
        totalStaff,
        totalClasses,
        totalParents,
        recentPayments,
        outstandingBalance: Number(outstandingBalance._sum.balance || 0),
      },
      topDefaulters: defaulters,
      recentPayments: recentPaymentList,
      upcomingExams,
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFeeCollectionSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {
      status: 'COMPLETED',
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        student: {
          select: {
            class: true,
          },
        },
      },
    });

    const summary = {
      totalAmount: payments.reduce((sum, p) => sum + Number(p.amount), 0),
      totalCount: payments.length,
      byPaymentMode: {
        CASH: 0,
        MPESA: 0,
        BANK: 0,
      },
      byClass: {} as Record<string, number>,
    };

    payments.forEach((payment) => {
      summary.byPaymentMode[payment.paymentMode] += Number(payment.amount);
      const className = payment.student.class?.name || 'Unknown';
      summary.byClass[className] = (summary.byClass[className] || 0) + Number(payment.amount);
    });

    res.json({ summary });
  } catch (error: any) {
    console.error('Get fee collection summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

