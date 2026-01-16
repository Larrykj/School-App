import Queue from 'bull';
import { PdfService } from './pdfService';
import { SmsService } from './smsService';
import prisma from '../utils/prisma';
import { SocketService } from './socketService';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Create queues
export const smsQueue = new Queue('sms-queue', REDIS_URL);
export const pdfQueue = new Queue('pdf-queue', REDIS_URL);

// SMS Processor
smsQueue.process(async (job) => {
  const { recipient, message } = job.data;
  console.log(`Processing SMS job for ${recipient}`);
  
  try {
    await SmsService.sendSMS(recipient, message);
    return { success: true, recipient };
  } catch (error) {
    console.error(`Failed to send SMS to ${recipient}:`, error);
    throw error;
  }
});

// PDF Processor (Report Cards)
pdfQueue.process('generate-report-card', async (job) => {
  const { reportCardId, userId } = job.data;
  console.log(`Processing PDF generation for Report Card ${reportCardId}`);

  try {
    const pdfPath = await PdfService.generateReportCard(reportCardId);
    
    // Update report card with PDF path
    await prisma.reportCard.update({
      where: { id: reportCardId },
      data: { pdfPath },
    });

    // Notify user
    if (userId) {
      SocketService.sendToUser(userId, 'report-card-ready', { 
        reportCardId, 
        pdfPath,
        message: 'Report card generated successfully' 
      });
    }

    return { success: true, reportCardId, pdfPath };
  } catch (error) {
    console.error(`Failed to generate PDF for Report Card ${reportCardId}:`, error);
    
    if (userId) {
      SocketService.sendToUser(userId, 'report-card-failed', { 
        reportCardId, 
        error: 'Failed to generate report card' 
      });
    }
    
    throw error;
  }
});

// Error handling
smsQueue.on('failed', (job, err) => {
  console.error(`SMS job ${job.id} failed:`, err);
});

pdfQueue.on('failed', (job, err) => {
  console.error(`PDF job ${job.id} failed:`, err);
});

export const addSmsJob = (recipient: string, message: string) => {
  return smsQueue.add({ recipient, message }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });
};

export const addReportCardJob = (reportCardId: string, userId?: string) => {
  return pdfQueue.add('generate-report-card', { reportCardId, userId }, {
    attempts: 3,
  });
};

