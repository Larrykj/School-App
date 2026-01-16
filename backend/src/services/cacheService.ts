import redisClient from '../utils/redis';

const DEFAULT_TTL = 3600; // 1 hour in seconds

export class CacheService {
  /**
   * Get value from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      if (!redisClient) return null;
      const data = await redisClient.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  static async set(key: string, value: any, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      if (!redisClient) return;
      const data = JSON.stringify(value);
      await redisClient.set(key, data, 'EX', ttl);
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Delete value from cache
   */
  static async del(key: string): Promise<void> {
    try {
      if (!redisClient) return;
      await redisClient.del(key);
    } catch (error) {
      console.error(`Cache del error for key ${key}:`, error);
    }
  }

  /**
   * Delete values matching pattern
   */
  static async delPattern(pattern: string): Promise<void> {
    try {
      if (!redisClient) return;
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (error) {
      console.error(`Cache delPattern error for pattern ${pattern}:`, error);
    }
  }

  /**
   * Clear all cache
   */
  static async flush(): Promise<void> {
    try {
      if (!redisClient) return;
      await redisClient.flushall();
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  }
}

