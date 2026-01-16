import { AuditAction, AuditLog, UserRole } from '@prisma/client';
import prisma from '../utils/prisma';
import { Request } from 'express';

/**
 * Interface for creating audit log entries
 */
interface CreateAuditLogParams {
  action: AuditAction;
  userId?: string;
  userEmail?: string;
  userRole?: UserRole;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  metadata?: any;
  status?: 'SUCCESS' | 'FAILED' | 'WARNING';
  errorMessage?: string;
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}

/**
 * Audit Log Service
 * Provides methods for creating and querying audit logs
 */
export class AuditLogService {
  /**
   * Create an audit log entry
   */
  static async create(params: CreateAuditLogParams): Promise<AuditLog | null> {
    try {
      const auditLog = await prisma.auditLog.create({
        data: {
          action: params.action,
          userId: params.userId,
          userEmail: params.userEmail,
          userRole: params.userRole,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          resource: params.resource,
          resourceId: params.resourceId,
          oldValue: params.oldValue ? JSON.stringify(params.oldValue) : null,
          newValue: params.newValue ? JSON.stringify(params.newValue) : null,
          metadata: params.metadata ? JSON.stringify(params.metadata) : null,
          status: params.status || 'SUCCESS',
          errorMessage: params.errorMessage,
          severity: params.severity || 'INFO',
        },
      });

      return auditLog;
    } catch (error) {
      // If audit logging fails, log to console but don't crash the application
      console.error('[AUDIT LOG ERROR]', error);
      return null;
    }
  }

  /**
   * Create audit log from Express request
   */
  static async createFromRequest(
    req: Request,
    action: AuditAction,
    params: Partial<CreateAuditLogParams> = {}
  ): Promise<AuditLog | null> {
    const user = (req as any).user; // Assuming user is attached to request by auth middleware

    return this.create({
      action,
      userId: user?.id || params.userId,
      userEmail: user?.email || params.userEmail,
      userRole: user?.role || params.userRole,
      ipAddress: req.ip || req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      ...params,
    });
  }

  /**
   * Log successful login
   */
  static async logLogin(userId: string, userEmail: string, userRole: UserRole, req: Request) {
    return this.createFromRequest(req, AuditAction.LOGIN_SUCCESS, {
      userId,
      userEmail,
      userRole,
      severity: 'INFO',
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Log failed login attempt
   */
  static async logFailedLogin(email: string, req: Request, reason?: string) {
    return this.create({
      action: AuditAction.LOGIN_FAILED,
      userEmail: email,
      ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
      userAgent: req.headers['user-agent'],
      status: 'FAILED',
      errorMessage: reason,
      severity: 'WARNING',
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Log logout
   */
  static async logLogout(userId: string, req: Request) {
    return this.createFromRequest(req, AuditAction.LOGOUT, {
      userId,
      severity: 'INFO',
    });
  }

  /**
   * Log user creation
   */
  static async logUserCreated(
    createdUserId: string,
    createdByUserId: string,
    userData: any,
    req: Request
  ) {
    return this.createFromRequest(req, AuditAction.USER_CREATED, {
      userId: createdByUserId,
      resource: 'User',
      resourceId: createdUserId,
      newValue: userData,
      severity: 'INFO',
    });
  }

  /**
   * Log user update
   */
  static async logUserUpdated(
    updatedUserId: string,
    updatedByUserId: string,
    oldData: any,
    newData: any,
    req: Request
  ) {
    return this.createFromRequest(req, AuditAction.USER_UPDATED, {
      userId: updatedByUserId,
      resource: 'User',
      resourceId: updatedUserId,
      oldValue: oldData,
      newValue: newData,
      severity: 'INFO',
    });
  }

  /**
   * Log user deletion
   */
  static async logUserDeleted(
    deletedUserId: string,
    deletedByUserId: string,
    userData: any,
    req: Request
  ) {
    return this.createFromRequest(req, AuditAction.USER_DELETED, {
      userId: deletedByUserId,
      resource: 'User',
      resourceId: deletedUserId,
      oldValue: userData,
      severity: 'WARNING',
    });
  }

  /**
   * Log payment creation
   */
  static async logPaymentCreated(
    paymentId: string,
    userId: string,
    paymentData: any,
    req: Request
  ) {
    return this.createFromRequest(req, AuditAction.PAYMENT_CREATED, {
      userId,
      resource: 'Payment',
      resourceId: paymentId,
      newValue: paymentData,
      severity: 'INFO',
    });
  }

  /**
   * Log MPesa transaction
   */
  static async logMpesaTransaction(
    transactionId: string,
    transactionData: any,
    status: 'SUCCESS' | 'FAILED',
    req?: Request
  ) {
    return this.create({
      action: AuditAction.MPESA_TRANSACTION,
      resource: 'MpesaTransaction',
      resourceId: transactionId,
      newValue: transactionData,
      status,
      severity: status === 'SUCCESS' ? 'INFO' : 'WARNING',
      ipAddress: req?.ip,
      userAgent: req?.headers['user-agent'],
    });
  }

  /**
   * Log data export
   */
  static async logDataExport(
    userId: string,
    exportType: string,
    exportData: any,
    req: Request
  ) {
    return this.createFromRequest(req, AuditAction.DATA_EXPORTED, {
      userId,
      resource: exportType,
      metadata: exportData,
      severity: 'INFO',
    });
  }

  /**
   * Log unauthorized access attempt
   */
  static async logUnauthorizedAccess(
    userId: string | undefined,
    resource: string,
    req: Request
  ) {
    return this.create({
      action: AuditAction.UNAUTHORIZED_ACCESS,
      userId,
      resource,
      status: 'FAILED',
      severity: 'WARNING',
      ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
      userAgent: req.headers['user-agent'],
      metadata: {
        url: req.originalUrl,
        method: req.method,
      },
    });
  }

  /**
   * Log suspicious activity
   */
  static async logSuspiciousActivity(
    description: string,
    userId: string | undefined,
    req: Request
  ) {
    return this.create({
      action: AuditAction.SUSPICIOUS_ACTIVITY,
      userId,
      status: 'WARNING',
      severity: 'CRITICAL',
      errorMessage: description,
      ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
      userAgent: req.headers['user-agent'],
      metadata: {
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Log critical error
   */
  static async logCriticalError(
    error: Error,
    userId: string | undefined,
    context: any,
    req?: Request
  ) {
    return this.create({
      action: AuditAction.CRITICAL_ERROR,
      userId,
      status: 'FAILED',
      severity: 'CRITICAL',
      errorMessage: error.message,
      metadata: {
        stack: error.stack,
        context,
      },
      ipAddress: req?.ip,
      userAgent: req?.headers['user-agent'],
    });
  }

  /**
   * Query audit logs with filters
   */
  static async query(filters: {
    action?: AuditAction;
    userId?: string;
    resource?: string;
    severity?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters.action) where.action = filters.action;
    if (filters.userId) where.userId = filters.userId;
    if (filters.resource) where.resource = filters.resource;
    if (filters.severity) where.severity = filters.severity;
    if (filters.status) where.status = filters.status;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      total,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
    };
  }

  /**
   * Get audit logs for a specific user
   */
  static async getUserLogs(userId: string, limit = 50) {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get recent critical events
   */
  static async getCriticalEvents(hours = 24, limit = 100) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    return prisma.auditLog.findMany({
      where: {
        severity: 'CRITICAL',
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get failed login attempts
   */
  static async getFailedLoginAttempts(hours = 1, limit = 50) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    return prisma.auditLog.findMany({
      where: {
        action: AuditAction.LOGIN_FAILED,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get audit log statistics
   */
  static async getStatistics(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [
      total,
      byAction,
      bySeverity,
      byStatus,
      failedLogins,
      criticalEvents,
    ] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      prisma.auditLog.groupBy({
        by: ['severity'],
        where,
        _count: true,
      }),
      prisma.auditLog.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.auditLog.count({
        where: {
          ...where,
          action: AuditAction.LOGIN_FAILED,
        },
      }),
      prisma.auditLog.count({
        where: {
          ...where,
          severity: 'CRITICAL',
        },
      }),
    ]);

    return {
      total,
      byAction,
      bySeverity,
      byStatus,
      failedLogins,
      criticalEvents,
    };
  }

  /**
   * Clean up old audit logs (for maintenance)
   * Keep logs for a specified number of days
   */
  static async cleanup(daysToKeep = 90) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        severity: { not: 'CRITICAL' }, // Never delete critical logs
      },
    });

    return {
      deleted: result.count,
      cutoffDate,
    };
  }
}

export default AuditLogService;

