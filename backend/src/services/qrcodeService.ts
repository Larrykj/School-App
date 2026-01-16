import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const QR_DIR = process.env.QR_DIR || './qrcodes';

// Ensure QR directory exists
if (!fs.existsSync(QR_DIR)) {
  fs.mkdirSync(QR_DIR, { recursive: true });
}

export class QRCodeService {
  /**
   * Generate QR code for student ID
   */
  static async generateStudentQR(studentId: string, admissionNumber: string): Promise<string> {
    const data = JSON.stringify({
      type: 'STUDENT',
      id: studentId,
      admissionNumber,
      timestamp: Date.now(),
    });

    const fileName = `student_${admissionNumber}.png`;
    const filePath = path.join(QR_DIR, fileName);

    await QRCode.toFile(filePath, data, {
      width: 300,
      margin: 1,
    });

    return filePath;
  }

  /**
   * Generate QR code data URL
   */
  static async generateQRDataURL(data: any): Promise<string> {
    return await QRCode.toDataURL(JSON.stringify(data));
  }

  /**
   * Verify QR code data
   */
  static verifyQRData(qrData: string): any {
    try {
      return JSON.parse(qrData);
    } catch (error) {
      throw new Error('Invalid QR code data');
    }
  }
}

