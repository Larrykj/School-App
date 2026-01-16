-- CreateIndex
CREATE INDEX `attendance_classId_date_idx` ON `attendance`(`classId`, `date`);

-- CreateIndex
CREATE INDEX `attendance_date_idx` ON `attendance`(`date`);

-- CreateIndex
CREATE INDEX `books_title_idx` ON `books`(`title`);

-- CreateIndex
CREATE INDEX `books_category_idx` ON `books`(`category`);

-- CreateIndex
CREATE INDEX `exams_date_idx` ON `exams`(`date`);

-- CreateIndex
CREATE INDEX `inventory_items_category_idx` ON `inventory_items`(`category`);

-- CreateIndex
CREATE INDEX `payments_status_idx` ON `payments`(`status`);

-- CreateIndex
CREATE INDEX `payments_createdAt_idx` ON `payments`(`createdAt`);

-- CreateIndex
CREATE INDEX `payments_paymentMode_idx` ON `payments`(`paymentMode`);

-- CreateIndex
CREATE INDEX `report_cards_academicYear_term_idx` ON `report_cards`(`academicYear`, `term`);

-- CreateIndex
CREATE INDEX `sms_logs_status_idx` ON `sms_logs`(`status`);

-- CreateIndex
CREATE INDEX `sms_logs_sentAt_idx` ON `sms_logs`(`sentAt`);

-- CreateIndex
CREATE INDEX `student_fees_isPaid_idx` ON `student_fees`(`isPaid`);

-- CreateIndex
CREATE INDEX `student_fees_dueDate_idx` ON `student_fees`(`dueDate`);

-- CreateIndex
CREATE INDEX `students_firstName_lastName_idx` ON `students`(`firstName`, `lastName`);

-- CreateIndex
CREATE INDEX `students_isActive_idx` ON `students`(`isActive`);

-- CreateIndex
CREATE INDEX `students_admissionNumber_idx` ON `students`(`admissionNumber`);

-- CreateIndex
CREATE INDEX `timetables_classId_idx` ON `timetables`(`classId`);

-- CreateIndex
CREATE INDEX `users_role_isActive_idx` ON `users`(`role`, `isActive`);

-- RenameIndex
ALTER TABLE `exams` RENAME INDEX `exams_classId_fkey` TO `exams_classId_idx`;

-- RenameIndex
ALTER TABLE `marks` RENAME INDEX `marks_examId_fkey` TO `marks_examId_idx`;

-- RenameIndex
ALTER TABLE `payments` RENAME INDEX `payments_studentId_fkey` TO `payments_studentId_idx`;

-- RenameIndex
ALTER TABLE `student_fees` RENAME INDEX `student_fees_feeStructureId_fkey` TO `student_fees_feeStructureId_idx`;

-- RenameIndex
ALTER TABLE `student_fees` RENAME INDEX `student_fees_studentId_fkey` TO `student_fees_studentId_idx`;

-- RenameIndex
ALTER TABLE `students` RENAME INDEX `students_classId_fkey` TO `students_classId_idx`;

-- RenameIndex
ALTER TABLE `students` RENAME INDEX `students_parentId_fkey` TO `students_parentId_idx`;

-- RenameIndex
ALTER TABLE `timetables` RENAME INDEX `timetables_teacherId_fkey` TO `timetables_teacherId_idx`;
