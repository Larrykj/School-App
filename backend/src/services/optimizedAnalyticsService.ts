import { AnalyticsService } from './analyticsService';
import { CacheService } from '../utils/cache';

/**
 * Optimized Analytics Service with caching
 */
export class OptimizedAnalyticsService {
  /**
   * Get fee analytics with caching (5 minutes)
   */
  static async getFeeAnalytics(academicYear: string, term?: string) {
    const cacheKey = `analytics:fees:${academicYear}:${term || 'all'}`;
    
    return CacheService.getOrSet(
      cacheKey,
      () => AnalyticsService.getFeeAnalytics(academicYear, term),
      300 // 5 minutes TTL
    );
  }

  /**
   * Get performance analytics with caching (10 minutes)
   */
  static async getPerformanceAnalytics(academicYear: string, term?: string, classId?: string) {
    const cacheKey = `analytics:performance:${academicYear}:${term || 'all'}:${classId || 'all'}`;
    
    return CacheService.getOrSet(
      cacheKey,
      () => AnalyticsService.getStudentPerformanceAnalytics(academicYear, term, classId),
      600 // 10 minutes TTL
    );
  }

  /**
   * Get attendance analytics with caching (5 minutes)
   */
  static async getAttendanceAnalytics(startDate?: Date, endDate?: Date, classId?: string) {
    const cacheKey = `analytics:attendance:${startDate?.toISOString() || 'all'}:${endDate?.toISOString() || 'all'}:${classId || 'all'}`;
    
    return CacheService.getOrSet(
      cacheKey,
      () => AnalyticsService.getAttendanceAnalytics(startDate, endDate, classId),
      300 // 5 minutes TTL
    );
  }

  /**
   * Get revenue forecast with caching (1 hour)
   */
  static async getRevenueForecast(months: number = 6) {
    const cacheKey = `analytics:forecast:${months}`;
    
    return CacheService.getOrSet(
      cacheKey,
      () => AnalyticsService.getRevenueForecast(months),
      3600 // 1 hour TTL
    );
  }

  /**
   * Invalidate analytics cache (call after data changes)
   */
  static async invalidateCache() {
    await CacheService.invalidate('analytics');
  }
}

