import express from 'express';
import { authenticate } from '../middleware/auth';
import { sendSMS } from '../services/smsService';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get SMS logs
router.get('/logs', authenticate, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const logs = await prisma.smsLog.findMany({
      take: parseInt(limit as string),
      orderBy: { sentAt: 'desc' }
    });

    res.json({ logs });
  } catch (error) {
    console.error('Failed to fetch SMS logs:', error);
    res.status(500).json({ error: 'Failed to fetch SMS logs' });
  }
});

// Send SMS
router.post('/send', authenticate, async (req, res) => {
  try {
    const { message, phoneNumbers, classId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let recipients: string[] = [];

    if (phoneNumbers && Array.isArray(phoneNumbers)) {
      // Send to specific phone numbers
      recipients = phoneNumbers;
    } else if (classId) {
      // Send to all parents in a class
      const students = await prisma.student.findMany({
        where: { classId },
        include: {
          parent: {
            include: {
              user: true
            }
          }
        }
      });

      recipients = students
        .filter(s => s.parent?.user?.phone)
        .map(s => s.parent!.user!.phone!);
    } else {
      // Send to all parents
      const parents = await prisma.parent.findMany({
        include: {
          user: true
        }
      });

      recipients = parents
        .filter(p => p.user?.phone)
        .map(p => p.user!.phone!);
    }

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No recipients found' });
    }

    // Send SMS to all recipients
    const results = await Promise.allSettled(
      recipients.map(async (phoneNumber) => {
        try {
          await sendSMS(phoneNumber, message);
          
          // Log the SMS
          await prisma.smsLog.create({
            data: {
              recipient: phoneNumber,
              message,
              status: 'DELIVERED',
              sentAt: new Date()
            }
          });
          
          return { phoneNumber, status: 'success' };
        } catch (error) {
          // Log failed SMS
          await prisma.smsLog.create({
            data: {
              recipient: phoneNumber,
              message,
              status: 'FAILED',
              sentAt: new Date()
            }
          });
          
          return { phoneNumber, status: 'failed' };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.json({
      message: 'SMS sent',
      sent: recipients.length,
      successful,
      failed
    });
  } catch (error) {
    console.error('Failed to send SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Get SMS statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const totalSent = await prisma.smsLog.count();
    const delivered = await prisma.smsLog.count({ where: { status: 'DELIVERED' } });
    const failed = await prisma.smsLog.count({ where: { status: 'FAILED' } });
    const pending = await prisma.smsLog.count({ where: { status: 'PENDING' } });

    res.json({
      totalSent,
      delivered,
      failed,
      pending,
      successRate: totalSent > 0 ? Math.round((delivered / totalSent) * 100) : 0
    });
  } catch (error) {
    console.error('Failed to fetch SMS stats:', error);
    res.status(500).json({ error: 'Failed to fetch SMS stats' });
  }
});

export default router;

