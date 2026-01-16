import { UserRole, PaymentMode, PaymentStatus, AttendanceStatus, ExamType } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export { UserRole, PaymentMode, PaymentStatus, AttendanceStatus, ExamType };

