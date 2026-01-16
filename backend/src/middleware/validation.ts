import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * Generic validation middleware
 */
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      const errors = error.errors?.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      res.status(400).json({
        error: 'Validation failed',
        details: errors || [{ message: error.message }],
      });
    }
  };
};

/**
 * Validation schemas
 */

// Student registration schema
export const createStudentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  gender: z.enum(['Male', 'Female'], {
    message: 'Gender must be Male or Female',
  }),
  admissionNumber: z.string().min(3, 'Admission number must be at least 3 characters'),
  classId: z.string().optional(),
  parentId: z.string().optional(),
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, 'Invalid Kenyan phone number').optional(),
  nationalId: z.string().optional(),
  address: z.string().optional(),
});

// Payment creation schema
export const createPaymentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  amount: z.number().positive('Amount must be greater than zero'),
  paymentMode: z.enum(['CASH', 'MPESA', 'BANK', 'CHEQUE'], {
    message: 'Invalid payment mode',
  }),
  paidBy: z.string().optional(),
  notes: z.string().optional(),
  phoneNumber: z.string().regex(/^(\+254|0)[17]\d{8}$/, 'Invalid Kenyan phone number').optional(),
});

// Fee structure schema
export const createFeeStructureSchema = z.object({
  name: z.string().min(3, 'Fee name must be at least 3 characters'),
  amount: z.number().positive('Amount must be greater than zero'),
  term: z.string().optional(),
  academicYear: z.string().min(4, 'Academic year is required'),
  isActive: z.boolean().optional(),
});

// Exam creation schema
export const createExamSchema = z.object({
  name: z.string().min(3, 'Exam name must be at least 3 characters'),
  examType: z.enum(['MIDTERM', 'ENDTERM', 'MOCK', 'NATIONAL'], {
    message: 'Invalid exam type',
  }),
  classId: z.string().min(1, 'Class ID is required'),
  subject: z.string().min(2, 'Subject is required'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  maxMarks: z.number().positive('Max marks must be greater than zero'),
  academicYear: z.string().min(4, 'Academic year is required'),
  term: z.string().min(1, 'Term is required'),
});

// Marks entry schema
export const enterMarksSchema = z.object({
  examId: z.string().min(1, 'Exam ID is required'),
  marks: z.array(
    z.object({
      studentId: z.string().min(1, 'Student ID is required'),
      marks: z.number().min(0, 'Marks must be non-negative'),
      grade: z.string().optional(),
      remarks: z.string().optional(),
    })
  ),
});

// Attendance marking schema
export const markAttendanceSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }).optional(),
  attendanceRecords: z.array(
    z.object({
      studentId: z.string().min(1, 'Student ID is required'),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'], {
        message: 'Invalid attendance status',
      }),
      remarks: z.string().optional(),
    })
  ),
});

// SMS sending schema
export const sendSMSSchema = z.object({
  recipients: z.array(z.string()).min(1, 'At least one recipient is required').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  targetGroup: z.enum(['ALL_PARENTS', 'ALL_TEACHERS', 'CLASS', 'INDIVIDUAL']).optional(),
  classId: z.string().optional(),
  individualIds: z.array(z.string()).optional(),
});

// User registration schema
export const registerUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, 'Invalid Kenyan phone number').optional(),
  role: z.enum(['ADMIN', 'TEACHER', 'PARENT'], {
    message: 'Invalid role',
  }),
});

