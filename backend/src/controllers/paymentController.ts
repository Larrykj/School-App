import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { FeeService } from '../services/feeService';
import { MpesaService } from '../services/mpesaService';
import { SmsService } from '../services/smsService';
import { PdfService } from '../services/pdfService';
import { Decimal } from '@prisma/client/runtime/library';

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, amount, paymentMode, paidBy, notes, phoneNumber } = req.body;

    // Generate receipt number
    const year = new Date().getFullYear();
    const count = await prisma.payment.count({
      where: {
        receiptNumber: {
          startsWith: `RCP${year}`,
        },
      },
    });
    const receiptNumber = `RCP${year}${String(count + 1).padStart(6, '0')}`;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        studentId,
        amount: new Decimal(amount),
        paymentMode,
        receiptNumber,
        paidBy,
        notes,
        status: paymentMode === 'CASH' ? 'COMPLETED' : 'PENDING',
      },
      include: {
        student: {
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

    // If cash payment, apply immediately
    if (paymentMode === 'CASH') {
      await FeeService.applyPayment(studentId, amount, payment.id);
      
      // Send SMS confirmation
      try {
        await SmsService.sendPaymentConfirmation(
          studentId,
          amount,
          receiptNumber
        );
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
      }
    } else if (paymentMode === 'MPESA' && phoneNumber) {
      // Initiate MPesa STK Push
      try {
        const { checkoutRequestId, merchantRequestId } = await MpesaService.initiateSTKPush(
          phoneNumber,
          amount,
          receiptNumber,
          `Fee payment for ${payment.student.firstName} ${payment.student.lastName}`
        );

        // Create MPesa transaction record
        await prisma.mpesaTransaction.create({
          data: {
            paymentId: payment.id,
            merchantRequestId,
            checkoutRequestId,
            phoneNumber,
            amount: new Decimal(amount),
          },
        });

        res.json({
          message: 'MPesa payment initiated',
          payment,
          checkoutRequestId,
        });
        return;
      } catch (mpesaError: any) {
        console.error('MPesa error:', mpesaError);
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        });
        res.status(400).json({ error: 'Failed to initiate MPesa payment', details: mpesaError.message });
        return;
      }
    }

    res.status(201).json({ message: 'Payment created successfully', payment });
  } catch (error: any) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, paymentMode, status, page = '1', limit = '50' } = req.query;

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (paymentMode) where.paymentMode = paymentMode;
    if (status) where.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          student: {
            select: {
              id: true,
              admissionNumber: true,
              firstName: true,
              lastName: true,
            },
          },
          mpesaTransaction: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            class: true,
            parent: {
              include: {
                user: true,
              },
            },
          },
        },
        mpesaTransaction: true,
        feeItems: {
          include: {
            studentFee: {
              include: {
                feeStructure: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json({ payment });
  } catch (error: any) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const downloadReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const filePath = await PdfService.generateReceipt(id);

    res.download(filePath, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download receipt' });
      }
    });
  } catch (error: any) {
    console.error('Download receipt error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const sendFeeReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.body;

    const balance = await FeeService.calculateBalance(studentId);

    if (balance.balance > 0) {
      await SmsService.sendFeeReminder(studentId, balance.balance);
      res.json({ message: 'Fee reminder sent successfully' });
    } else {
      res.json({ message: 'Student has no outstanding balance' });
    }
  } catch (error: any) {
    console.error('Send fee reminder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

