export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  CLERK = 'CLERK',
}

export enum PaymentMode {
  CASH = 'CASH',
  MPESA = 'MPESA',
  BANK = 'BANK',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  classId?: string;
  parentId?: string;
  class?: Class;
  parent?: Parent;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  stream?: string;
  capacity: number;
}

export interface Parent {
  id: string;
  userId: string;
  user?: User;
}

export interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  term?: string;
  academicYear: string;
  isActive: boolean;
}

export interface StudentFee {
  id: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidAmount: number;
  balance: number;
  carryover: number;
  feeStructure?: FeeStructure;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentMode: PaymentMode;
  status: PaymentStatus;
  receiptNumber?: string;
  reference?: string;
  createdAt: string;
  student?: Student;
}

export interface Exam {
  id: string;
  name: string;
  examType: string;
  classId: string;
  subject?: string;
  date: string;
  maxMarks: number;
  academicYear: string;
  term: string;
}

export interface Mark {
  id: string;
  studentId: string;
  examId: string;
  marks: number;
  grade?: string;
  student?: Student;
}

