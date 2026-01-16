import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import prisma from '../utils/prisma';

const PDF_DIR = process.env.PDF_DIR || './pdfs';

// Ensure PDF directory exists
if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR, { recursive: true });
}

export class PdfService {
  /**
   * Generate fee receipt PDF
   */
  static async generateReceipt(
    paymentId: string
  ): Promise<string> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
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
      throw new Error('Payment not found');
    }

    const fileName = `receipt_${payment.receiptNumber || payment.id}.pdf`;
    const filePath = path.join(PDF_DIR, fileName);

    const doc = new PDFDocument({ margin: 50 });

    // Pipe to file
    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc.fontSize(20).text('SCHOOL FEE RECEIPT', { align: 'center' });
    doc.moveDown();

    // School details (customize as needed)
    doc.fontSize(12);
    doc.text('School Name: [Your School Name]', { align: 'center' });
    doc.text('Address: [School Address]', { align: 'center' });
    doc.text('Phone: [School Phone]', { align: 'center' });
    doc.moveDown();

    // Receipt details
    doc.fontSize(14).text('RECEIPT DETAILS', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Receipt Number: ${payment.receiptNumber || 'N/A'}`);
    doc.text(`Date: ${payment.createdAt.toLocaleDateString()}`);
    doc.text(`Payment Mode: ${payment.paymentMode}`);
    if (payment.reference) {
      doc.text(`Reference: ${payment.reference}`);
    }
    doc.moveDown();

    // Student details
    doc.fontSize(14).text('STUDENT DETAILS', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Name: ${payment.student.firstName} ${payment.student.lastName}`);
    doc.text(`Admission Number: ${payment.student.admissionNumber}`);
    if (payment.student.class) {
      doc.text(`Class: ${payment.student.class.name}`);
    }
    doc.moveDown();

    // Parent details
    if (payment.student.parent) {
      doc.fontSize(14).text('PARENT/GUARDIAN DETAILS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11);
      doc.text(
        `Name: ${payment.student.parent.user.firstName} ${payment.student.parent.user.lastName}`
      );
      if (payment.student.parent.user.phone) {
        doc.text(`Phone: ${payment.student.parent.user.phone}`);
      }
      doc.moveDown();
    }

    // Fee items
    doc.fontSize(14).text('PAYMENT BREAKDOWN', { underline: true });
    doc.moveDown(0.5);

    let y = doc.y;
    doc.fontSize(10);
    doc.text('Description', 50, y);
    doc.text('Amount', 400, y);
    doc.moveDown(0.3);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.3);

    payment.feeItems.forEach((item) => {
      doc.text(item.studentFee.feeStructure.name, 50);
      doc.text(`KES ${Number(item.amount).toFixed(2)}`, 400);
      doc.moveDown(0.3);
    });

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.3);

    // Total
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('TOTAL AMOUNT', 50);
    doc.text(`KES ${Number(payment.amount).toFixed(2)}`, 400);
    doc.moveDown();

    // Footer
    doc.fontSize(10).font('Helvetica');
    doc.text('Thank you for your payment!', { align: 'center' });
    doc.text('This is a computer-generated receipt.', { align: 'center' });

    doc.end();

    // Wait for PDF to be written
    await new Promise((resolve) => {
      doc.on('end', resolve);
    });

    return filePath;
  }

  /**
   * Generate report card PDF
   */
  static async generateReportCard(reportCardId: string): Promise<string> {
    const reportCard = await prisma.reportCard.findUnique({
      where: { id: reportCardId },
      include: {
        student: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!reportCard) {
      throw new Error('Report card not found');
    }

    // Get all marks for this term
    const exams = await prisma.exam.findMany({
      where: {
        academicYear: reportCard.academicYear,
        term: reportCard.term,
        class: {
          students: {
            some: {
              id: reportCard.studentId,
            },
          },
        },
      },
      include: {
        marks: {
          where: {
            studentId: reportCard.studentId,
          },
        },
      },
    });

    const fileName = `report_${reportCard.student.admissionNumber}_${reportCard.academicYear}_${reportCard.term}.pdf`;
    const filePath = path.join(PDF_DIR, fileName);

    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc.fontSize(20).text('REPORT CARD', { align: 'center' });
    doc.moveDown();

    // School details
    doc.fontSize(12);
    doc.text('[School Name]', { align: 'center' });
    doc.text(`Academic Year: ${reportCard.academicYear} | Term: ${reportCard.term}`, {
      align: 'center',
    });
    doc.moveDown();

    // Student details
    doc.fontSize(14).text('STUDENT INFORMATION', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Name: ${reportCard.student.firstName} ${reportCard.student.lastName}`);
    doc.text(`Admission Number: ${reportCard.student.admissionNumber}`);
    if (reportCard.student.class) {
      doc.text(`Class: ${reportCard.student.class.name}`);
    }
    doc.moveDown();

    // Results table
    doc.fontSize(14).text('EXAMINATION RESULTS', { underline: true });
    doc.moveDown(0.5);

    let y = doc.y;
    doc.fontSize(10);
    doc.text('Subject', 50, y);
    doc.text('Marks', 300, y);
    doc.text('Grade', 400, y);
    doc.moveDown(0.3);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.3);

    exams.forEach((exam) => {
      const mark = exam.marks[0];
      if (mark) {
        doc.text(exam.subject || exam.name, 50);
        doc.text(Number(mark.marks).toFixed(2), 300);
        doc.text(mark.grade || '-', 400);
        doc.moveDown(0.3);
      }
    });

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Summary
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('SUMMARY', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    if (reportCard.totalMarks) {
      doc.text(`Total Marks: ${Number(reportCard.totalMarks).toFixed(2)}`);
    }
    if (reportCard.average) {
      doc.text(`Average: ${Number(reportCard.average).toFixed(2)}`);
    }
    if (reportCard.grade) {
      doc.text(`Grade: ${reportCard.grade}`);
    }
    if (reportCard.position) {
      doc.text(`Position: ${reportCard.position}`);
    }
    doc.moveDown();

    if (reportCard.remarks) {
      doc.text(`Remarks: ${reportCard.remarks}`);
    }

    doc.end();

    await new Promise((resolve) => {
      doc.on('end', resolve);
    });

    return filePath;
  }
}

