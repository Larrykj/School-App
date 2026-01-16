import Bull from 'bull';
import { SmsService } from '../services/smsService';
import { PdfService } from '../services/pdfService';
import { NotificationService } from '../services/notificationService';

// Create queues
export const smsQueue = new Bull('sms', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

export const pdfQueue = new Bull('pdf', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

export const notificationQueue = new Bull('notification', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

/**
 * SMS Queue Processor
 */
smsQueue.process(async (job) => {
  const { recipient, message } = job.data;
  
  try {
    await SmsService.sendSMS(recipient, message);
    return { status: 'sent', recipient };
  } catch (error: any) {
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
});

/**
 * Bulk SMS Queue Processor
 */
smsQueue.process('bulk', 5, async (job) => {
  const { recipients, message } = job.data;
  
  try {
    const results = await SmsService.sendBulkSMS(recipients, message);
    return results;
  } catch (error: any) {
    throw new Error(`Failed to send bulk SMS: ${error.message}`);
  }
});

/**
 * PDF Generation Queue Processor
 */
pdfQueue.process('receipt', async (job) => {
  const { paymentId } = job.data;
  
  try {
    const filePath = await PdfService.generateReceipt(paymentId);
    return { filePath };
  } catch (error: any) {
    throw new Error(`Failed to generate receipt: ${error.message}`);
  }
});

pdfQueue.process('report-card', async (job) => {
  const { reportCardId } = job.data;
  
  try {
    const filePath = await PdfService.generateReportCard(reportCardId);
    return { filePath };
  } catch (error: any) {
    throw new Error(`Failed to generate report card: ${error.message}`);
  }
});

/**
 * Notification Queue Processor
 */
notificationQueue.process('fee-reminder', async (job) => {
  try {
    await NotificationService.triggerFeeReminders();
    return { status: 'completed' };
  } catch (error: any) {
    throw new Error(`Failed to send fee reminders: ${error.message}`);
  }
});

notificationQueue.process('attendance-alert', async (job) => {
  try {
    await NotificationService.triggerAttendanceAlerts();
    return { status: 'completed' };
  } catch (error: any) {
    throw new Error(`Failed to send attendance alerts: ${error.message}`);
  }
});

/**
 * Queue event handlers
 */
smsQueue.on('completed', (job, result) => {
  console.log(`SMS job ${job.id} completed:`, result);
});

smsQueue.on('failed', (job, err) => {
  console.error(`SMS job ${job?.id} failed:`, err.message);
});

pdfQueue.on('completed', (job, result) => {
  console.log(`PDF job ${job.id} completed:`, result);
});

pdfQueue.on('failed', (job, err) => {
  console.error(`PDF job ${job?.id} failed:`, err.message);
});

notificationQueue.on('completed', (job, result) => {
  console.log(`Notification job ${job.id} completed:`, result);
});

notificationQueue.on('failed', (job, err) => {
  console.error(`Notification job ${job?.id} failed:`, err.message);
});

/**
 * Helper functions to add jobs to queues
 */
export const queueSMS = async (recipient: string, message: string) => {
  await smsQueue.add({ recipient, message }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
};

export const queueBulkSMS = async (recipients: string[], message: string) => {
  await smsQueue.add('bulk', { recipients, message }, {
    attempts: 2,
    timeout: 300000, // 5 minutes
  });
};

export const queuePDFReceipt = async (paymentId: string) => {
  await pdfQueue.add('receipt', { paymentId }, {
    attempts: 2,
  });
};

export const queuePDFReportCard = async (reportCardId: string) => {
  await pdfQueue.add('report-card', { reportCardId }, {
    attempts: 2,
  });
};

export const scheduleFeeReminders = () => {
  // Schedule daily at 9 AM
  notificationQueue.add('fee-reminder', {}, {
    repeat: { cron: '0 9 * * *' },
  });
};

export const scheduleAttendanceAlerts = () => {
  // Schedule weekly on Monday at 10 AM
  notificationQueue.add('attendance-alert', {}, {
    repeat: { cron: '0 10 * * 1' },
  });
};

