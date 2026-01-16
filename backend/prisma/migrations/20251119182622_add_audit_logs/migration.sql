-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `action` ENUM('LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'PASSWORD_CHANGE', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'STUDENT_CREATED', 'STUDENT_UPDATED', 'STUDENT_DELETED', 'PAYMENT_CREATED', 'PAYMENT_UPDATED', 'PAYMENT_DELETED', 'FEE_CREATED', 'FEE_UPDATED', 'FEE_DELETED', 'EXAM_CREATED', 'EXAM_UPDATED', 'EXAM_DELETED', 'MARKS_ENTERED', 'MARKS_UPDATED', 'REPORT_GENERATED', 'SMS_SENT', 'MPESA_TRANSACTION', 'DATA_EXPORTED', 'SETTINGS_CHANGED', 'PERMISSION_CHANGED', 'BULK_OPERATION', 'CRITICAL_ERROR', 'UNAUTHORIZED_ACCESS', 'SUSPICIOUS_ACTIVITY') NOT NULL,
    `userId` VARCHAR(191) NULL,
    `userEmail` VARCHAR(191) NULL,
    `userRole` ENUM('SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT', 'TEACHER', 'PARENT', 'CLERK') NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `resource` VARCHAR(191) NULL,
    `resourceId` VARCHAR(191) NULL,
    `oldValue` TEXT NULL,
    `newValue` TEXT NULL,
    `metadata` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'SUCCESS',
    `errorMessage` TEXT NULL,
    `severity` VARCHAR(191) NOT NULL DEFAULT 'INFO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_action_idx`(`action`),
    INDEX `audit_logs_userId_idx`(`userId`),
    INDEX `audit_logs_createdAt_idx`(`createdAt`),
    INDEX `audit_logs_severity_idx`(`severity`),
    INDEX `audit_logs_status_idx`(`status`),
    INDEX `audit_logs_resource_resourceId_idx`(`resource`, `resourceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
