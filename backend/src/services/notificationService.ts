import prisma from '../utils/prisma';
import { SmsService } from './smsService';

export interface Notification {
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  recipientId?: string;
  recipientRole?: 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';
  sendSMS?: boolean;
}

export class NotificationService {
  /**
   * Create an in-app notification
   */
  static async createNotification(notification: Notification): Promise<void> {
    try {
      // Create notification in database (you'd need to add a Notification model to schema)
      console.log('Creating notification:', notification);

      // If sendSMS is true and we have a recipient, send SMS
      if (notification.sendSMS && notification.recipientId) {
        await this.sendNotificationSMS(notification);
      }
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }

  /**
   * Send notification via SMS
   */
  private static async sendNotificationSMS(notification: Notification): Promise<void> {
    try {
      if (!notification.recipientId) return;

      // Get recipient's phone number
      const user = await prisma.user.findUnique({
        where: { id: notification.recipientId },
      });

      if (!user || !user.phone) {
        console.log('No phone number found for recipient');
        return;
      }

      await SmsService.sendSMS(user.phone, notification.message);
    } catch (error) {
      console.error('Failed to send notification SMS:', error);
    }
  }

  /**
   * Trigger fee reminder notifications
   */
  static async triggerFeeReminders(): Promise<void> {
    try {
      // Get all students with outstanding fees
      const studentFees = await prisma.studentFee.findMany({
        where: {
          isPaid: false,
          dueDate: {
            lte: new Date(), // Past due date
          },
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
          feeStructure: true,
        },
      });

      for (const fee of studentFees) {
        if (fee.student.parent?.user) {
          const balance = Number(fee.amount) - Number(fee.paidAmount) - Number(fee.carryover);
          
          if (balance > 0) {
            await this.createNotification({
              title: 'Fee Reminder',
              message: `Dear ${fee.student.parent.user.firstName}, ${fee.student.firstName} ${fee.student.lastName} has an outstanding balance of KES ${balance.toFixed(2)} for ${fee.feeStructure.name}. Please make payment to avoid inconveniences.`,
              type: 'WARNING',
              recipientId: fee.student.parent.user.id,
              sendSMS: true,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to trigger fee reminders:', error);
    }
  }

  /**
   * Trigger low attendance alerts
   */
  static async triggerAttendanceAlerts(): Promise<void> {
    try {
      // Get attendance stats for all students in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const students = await prisma.student.findMany({
        where: { isActive: true },
        include: {
          attendance: {
            where: {
              date: {
                gte: thirtyDaysAgo,
              },
            },
          },
          parent: {
            include: {
              user: true,
            },
          },
        },
      });

      for (const student of students) {
        const total = student.attendance.length;
        const present = student.attendance.filter((a) => a.status === 'PRESENT').length;
        const attendanceRate = total > 0 ? (present / total) * 100 : 100;

        // Alert if attendance is below 75%
        if (attendanceRate < 75 && student.parent?.user) {
          await this.createNotification({
            title: 'Low Attendance Alert',
            message: `Dear ${student.parent.user.firstName}, ${student.firstName} ${student.lastName}'s attendance rate is ${attendanceRate.toFixed(1)}% over the last 30 days. Please ensure regular attendance.`,
            type: 'WARNING',
            recipientId: student.parent.user.id,
            sendSMS: true,
          });
        }
      }
    } catch (error) {
      console.error('Failed to trigger attendance alerts:', error);
    }
  }

  /**
   * Send exam result notification
   */
  static async sendExamResultNotification(
    studentId: string,
    examName: string,
    marks: number,
    grade?: string
  ): Promise<void> {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          parent: {
            include: {
              user: true,
            },
          },
        },
      });

      if (student?.parent?.user) {
        await this.createNotification({
          title: 'Exam Results',
          message: `${student.firstName} ${student.lastName} scored ${marks} ${grade ? `(${grade})` : ''} in ${examName}.`,
          type: 'INFO',
          recipientId: student.parent.user.id,
          sendSMS: true,
        });
      }
    } catch (error) {
      console.error('Failed to send exam result notification:', error);
    }
  }

  /**
   * Schedule periodic notifications
   */
  static setupScheduledNotifications(): void {
    // Run fee reminders daily at 9 AM
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 9 && now.getMinutes() === 0) {
        this.triggerFeeReminders();
      }
    }, 60000); // Check every minute

    // Run attendance alerts weekly on Monday at 10 AM
    setInterval(() => {
      const now = new Date();
      if (now.getDay() === 1 && now.getHours() === 10 && now.getMinutes() === 0) {
        this.triggerAttendanceAlerts();
      }
    }, 60000);
  }
}

