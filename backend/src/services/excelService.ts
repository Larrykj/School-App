import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import prisma from '../utils/prisma';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class ExcelService {
  /**
   * Export fee report to Excel
   */
  static async exportFeeReport(classId: string): Promise<string> {
    const students = await prisma.student.findMany({
      where: { classId, isActive: true },
      include: {
        class: true,
        fees: {
          include: {
            feeStructure: true,
          },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Fee Report');

    // Header row
    worksheet.columns = [
      { header: 'Admission Number', key: 'admissionNumber', width: 18 },
      { header: 'Student Name', key: 'name', width: 25 },
      { header: 'Class', key: 'class', width: 15 },
      { header: 'Total Due', key: 'totalDue', width: 12 },
      { header: 'Total Paid', key: 'totalPaid', width: 12 },
      { header: 'Balance', key: 'balance', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add data rows
    students.forEach((student) => {
      const totalDue = student.fees.reduce((sum, fee) => sum + Number(fee.amount), 0);
      const totalPaid = student.fees.reduce((sum, fee) => sum + Number(fee.paidAmount), 0);
      const balance = totalDue - totalPaid;

      worksheet.addRow({
        admissionNumber: student.admissionNumber,
        name: `${student.firstName} ${student.lastName}`,
        class: student.class?.name || 'N/A',
        totalDue,
        totalPaid,
        balance,
        status: balance <= 0 ? 'Paid' : 'Outstanding',
      });
    });

    // Format numbers
    worksheet.getColumn('totalDue').numFmt = '#,##0.00';
    worksheet.getColumn('totalPaid').numFmt = '#,##0.00';
    worksheet.getColumn('balance').numFmt = '#,##0.00';

    const fileName = `fee_report_${classId}_${Date.now()}.xlsx`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }

  /**
   * Export student list to Excel
   */
  static async exportStudentList(classId?: string): Promise<string> {
    const students = await prisma.student.findMany({
      where: {
        ...(classId && { classId }),
        isActive: true,
      },
      include: {
        class: true,
        parent: {
          include: {
            user: true,
          },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    worksheet.columns = [
      { header: 'Admission Number', key: 'admissionNumber', width: 18 },
      { header: 'First Name', key: 'firstName', width: 15 },
      { header: 'Last Name', key: 'lastName', width: 15 },
      { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Class', key: 'class', width: 15 },
      { header: 'Parent Name', key: 'parentName', width: 25 },
      { header: 'Parent Phone', key: 'parentPhone', width: 15 },
      { header: 'Enrollment Date', key: 'enrollmentDate', width: 15 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    students.forEach((student) => {
      worksheet.addRow({
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth.toLocaleDateString(),
        gender: student.gender,
        class: student.class?.name || 'N/A',
        parentName: student.parent
          ? `${student.parent.user.firstName} ${student.parent.user.lastName}`
          : 'N/A',
        parentPhone: student.parent?.user.phone || 'N/A',
        enrollmentDate: student.enrollmentDate.toLocaleDateString(),
      });
    });

    const fileName = `students_${classId || 'all'}_${Date.now()}.xlsx`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }
}

