import axios from 'axios';
import * as qs from 'querystring';
import prisma from '../utils/prisma';
import { Decimal } from '@prisma/client/runtime/library';

const SMS_API_KEY = process.env.SMS_API_KEY || '';
const SMS_USERNAME = process.env.SMS_USERNAME || '';
const SMS_SENDER_ID = process.env.SMS_SENDER_ID || '';

// Using Africa's Talking API
const SMS_BASE_URL = 'https://api.africastalking.com/version1/messaging';

export class SmsService {
  /**
   * Send SMS
   */
  static async sendSMS(
    recipient: string,
    message: string
  ): Promise<{ status: string; messageId?: string; cost?: number }> {
    // Format phone number (254XXXXXXXXX)
    const formattedPhone = recipient.startsWith('0')
      ? `254${recipient.substring(1)}`
      : recipient.startsWith('254')
      ? recipient
      : `254${recipient}`;

    try {
      const response = await axios.post(
        SMS_BASE_URL,
        qs.stringify({
          username: SMS_USERNAME,
          to: formattedPhone,
          message,
          from: SMS_SENDER_ID,
        }),
        {
          headers: {
            apiKey: SMS_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const status = response.data.SMSMessageData?.Recipients?.[0]?.status || 'UNKNOWN';
      const messageId = response.data.SMSMessageData?.Recipients?.[0]?.messageId;
      const cost = response.data.SMSMessageData?.Recipients?.[0]?.cost
        ? parseFloat(response.data.SMSMessageData.Recipients[0].cost.replace('KES ', ''))
        : undefined;

      // Log SMS
      await prisma.smsLog.create({
        data: {
          recipient: formattedPhone,
          message,
          status: status === 'Success' ? 'SENT' : 'FAILED',
          messageId,
          cost: cost ? new Decimal(cost) : null,
        },
      });

      return {
        status: status === 'Success' ? 'SENT' : 'FAILED',
        messageId,
        cost,
      };
    } catch (error: any) {
      console.error('SMS sending error:', error.response?.data || error.message);

      // Log failed SMS
      await prisma.smsLog.create({
        data: {
          recipient: formattedPhone,
          message,
          status: 'FAILED',
        },
      });

      throw new Error('Failed to send SMS');
    }
  }

  /**
   * Send fee reminder SMS
   */
  static async sendFeeReminder(
    studentId: string,
    balance: number
  ): Promise<void> {
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

    if (!student?.parent?.user?.phone) {
      console.error('No phone number found for student parent');
      return;
    }

    const message = `Dear ${student.parent.user.firstName}, ${student.firstName} ${student.lastName} has an outstanding fee balance of KES ${balance.toFixed(2)}. Please make payment to avoid inconveniences.`;

    await this.sendSMS(student.parent.user.phone, message);
  }

  /**
   * Send payment confirmation SMS
   */
  static async sendPaymentConfirmation(
    studentId: string,
    amount: number,
    receiptNumber: string
  ): Promise<void> {
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

    if (!student?.parent?.user?.phone) {
      return;
    }

    const message = `Payment confirmed! Receipt No: ${receiptNumber}, Amount: KES ${amount.toFixed(2)} for ${student.firstName} ${student.lastName}. Thank you!`;

    await this.sendSMS(student.parent.user.phone, message);
  }

  /**
   * Send bulk SMS
   */
  static async sendBulkSMS(
    recipients: string[],
    message: string
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        await this.sendSMS(recipient, message);
        success++;
      } catch (error) {
        failed++;
      }
    }

    return { success, failed };
  }
}

export const sendSMS = SmsService.sendSMS.bind(SmsService);
export const sendFeeReminder = SmsService.sendFeeReminder.bind(SmsService);
export const sendPaymentConfirmation = SmsService.sendPaymentConfirmation.bind(SmsService);

