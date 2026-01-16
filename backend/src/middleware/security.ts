import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Express, Request } from 'express';
import { AuditAction } from '@prisma/client';
import AuditLogService from '../services/auditLogService';

/**
 * Configure security middleware for production
 */
export const configureSecurityMiddleware = (app: Express) => {
  // Security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind uses inline styles
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https://api.safaricom.co.ke', 'https://sandbox.safaricom.co.ke'],
        },
      },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // General API rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', apiLimiter);

  // Stricter rate limiting for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts
    message: { error: 'Too many login attempts, please try again later' },
    skipSuccessfulRequests: true, // Don't count successful logins
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);

  // Moderate limiting for payment endpoints
  const paymentLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 payment requests per minute
    message: { error: 'Too many payment requests, please wait a moment' },
  });
  app.use('/api/payments', paymentLimiter);
  app.use('/api/mpesa', paymentLimiter);

  // SMS endpoint limiting (to prevent SMS bombing)
  const smsLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // limit each IP to 50 SMS per hour
    message: { error: 'SMS limit exceeded, please try again later' },
  });
  app.use('/api/sms/send', smsLimiter);
};

/**
 * Sanitize error messages to prevent information leakage
 */
export const sanitizeError = (error: any): string => {
  if (process.env.NODE_ENV === 'production') {
    // In production, return generic error messages
    return 'An error occurred. Please try again later.';
  }
  // In development, return detailed error
  return error.message || 'Internal server error';
};

/**
 * Audit log security-relevant events
 * This is now a legacy wrapper around the AuditLogService
 * @deprecated Use AuditLogService directly for new implementations
 */
export const auditLog = async (
  event: string,
  userId?: string,
  details?: any,
  req?: Request
) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    userId: userId || 'anonymous',
    details: details || {},
  };

  // Console log for backwards compatibility
  console.log('[AUDIT]', JSON.stringify(logEntry));

  // ✅ Persistent audit logging to database
  try {
    // Map legacy event names to AuditAction enum
    const actionMap: Record<string, AuditAction> = {
      'LOGIN_SUCCESS': AuditAction.LOGIN_SUCCESS,
      'LOGIN_FAILED': AuditAction.LOGIN_FAILED,
      'LOGOUT': AuditAction.LOGOUT,
      'USER_CREATED': AuditAction.USER_CREATED,
      'USER_UPDATED': AuditAction.USER_UPDATED,
      'USER_DELETED': AuditAction.USER_DELETED,
      'PAYMENT_CREATED': AuditAction.PAYMENT_CREATED,
      'UNAUTHORIZED_ACCESS': AuditAction.UNAUTHORIZED_ACCESS,
      'SUSPICIOUS_ACTIVITY': AuditAction.SUSPICIOUS_ACTIVITY,
      'CRITICAL_ERROR': AuditAction.CRITICAL_ERROR,
    };

    const action = actionMap[event];
    
    if (action && req) {
      await AuditLogService.createFromRequest(req, action, {
        userId,
        metadata: details,
      });
    }
  } catch (error) {
    // Don't let audit logging failures break the application
    console.error('[AUDIT LOG ERROR]', error);
  }
};

/**
 * Middleware to detect and log suspicious activity
 */
export const detectSuspiciousActivity = async (req: Request, res: any, next: any) => {
  try {
    const user = (req as any).user;
    const suspiciousPatterns = {
      // SQL injection patterns
      sqlInjection: /(union|select|insert|update|delete|drop|create|alter|exec|script)/i,
      // XSS patterns
      xss: /(<script|javascript:|onerror=|onload=)/i,
      // Path traversal
      pathTraversal: /(\.\.|\/\.\.|\.\.\/)/,
    };

    // Check URL and query params for suspicious patterns
    const url = req.originalUrl;
    const queryString = JSON.stringify(req.query);
    const bodyString = JSON.stringify(req.body);

    for (const [type, pattern] of Object.entries(suspiciousPatterns)) {
      if (
        pattern.test(url) ||
        pattern.test(queryString) ||
        pattern.test(bodyString)
      ) {
        await AuditLogService.logSuspiciousActivity(
          `Potential ${type} attack detected`,
          user?.id,
          req
        );
        
        // Log but don't block (in case of false positives)
        console.warn(`[SECURITY WARNING] Suspicious ${type} pattern detected from ${req.ip}`);
      }
    }
  } catch (error) {
    console.error('[SUSPICIOUS ACTIVITY DETECTION ERROR]', error);
  }

  next();
};

