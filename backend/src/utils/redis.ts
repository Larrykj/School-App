import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const REDIS_ENABLED = process.env.ENABLE_REDIS !== 'false';

let redisClient: Redis | null = null;
let errorLogged = false;

if (REDIS_ENABLED) {
  try {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy(times) {
        // Stop retrying after 3 attempts
        if (times > 3) {
          if (!errorLogged) {
            console.log('\n⚠️  Redis is not available - running without cache');
            console.log('💡 The app will work fine, but performance may be slower');
            console.log('💡 To install Redis: See INSTALL_REDIS_NOW.md\n');
            errorLogged = true;
          }
          return null; // Stop retrying
        }
        return Math.min(times * 100, 1000);
      },
    });

    // Suppress repetitive error logging
    redisClient.on('error', (err: any) => {
      if (!errorLogged && err.code === 'ECONNREFUSED') {
        console.log('\n⚠️  Redis connection failed - caching disabled');
        errorLogged = true;
      }
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected - caching enabled');
      errorLogged = false;
    });

    // Try to connect
    redisClient.connect().catch(() => {
      // Silent fail - errors handled by retryStrategy
    });
  } catch (error) {
    console.log('⚠️  Redis initialization failed - running without cache');
  }
} else {
  console.log('ℹ️  Redis disabled (ENABLE_REDIS=false)');
}

export default redisClient;

