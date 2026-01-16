-- Performance Optimization Indexes
-- Add these indexes to improve query performance

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);

-- Student table indexes
CREATE INDEX IF NOT EXISTS idx_student_class ON students(classId);
CREATE INDEX IF NOT EXISTS idx_student_parent ON students(parentId);
CREATE INDEX IF NOT EXISTS idx_student_admission ON students(admissionNumber);
CREATE INDEX IF NOT EXISTS idx_student_active ON students(isActive);
CREATE INDEX IF NOT EXISTS idx_student_dormitory ON students(dormitoryId);
CREATE INDEX IF NOT EXISTS idx_student_transport ON students(transportId);

-- Payment table indexes
CREATE INDEX IF NOT EXISTS idx_payment_student ON payments(studentId);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payment_mode ON payments(paymentMode);
CREATE INDEX IF NOT EXISTS idx_payment_date ON payments(createdAt);
CREATE INDEX IF NOT EXISTS idx_payment_receipt ON payments(receiptNumber);

-- StudentFee table indexes
CREATE INDEX IF NOT EXISTS idx_studentfee_student ON student_fees(studentId);
CREATE INDEX IF NOT EXISTS idx_studentfee_structure ON student_fees(feeStructureId);
CREATE INDEX IF NOT EXISTS idx_studentfee_paid ON student_fees(isPaid);
CREATE INDEX IF NOT EXISTS idx_studentfee_duedate ON student_fees(dueDate);

-- Attendance table indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(studentId);
CREATE INDEX IF NOT EXISTS idx_attendance_class ON attendance(classId);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- Exam table indexes
CREATE INDEX IF NOT EXISTS idx_exam_class ON exams(classId);
CREATE INDEX IF NOT EXISTS idx_exam_date ON exams(date);
CREATE INDEX IF NOT EXISTS idx_exam_year_term ON exams(academicYear, term);

-- Mark table indexes
CREATE INDEX IF NOT EXISTS idx_mark_student ON marks(studentId);
CREATE INDEX IF NOT EXISTS idx_mark_exam ON marks(examId);

-- MPesa Transaction indexes
CREATE INDEX IF NOT EXISTS idx_mpesa_payment ON mpesa_transactions(paymentId);
CREATE INDEX IF NOT EXISTS idx_mpesa_checkout ON mpesa_transactions(checkoutRequestId);
CREATE INDEX IF NOT EXISTS idx_mpesa_status ON mpesa_transactions(status);

-- SMS Log indexes
CREATE INDEX IF NOT EXISTS idx_smslog_recipient ON sms_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_smslog_status ON sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_smslog_sent ON sms_logs(sentAt);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_payment_student_status ON payments(studentId, status);
CREATE INDEX IF NOT EXISTS idx_studentfee_student_paid ON student_fees(studentId, isPaid);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(studentId, date);
CREATE INDEX IF NOT EXISTS idx_exam_class_year_term ON exams(classId, academicYear, term);

