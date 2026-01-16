/*
  Warnings:

  - A unique constraint covering the columns `[kuccpsIndex]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `students` ADD COLUMN `bloodGroup` VARCHAR(191) NULL,
    ADD COLUMN `county` VARCHAR(191) NULL,
    ADD COLUMN `disabilities` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `emergencyContactName` VARCHAR(191) NULL,
    ADD COLUMN `emergencyContactPhone` VARCHAR(191) NULL,
    ADD COLUMN `kuccpsIndex` VARCHAR(191) NULL,
    ADD COLUMN `medicalConditions` VARCHAR(191) NULL,
    ADD COLUMN `photoUrl` VARCHAR(191) NULL,
    ADD COLUMN `placementType` VARCHAR(191) NULL,
    ADD COLUMN `placementYear` INTEGER NULL,
    ADD COLUMN `subCounty` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `academic_programs` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `programType` ENUM('DIPLOMA', 'CERTIFICATE', 'BACHELORS', 'MASTERS', 'PHD') NOT NULL,
    `departmentId` VARCHAR(191) NULL,
    `duration` INTEGER NOT NULL,
    `creditHours` INTEGER NOT NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `academic_programs_code_key`(`code`),
    INDEX `academic_programs_code_idx`(`code`),
    INDEX `academic_programs_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `headOfDept` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `departments_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `creditHours` INTEGER NOT NULL DEFAULT 3,
    `departmentId` VARCHAR(191) NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `isElective` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `courses_code_key`(`code`),
    INDEX `courses_code_idx`(`code`),
    INDEX `courses_departmentId_idx`(`departmentId`),
    INDEX `courses_level_idx`(`level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_prerequisites` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `prerequisiteId` VARCHAR(191) NOT NULL,
    `isStrict` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `course_prerequisites_courseId_prerequisiteId_key`(`courseId`, `prerequisiteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_courses` (
    `id` VARCHAR(191) NOT NULL,
    `programId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `program_courses_programId_semester_idx`(`programId`, `semester`),
    UNIQUE INDEX `program_courses_programId_courseId_key`(`programId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academic_years` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `academic_years_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `semesters` (
    `id` VARCHAR(191) NOT NULL,
    `academicYearId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `registrationStart` DATETIME(3) NOT NULL,
    `registrationEnd` DATETIME(3) NOT NULL,
    `status` ENUM('UPCOMING', 'ACTIVE', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'UPCOMING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `semesters_academicYearId_idx`(`academicYearId`),
    INDEX `semesters_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_offerings` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `semesterId` VARCHAR(191) NOT NULL,
    `lecturerId` VARCHAR(191) NULL,
    `venue` VARCHAR(191) NULL,
    `maxStudents` INTEGER NOT NULL DEFAULT 50,
    `schedule` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `course_offerings_semesterId_idx`(`semesterId`),
    INDEX `course_offerings_lecturerId_idx`(`lecturerId`),
    UNIQUE INDEX `course_offerings_courseId_semesterId_key`(`courseId`, `semesterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_enrollments` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `programId` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `yearOfStudy` INTEGER NOT NULL DEFAULT 1,
    `semesterOfStudy` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'GRADUATED', 'WITHDRAWN') NOT NULL DEFAULT 'ACTIVE',
    `enrollmentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expectedGraduation` DATETIME(3) NULL,
    `currentGPA` DECIMAL(4, 2) NULL,
    `cumulativeCredits` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_enrollments_registrationNumber_key`(`registrationNumber`),
    INDEX `student_enrollments_studentId_idx`(`studentId`),
    INDEX `student_enrollments_programId_idx`(`programId`),
    INDEX `student_enrollments_status_idx`(`status`),
    UNIQUE INDEX `student_enrollments_studentId_programId_key`(`studentId`, `programId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_registrations` (
    `id` VARCHAR(191) NOT NULL,
    `enrollmentId` VARCHAR(191) NOT NULL,
    `offeringId` VARCHAR(191) NOT NULL,
    `semesterId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'DROPPED') NOT NULL DEFAULT 'PENDING',
    `registeredDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approvedBy` VARCHAR(191) NULL,
    `approvedDate` DATETIME(3) NULL,
    `droppedDate` DATETIME(3) NULL,
    `dropReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `course_registrations_enrollmentId_idx`(`enrollmentId`),
    INDEX `course_registrations_semesterId_idx`(`semesterId`),
    INDEX `course_registrations_status_idx`(`status`),
    UNIQUE INDEX `course_registrations_enrollmentId_offeringId_key`(`enrollmentId`, `offeringId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_grades` (
    `id` VARCHAR(191) NOT NULL,
    `enrollmentId` VARCHAR(191) NOT NULL,
    `offeringId` VARCHAR(191) NOT NULL,
    `catMarks` DECIMAL(5, 2) NULL,
    `examMarks` DECIMAL(5, 2) NULL,
    `totalMarks` DECIMAL(5, 2) NULL,
    `letterGrade` VARCHAR(191) NULL,
    `gradePoints` DECIMAL(3, 2) NULL,
    `creditHours` INTEGER NOT NULL DEFAULT 3,
    `remarks` VARCHAR(191) NULL,
    `submittedBy` VARCHAR(191) NULL,
    `submittedDate` DATETIME(3) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `course_grades_enrollmentId_idx`(`enrollmentId`),
    INDEX `course_grades_isPublished_idx`(`isPublished`),
    UNIQUE INDEX `course_grades_enrollmentId_offeringId_key`(`enrollmentId`, `offeringId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grading_scales` (
    `id` VARCHAR(191) NOT NULL,
    `minPercentage` DECIMAL(5, 2) NOT NULL,
    `maxPercentage` DECIMAL(5, 2) NOT NULL,
    `letterGrade` VARCHAR(191) NOT NULL,
    `gradePoints` DECIMAL(3, 2) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `grading_scales_isActive_idx`(`isActive`),
    UNIQUE INDEX `grading_scales_letterGrade_key`(`letterGrade`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transcripts` (
    `id` VARCHAR(191) NOT NULL,
    `enrollmentId` VARCHAR(191) NOT NULL,
    `generatedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `generatedBy` VARCHAR(191) NULL,
    `academicData` TEXT NOT NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `isOfficial` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `transcripts_enrollmentId_idx`(`enrollmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applications` (
    `id` VARCHAR(191) NOT NULL,
    `applicationNumber` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NOT NULL DEFAULT 'Kenyan',
    `nationalId` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `county` VARCHAR(191) NOT NULL,
    `subCounty` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NULL,
    `kcseIndex` VARCHAR(191) NULL,
    `kcseYear` INTEGER NULL,
    `kcseGrade` VARCHAR(191) NULL,
    `kcsePoints` INTEGER NULL,
    `secondarySchool` VARCHAR(191) NULL,
    `previousInstitution` VARCHAR(191) NULL,
    `previousProgram` VARCHAR(191) NULL,
    `previousGPA` VARCHAR(191) NULL,
    `graduationYear` INTEGER NULL,
    `programId` VARCHAR(191) NOT NULL,
    `intake` VARCHAR(191) NOT NULL,
    `kuccpsIndex` VARCHAR(191) NULL,
    `kuccpsPlacement` VARCHAR(191) NULL,
    `placementType` VARCHAR(191) NULL,
    `guardianName` VARCHAR(191) NOT NULL,
    `guardianPhone` VARCHAR(191) NOT NULL,
    `guardianEmail` VARCHAR(191) NULL,
    `guardianRelationship` VARCHAR(191) NOT NULL,
    `bloodGroup` VARCHAR(191) NULL,
    `disabilities` VARCHAR(191) NULL,
    `medicalConditions` VARCHAR(191) NULL,
    `emergencyContactName` VARCHAR(191) NOT NULL,
    `emergencyContactPhone` VARCHAR(191) NOT NULL,
    `emergencyContactRelation` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED') NOT NULL DEFAULT 'DRAFT',
    `submittedAt` DATETIME(3) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `reviewNotes` TEXT NULL,
    `admissionLetter` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `applications_applicationNumber_key`(`applicationNumber`),
    UNIQUE INDEX `applications_studentId_key`(`studentId`),
    INDEX `applications_status_idx`(`status`),
    INDEX `applications_programId_idx`(`programId`),
    INDEX `applications_kuccpsIndex_idx`(`kuccpsIndex`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `application_documents` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `documentType` ENUM('KCSE_CERTIFICATE', 'BIRTH_CERTIFICATE', 'NATIONAL_ID', 'PASSPORT_PHOTO', 'RECOMMENDATION_LETTER', 'TRANSCRIPT', 'DEGREE_CERTIFICATE', 'OTHER') NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `verifiedBy` VARCHAR(191) NULL,
    `verifiedAt` DATETIME(3) NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `application_documents_applicationId_idx`(`applicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_documents` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `documentType` ENUM('KCSE_CERTIFICATE', 'BIRTH_CERTIFICATE', 'NATIONAL_ID', 'PASSPORT_PHOTO', 'RECOMMENDATION_LETTER', 'TRANSCRIPT', 'DEGREE_CERTIFICATE', 'OTHER') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `issuedDate` DATETIME(3) NULL,
    `expiryDate` DATETIME(3) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `verifiedBy` VARCHAR(191) NULL,
    `verifiedAt` DATETIME(3) NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `student_documents_studentId_idx`(`studentId`),
    INDEX `student_documents_documentType_idx`(`documentType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_medical_records` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `recordDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `recordType` VARCHAR(191) NOT NULL,
    `diagnosis` VARCHAR(191) NULL,
    `treatment` TEXT NULL,
    `prescriptions` TEXT NULL,
    `doctorName` VARCHAR(191) NULL,
    `facility` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `followUpDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `student_medical_records_studentId_idx`(`studentId`),
    INDEX `student_medical_records_recordDate_idx`(`recordDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disciplinary_records` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `incidentDate` DATETIME(3) NOT NULL,
    `incidentType` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `actionDetails` TEXT NULL,
    `reportedBy` VARCHAR(191) NOT NULL,
    `witnessedBy` VARCHAR(191) NULL,
    `parentNotified` BOOLEAN NOT NULL DEFAULT false,
    `notifiedAt` DATETIME(3) NULL,
    `resolved` BOOLEAN NOT NULL DEFAULT false,
    `resolvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `disciplinary_records_studentId_idx`(`studentId`),
    INDEX `disciplinary_records_incidentDate_idx`(`incidentDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_id_cards` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `cardNumber` VARCHAR(191) NOT NULL,
    `issuedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiryDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `qrCode` VARCHAR(191) NULL,
    `barcodeData` VARCHAR(191) NULL,
    `cardImageUrl` VARCHAR(191) NULL,
    `printedAt` DATETIME(3) NULL,
    `printedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_id_cards_studentId_key`(`studentId`),
    UNIQUE INDEX `student_id_cards_cardNumber_key`(`cardNumber`),
    INDEX `student_id_cards_studentId_idx`(`studentId`),
    INDEX `student_id_cards_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `students_kuccpsIndex_key` ON `students`(`kuccpsIndex`);

-- AddForeignKey
ALTER TABLE `academic_programs` ADD CONSTRAINT `academic_programs_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_prerequisites` ADD CONSTRAINT `course_prerequisites_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_prerequisites` ADD CONSTRAINT `course_prerequisites_prerequisiteId_fkey` FOREIGN KEY (`prerequisiteId`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_courses` ADD CONSTRAINT `program_courses_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `academic_programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_courses` ADD CONSTRAINT `program_courses_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `semesters` ADD CONSTRAINT `semesters_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_offerings` ADD CONSTRAINT `course_offerings_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_offerings` ADD CONSTRAINT `course_offerings_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `semesters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_offerings` ADD CONSTRAINT `course_offerings_lecturerId_fkey` FOREIGN KEY (`lecturerId`) REFERENCES `staff`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_enrollments` ADD CONSTRAINT `student_enrollments_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_enrollments` ADD CONSTRAINT `student_enrollments_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `academic_programs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_registrations` ADD CONSTRAINT `course_registrations_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `student_enrollments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_registrations` ADD CONSTRAINT `course_registrations_offeringId_fkey` FOREIGN KEY (`offeringId`) REFERENCES `course_offerings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_registrations` ADD CONSTRAINT `course_registrations_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `semesters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_grades` ADD CONSTRAINT `course_grades_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `student_enrollments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_grades` ADD CONSTRAINT `course_grades_offeringId_fkey` FOREIGN KEY (`offeringId`) REFERENCES `course_offerings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transcripts` ADD CONSTRAINT `transcripts_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `student_enrollments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `academic_programs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `application_documents` ADD CONSTRAINT `application_documents_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_documents` ADD CONSTRAINT `student_documents_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_medical_records` ADD CONSTRAINT `student_medical_records_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disciplinary_records` ADD CONSTRAINT `disciplinary_records_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
