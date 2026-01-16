# Performance Optimization Guide 🚀

Quick reference guide for the performance features implemented in Phase 7.

---

## Table of Contents
1. [Caching](#caching)
2. [Database Optimization](#database-optimization)
3. [API Performance](#api-performance)
4. [Frontend Optimization](#frontend-optimization)
5. [Monitoring](#monitoring)
6. [Troubleshooting](#troubleshooting)

---

## Caching

### Redis Setup

**Start Redis:**
```bash
# Docker
docker run -d -p 6379:6379 redis:latest

# Linux
redis-server

# Check status
redis-cli ping  # Should return "PONG"
```

### Using the Cache Service

```typescript
import { cacheService, CacheKeys, CacheTTL } from '@/services/cacheService';

// Simple get/set
await cacheService.set('myKey', { data: 'value' }, 300); // 5 minutes
const data = await cacheService.get('myKey');

// Get or fetch pattern
const student = await cacheService.getOrSet(
  CacheKeys.student(id),
  async () => await prisma.student.findUnique({ where: { id } }),
  CacheTTL.MEDIUM
);

// Invalidate cache
await cacheService.del(CacheKeys.student(id));
await cacheService.delPattern('students:*'); // Clear all student caches
```

### Cache Keys Reference

```typescript
CacheKeys.student(id)                    // Individual student
CacheKeys.studentList(filters)           // Student lists
CacheKeys.class(id)                      // Class data
CacheKeys.studentFees(studentId, term)   // Fee information
CacheKeys.attendance(classId, date)      // Attendance records
CacheKeys.analytics(type, filters)       // Analytics data
```

### Cache TTL Values

```typescript
CacheTTL.SHORT      // 1 minute   - List queries
CacheTTL.MEDIUM     // 5 minutes  - Detail queries
CacheTTL.LONG       // 30 minutes - Analytics
CacheTTL.VERY_LONG  // 1 hour     - Static data
CacheTTL.DAY        // 24 hours   - Rarely changing data
```

---

## Database Optimization

### Connection Pooling

Set in your `DATABASE_URL`:
```env
DATABASE_URL="mysql://user:pass@host:port/db?connection_limit=20&pool_timeout=30"
```

### Pagination Helpers

```typescript
import { getPaginationParams } from '@/config/database';

export const getStudents = async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const { skip, take } = getPaginationParams(page, limit);

  const students = await prisma.student.findMany({
    skip,
    take,
    // ... other options
  });
};
```

### Query Optimization Tips

```typescript
// ✅ GOOD: Select only needed fields
await prisma.student.findMany({
  select: {
    id: true,
    firstName: true,
    lastName: true,
    class: {
      select: { id: true, name: true }
    }
  }
});

// ❌ BAD: Loading all fields and relations
await prisma.student.findMany({
  include: {
    class: true,
    parent: { include: { user: true } },
    fees: { include: { feeStructure: true } },
    // ... tons of data
  }
});

// ✅ GOOD: Parallel queries
const [students, total] = await Promise.all([
  prisma.student.findMany({ /* ... */ }),
  prisma.student.count({ /* ... */ })
]);

// ❌ BAD: Sequential queries
const students = await prisma.student.findMany({ /* ... */ });
const total = await prisma.student.count({ /* ... */ });
```

---

## API Performance

### Response Compression

Automatically enabled for responses >1KB. No configuration needed.

### Rate Limiting

```typescript
import { RateLimiters } from '@/middleware/rateLimiter';

// Apply to routes
router.post('/api/auth/login', RateLimiters.auth, loginHandler);
router.post('/api/payments', RateLimiters.payment, paymentHandler);
router.post('/api/sms/send', RateLimiters.sms, smsHandler);
```

**Rate Limit Settings:**
- Auth endpoints: 5 requests / 15 minutes
- Payment endpoints: 10 requests / minute
- SMS endpoints: 50 requests / hour
- General API: 1000 requests / 15 minutes

### Performance Monitoring

```typescript
import { PerformanceTracker } from '@/utils/performance';

export const myHandler = async (req: Request, res: Response) => {
  const tracker = new PerformanceTracker();
  
  const data = await fetchData();
  tracker.checkpoint('data-fetched');
  
  const processed = await processData(data);
  tracker.checkpoint('data-processed');
  
  console.log(tracker.getReport());
  res.json(processed);
};
```

---

## Frontend Optimization

### Lazy Loading Components

```typescript
import { LazyCharts, createLazyComponent } from '@/lib/lazyComponents';

// Use pre-configured components
export default function Dashboard() {
  return <LazyCharts data={chartData} />;
}

// Create custom lazy component
const LazyMyComponent = createLazyComponent(
  () => import('@/components/MyComponent'),
  <div>Loading...</div>
);
```

### Image Optimization

```typescript
import Image from 'next/image';
import { compressImage, getOptimizedImageUrl } from '@/lib/imageOptimization';

// 1. Use Next.js Image component (auto-optimized)
<Image
  src="/photo.jpg"
  alt="Photo"
  width={400}
  height={300}
  loading="lazy"  // Lazy load images
  quality={75}    // Compression quality
/>

// 2. Compress images before upload
const handleUpload = async (file: File) => {
  const compressed = await compressImage(
    file,
    1920,  // max width
    1080,  // max height
    0.8    // quality (0-1)
  );
  
  // Upload compressed blob
  await uploadImage(compressed);
};

// 3. Get optimized URL
const optimizedUrl = getOptimizedImageUrl('/image.jpg', {
  width: 800,
  quality: 80,
  format: 'webp'
});
```

### Code Splitting

Next.js automatically splits code by pages. For additional splitting:

```typescript
import dynamic from 'next/dynamic';

// Dynamic import with custom loading
const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false  // Only load on client if needed
  }
);
```

---

## Monitoring

### Health Check

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-19T12:00:00.000Z",
  "uptime": 3600,
  "memory": {
    "rss": "150MB",
    "heapUsed": "80MB",
    "heapTotal": "120MB"
  },
  "redis": true
}
```

### System Health

```typescript
import { getSystemHealth, getMemoryUsage } from '@/utils/performance';

// Get full health report
const health = await getSystemHealth();

// Get memory usage
const memory = getMemoryUsage();
console.log(`Memory: ${memory.heapUsed} / ${memory.heapTotal}`);
```

### Performance Testing

```bash
# Run performance unit tests
npm run test:performance

# Run full benchmark
npm start &  # Start server
npm run perf:benchmark

# With authentication
TEST_AUTH_TOKEN=your-token npm run perf:test
```

### Performance Headers

Check response headers:
```bash
curl -I http://localhost:5000/api/students

# Look for:
X-Response-Time: 120ms        # Actual response time
Content-Encoding: gzip         # Compression enabled
```

---

## Troubleshooting

### Redis Connection Issues

```bash
# Check if Redis is running
redis-cli ping

# Check Redis info
redis-cli INFO

# View all keys
redis-cli KEYS "*"

# Clear all cache
redis-cli FLUSHDB
```

**App behavior without Redis:**
- Continues to work normally
- No caching (slower responses)
- In-memory rate limiting (not distributed)
- Check logs for: "Redis error: ..."

### Slow Queries

**Check logs for warnings:**
```
[SLOW QUERY] getStudents - 650ms
[SLOW REQUEST] GET /api/students - 1200ms
```

**Solutions:**
1. Check database indexes exist
2. Review query patterns (use `select`, avoid deep `include`)
3. Enable query logging: Set `ENABLE_QUERY_LOGGING=true` in `.env`
4. Use caching for frequently accessed data

### Cache Not Working

**Verify cache is enabled:**
```typescript
import { cacheService } from '@/services/cacheService';

console.log('Cache available:', cacheService.isAvailable());
```

**Check Redis keys:**
```bash
redis-cli KEYS "*"
redis-cli GET "student:abc-123"
```

**Clear cache:**
```bash
# Clear all
redis-cli FLUSHDB

# Clear pattern
redis-cli --scan --pattern "students:*" | xargs redis-cli DEL
```

### High Memory Usage

**Check memory:**
```typescript
import { getMemoryUsage } from '@/utils/performance';
console.log(getMemoryUsage());
```

**Solutions:**
1. Restart server to clear memory
2. Reduce cache TTL values
3. Limit query result sizes
4. Use pagination for large datasets

### Slow Frontend Loading

**Check bundle size:**
```bash
cd frontend
npm run build
# Check .next/analyze for bundle analysis
```

**Solutions:**
1. Use lazy loading for heavy components
2. Enable code splitting
3. Optimize images
4. Remove unused dependencies

---

## Performance Targets

### API Response Times
- Health endpoint: <50ms
- Cached responses: <50ms
- List queries: <200ms
- Detail queries: <200ms
- Analytics: <500ms

### Frontend Performance
- First Contentful Paint: <1.5s
- Time to Interactive: <2.5s
- Bundle size: <500KB

### System Capacity
- Concurrent users: 1000+
- Requests/second: 100+
- Cache hit rate: >70%

---

## Quick Commands

```bash
# Start services
docker start redis  # or: redis-server
npm start

# Test performance
npm run perf:benchmark

# Check Redis
redis-cli ping
redis-cli KEYS "*"
redis-cli INFO stats

# Monitor logs
npm run dev  # Shows slow queries/requests

# Clear cache
redis-cli FLUSHDB

# Load test
ab -n 1000 -c 100 http://localhost:5000/health
```

---

## Best Practices

### DO ✅
- Cache frequently accessed data
- Use Redis for production caching
- Implement pagination for large datasets
- Use selective field retrieval
- Lazy load heavy components
- Optimize images before upload
- Monitor performance metrics
- Set appropriate cache TTLs

### DON'T ❌
- Cache user-specific sensitive data too long
- Forget to invalidate cache on mutations
- Load unnecessary relations
- Use `select: *` in production
- Skip image optimization
- Ignore slow query warnings
- Set very long TTLs on dynamic data

---

## Additional Resources

- **Full Documentation:** `docs/PHASE_7_COMPLETE.md`
- **Cache Service:** `backend/src/services/cacheService.ts`
- **Performance Utils:** `backend/src/utils/performance.ts`
- **Testing Script:** `backend/scripts/performance-test.ts`

---

**Need Help?**
- Check logs for performance warnings
- Run benchmark to identify bottlenecks
- Review health endpoint for system status
- Use performance monitoring in development

---

*System is optimized and ready for production! 🚀*

