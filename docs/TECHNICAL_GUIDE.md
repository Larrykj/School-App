# Technical Guide - School Management System

**Version:** 1.0  
**Last Updated:** November 19, 2025  
**For:** Developers, IT Staff, System Administrators

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Development Setup](#development-setup)
4. [Database Design](#database-design)
5. [API Architecture](#api-architecture)
6. [Authentication & Authorization](#authentication--authorization)
7. [External Integrations](#external-integrations)
8. [Performance Optimization](#performance-optimization)
9. [Security Implementation](#security-implementation)
10. [Deployment](#deployment)
11. [Monitoring & Maintenance](#monitoring--maintenance)
12. [Troubleshooting](#troubleshooting)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │  Mobile PWA  │  │   Tablet     │      │
│  │  (Desktop)   │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS/REST API
┌───────────────────────────┴─────────────────────────────────┐
│                      Frontend Layer                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js 14 (App Router)                               │ │
│  │  - TypeScript                                          │ │
│  │  - Tailwind CSS                                        │ │
│  │  - shadcn/ui Components                                │ │
│  │  - PWA Support (Service Workers, IndexedDB)            │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │ API Calls (axios)
┌───────────────────────────┴─────────────────────────────────┐
│                       API Gateway                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware Pipeline:                                  │ │
│  │  1. CORS                                               │ │
│  │  2. Security Headers (Helmet)                          │ │
│  │  3. Rate Limiting (Redis-backed)                       │ │
│  │  4. Authentication (JWT)                               │ │
│  │  5. RBAC Authorization                                 │ │
│  │  6. Request Validation (Zod)                           │ │
│  │  7. Compression                                        │ │
│  │  8. Caching                                            │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                      Backend Layer                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js + TypeScript                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │ │
│  │  │ Controllers  │  │   Services   │  │  Utilities  │  │ │
│  │  │ (HTTP Layer) │  │  (Business)  │  │   (Helpers) │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────┴────────┐                  ┌──────────┴──────────┐
│  Data Layer    │                  │   Cache Layer       │
│  ┌──────────┐  │                  │   ┌──────────────┐  │
│  │  MySQL   │  │                  │   │    Redis     │  │
│  │  (Prisma)│  │                  │   │  (ioredis)   │  │
│  └──────────┘  │                  │   └──────────────┘  │
└────────────────┘                  └─────────────────────┘
                                     
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Safaricom  │  │   Africa's   │  │     Bull     │      │
│  │  Daraja API  │  │   Talking    │  │   Queues     │      │
│  │    (MPesa)   │  │     (SMS)    │  │  (Jobs)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### Frontend (Next.js)
- **Presentation Layer:** UI rendering, user interactions
- **State Management:** React hooks, local state
- **Offline Support:** Service workers, IndexedDB sync
- **Client-side Validation:** Form validation, input sanitization
- **PWA Features:** Installability, push notifications

#### Backend (Express)
- **API Endpoints:** RESTful API design
- **Business Logic:** Core application logic
- **Data Access:** Database operations via Prisma
- **Authentication:** JWT token management
- **Authorization:** Role-based access control
- **External API Integration:** MPesa, SMS

#### Database (MySQL + Prisma)
- **Data Persistence:** Relational data storage
- **Query Optimization:** Indexed queries, connection pooling
- **Migrations:** Version-controlled schema changes
- **Data Integrity:** Foreign keys, constraints, transactions

#### Cache (Redis)
- **Response Caching:** API response caching
- **Session Storage:** User sessions (optional)
- **Rate Limiting:** Distributed rate limiting
- **Job Queues:** Bull queue backend

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18+ | Web framework |
| TypeScript | 5.0+ | Type safety |
| Prisma | 5.0+ | ORM and database client |
| MySQL | 8.0+ | Relational database |
| ioredis | 5.3+ | Redis client |
| Bull | 4.11+ | Job queue system |
| JWT | 9.0+ | Authentication tokens |
| bcrypt | 5.1+ | Password hashing |
| Zod | 3.22+ | Schema validation |
| Helmet | 7.0+ | Security headers |
| express-rate-limit | 6.10+ | Rate limiting |
| PDFKit | 0.13+ | PDF generation |
| ExcelJS | 4.3+ | Excel file generation |
| Axios | 1.5+ | HTTP client |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14+ | React framework |
| React | 18+ | UI library |
| TypeScript | 5.0+ | Type safety |
| Tailwind CSS | 3.3+ | Utility-first CSS |
| shadcn/ui | Latest | Component library |
| Lucide React | Latest | Icon library |
| Axios | 1.5+ | API client |
| next-pwa | 5.6+ | PWA support |
| date-fns | 2.30+ | Date utilities |

### Development Tools

| Tool | Purpose |
|------|---------|
| nodemon | Backend hot reload |
| ts-node | TypeScript execution |
| Jest | Testing framework |
| Playwright | E2E testing |
| Supertest | API testing |
| ESLint | Code linting |
| Prettier | Code formatting |

---

## Development Setup

### Prerequisites

- **Node.js:** 18.x or later
- **npm:** 9.x or later
- **MySQL:** 8.0 or later
- **Redis:** 6.x or later (or Memurai for Windows)
- **Git:** Latest version

### Initial Setup

#### 1. Clone Repository

```bash
git clone <repository-url>
cd School_App
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Important variables:
# - DATABASE_URL
# - JWT_SECRET
# - REDIS_HOST
# - MPESA credentials
# - SMS API credentials
```

**Environment Variables (.env):**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/school_db?connection_limit=20&pool_timeout=30"

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
ENABLE_CACHE=true
ENABLE_QUERY_CACHE=true

# MPesa Configuration (Daraja API)
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your-passkey
MPESA_CALLBACK_URL=http://localhost:5000/api/mpesa/callback
MPESA_ENVIRONMENT=sandbox  # or production

# SMS Configuration (Africa's Talking)
SMS_API_KEY=your-api-key
SMS_USERNAME=sandbox  # or your username
SMS_SENDER_ID=YOURSCHOOL

# File Storage
UPLOAD_DIR=./uploads
PDF_DIR=./pdfs
QRCODE_DIR=./qrcodes

# Performance Configuration
ENABLE_COMPRESSION=true
CACHE_TTL_SHORT=60
CACHE_TTL_MEDIUM=300
CACHE_TTL_LONG=1800
```

#### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

#### 4. Start Backend

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

Backend runs on: `http://localhost:5000`

#### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local
```

**Environment Variables (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME="ABC School"
```

#### 6. Start Frontend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Frontend runs on: `http://localhost:3000`

### Development Workflow

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Redis (if not running as service)
redis-server
```

---

## Database Design

### Entity Relationship Diagram (Key Tables)

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    users     │         │   students   │         │   classes    │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │         │ id (PK)      │
│ email        │◄───┐    │ admissionNo  │    ┌───►│ name         │
│ password     │    │    │ firstName    │    │    │ level        │
│ role         │    │    │ lastName     │    │    │ capacity     │
│ createdAt    │    │    │ classId (FK) ├────┘    │ teacherId    │
└──────────────┘    │    │ parentId (FK)├────┐    └──────────────┘
                    │    │ gender       │    │
                    │    │ dateOfBirth  │    │
                    │    └──────────────┘    │
                    │                        │
                    │    ┌──────────────┐    │
                    └────┤   parents    │◄───┘
                         ├──────────────┤
                         │ id (PK)      │
                         │ userId (FK)  │
                         │ firstName    │
                         │ lastName     │
                         │ phone        │
                         └──────────────┘

┌────────────────┐       ┌────────────────┐       ┌──────────────┐
│ fee_structures │       │  student_fees  │       │  payments    │
├────────────────┤       ├────────────────┤       ├──────────────┤
│ id (PK)        │◄──┐   │ id (PK)        │   ┌──►│ id (PK)      │
│ name           │   └───┤ feeStructureId │   │   │ studentId    │
│ amount         │       │ studentId (FK) ├───┤   │ amount       │
│ classId (FK)   │       │ amountPaid     │   │   │ method       │
│ term           │       │ balance        │   │   │ transId      │
│ dueDate        │       │ status         │   │   │ createdAt    │
└────────────────┘       └────────────────┘   │   └──────────────┘
                                               │
                         ┌────────────────┐    │
                         │mpesa_transactions   │
                         ├────────────────┤    │
                         │ id (PK)        │    │
                         │ checkoutReqId  │    │
                         │ merchantReqId  │    │
                         │ amount         │    │
                         │ phone          │    │
                         │ status         │    │
                         │ paymentId (FK) ├────┘
                         └────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  attendance  │         │    exams     │         │    marks     │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │◄────┐   │ id (PK)      │
│ studentId    │         │ name         │     └───┤ examId (FK)  │
│ classId      │         │ classId (FK) │         │ studentId    │
│ date         │         │ term         │         │ subject      │
│ status       │         │ academicYear │         │ marks        │
│ markedBy     │         │ examDate     │         │ grade        │
└──────────────┘         └──────────────┘         │ position     │
                                                   └──────────────┘
```

### Key Tables

#### users
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      Role     @default(TEACHER)
  firstName String?
  lastName  String?
  phone     String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([email])
  @@index([role])
}
```

#### students
```prisma
model Student {
  id            Int       @id @default(autoincrement())
  admissionNo   String    @unique
  firstName     String
  lastName      String
  middleName    String?
  gender        Gender
  dateOfBirth   DateTime
  classId       Int
  parentId      Int?
  photo         String?
  address       String?
  isActive      Boolean   @default(true)
  admissionDate DateTime  @default(now())
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  class         Class     @relation(fields: [classId], references: [id])
  parent        Parent?   @relation(fields: [parentId], references: [id])
  
  @@index([admissionNo])
  @@index([classId])
  @@index([parentId])
  @@index([isActive])
}
```

### Database Indexes

Critical indexes for performance:

```sql
-- Students
CREATE INDEX idx_students_admission ON students(admissionNo);
CREATE INDEX idx_students_class ON students(classId);
CREATE INDEX idx_students_parent ON students(parentId);
CREATE INDEX idx_students_active ON students(isActive);

-- Payments
CREATE INDEX idx_payments_student ON payments(studentId);
CREATE INDEX idx_payments_date ON payments(createdAt);
CREATE INDEX idx_payments_method ON payments(method);

-- Attendance
CREATE INDEX idx_attendance_student ON attendance(studentId);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_class ON attendance(classId);
CREATE INDEX idx_attendance_composite ON attendance(studentId, date);

-- Marks
CREATE INDEX idx_marks_exam ON marks(examId);
CREATE INDEX idx_marks_student ON marks(studentId);
CREATE INDEX idx_marks_composite ON marks(examId, studentId);

-- MPesa Transactions
CREATE INDEX idx_mpesa_checkout ON mpesa_transactions(checkoutRequestId);
CREATE INDEX idx_mpesa_merchant ON mpesa_transactions(merchantRequestId);
CREATE INDEX idx_mpesa_status ON mpesa_transactions(status);
```

---

## API Architecture

### RESTful Design Principles

#### Endpoint Structure

```
/api/{resource}/{id?}/{sub-resource?}/{action?}
```

**Examples:**
- `GET /api/students` - List students
- `GET /api/students/123` - Get student details
- `POST /api/students` - Create student
- `PUT /api/students/123` - Update student
- `DELETE /api/students/123` - Delete student
- `GET /api/students/123/fees` - Get student fees
- `POST /api/students/123/fees/pay` - Pay student fees

#### HTTP Methods

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resource(s) | Yes |
| POST | Create resource | No |
| PUT | Update entire resource | Yes |
| PATCH | Update partial resource | No |
| DELETE | Delete resource | Yes |

#### Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE with no response body |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource, constraint violation |
| 422 | Unprocessable Entity | Validation error (alternative to 400) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Server overloaded or down |

### API Response Format

#### Success Response

```typescript
{
  success: true,
  data: {...} | [...],
  message?: "Success message",
  meta?: {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5
  }
}
```

#### Error Response

```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "User-friendly error message",
    details?: [...],  // Validation errors
    stack?: "..."     // Only in development
  }
}
```

### Request Validation

Using Zod for runtime type checking:

```typescript
import { z } from 'zod';

// Define schema
const createStudentSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  dateOfBirth: z.string().datetime(),
  gender: z.enum(['MALE', 'FEMALE']),
  classId: z.number().int().positive(),
  parentId: z.number().int().positive().optional(),
});

// Validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors
          }
        });
      }
      next(error);
    }
  };
};

// Usage in route
router.post('/students',
  authenticate,
  authorize(['ADMIN', 'CLERK']),
  validateRequest(createStudentSchema),
  studentController.create
);
```

---

## Authentication & Authorization

### JWT Authentication

#### Token Structure

```typescript
interface JWTPayload {
  userId: number;
  email: string;
  role: Role;
  iat: number;  // Issued at
  exp: number;  // Expires at
}
```

#### Token Generation

```typescript
import jwt from 'jsonwebtoken';

export const generateToken = (user: User): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};
```

#### Authentication Middleware

```typescript
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Authentication required'
        }
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Attach user to request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      }
    });
  }
};
```

### Role-Based Access Control (RBAC)

#### Roles Hierarchy

```typescript
enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',      // Full system access
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',    // School-wide management
  ACCOUNTANT = 'ACCOUNTANT',        // Finance operations
  TEACHER = 'TEACHER',              // Academic operations
  PARENT = 'PARENT',                // View child info
  CLERK = 'CLERK',                  // Data entry
}
```

#### Permission Matrix

| Role | Students | Fees | Payments | Attendance | Exams | Users |
|------|----------|------|----------|------------|-------|-------|
| SUPER_ADMIN | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD |
| SCHOOL_ADMIN | CRUD | CRUD | CRUD | CRUD | CRUD | CRU |
| ACCOUNTANT | R | CRUD | CRUD | R | R | - |
| TEACHER | R | R | - | CRUD | CRUD | - |
| PARENT | R (own) | R (own) | C (own) | R (own) | R (own) | - |
| CLERK | CR | - | - | - | - | - |

#### Authorization Middleware

```typescript
export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }
    
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }
    
    next();
  };
};

// Usage
router.get('/students',
  authenticate,
  authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'CLERK']),
  studentController.list
);
```

---

## External Integrations

### MPesa Daraja API

#### Configuration

```typescript
interface MPesaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  callbackUrl: string;
  environment: 'sandbox' | 'production';
}

const mpesaConfig: MPesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  shortcode: process.env.MPESA_SHORTCODE!,
  passkey: process.env.MPESA_PASSKEY!,
  callbackUrl: process.env.MPESA_CALLBACK_URL!,
  environment: process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production'
};
```

#### STK Push Flow

```typescript
// 1. Generate Access Token
const getAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(
    `${config.consumerKey}:${config.consumerSecret}`
  ).toString('base64');
  
  const response = await axios.get(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`
      }
    }
  );
  
  return response.data.access_token;
};

// 2. Initiate STK Push
const initiateSTKPush = async (phone: string, amount: number) => {
  const token = await getAccessToken();
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(
    `${config.shortcode}${config.passkey}${timestamp}`
  ).toString('base64');
  
  const response = await axios.post(
    `${baseUrl}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,  // Customer phone
      PartyB: config.shortcode,
      PhoneNumber: phone,
      CallBackURL: config.callbackUrl,
      AccountReference: 'SCHOOL_FEES',
      TransactionDesc: 'School Fee Payment'
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  
  return response.data;
};

// 3. Handle Callback
router.post('/api/mpesa/callback', async (req, res) => {
  const { Body } = req.body;
  const { stkCallback } = Body;
  
  if (stkCallback.ResultCode === 0) {
    // Payment successful
    const payment = await processSuccessfulPayment(stkCallback);
    await sendSMSConfirmation(payment);
  } else {
    // Payment failed
    await handleFailedPayment(stkCallback);
  }
  
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
});
```

### Africa's Talking SMS API

#### Configuration

```typescript
import AfricasTalking from 'africas-talking';

const AT = AfricasTalking({
  apiKey: process.env.SMS_API_KEY!,
  username: process.env.SMS_USERNAME!
});

const sms = AT.SMS;
```

#### Sending SMS

```typescript
export const sendSMS = async (
  to: string | string[],
  message: string
): Promise<void> => {
  try {
    const response = await sms.send({
      to: Array.isArray(to) ? to : [to],
      message,
      from: process.env.SMS_SENDER_ID
    });
    
    // Log SMS
    await prisma.smsLog.create({
      data: {
        recipients: Array.isArray(to) ? to.join(',') : to,
        message,
        status: 'SENT',
        response: JSON.stringify(response)
      }
    });
    
    return response;
  } catch (error) {
    // Log failure
    await prisma.smsLog.create({
      data: {
        recipients: Array.isArray(to) ? to.join(',') : to,
        message,
        status: 'FAILED',
        error: error.message
      }
    });
    
    throw error;
  }
};
```

---

## Performance Optimization

### Caching Strategy

#### Redis Cache Service

```typescript
import Redis from 'ioredis';

class CacheService {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });
  }
  
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }
  
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, data);
    } else {
      await this.redis.set(key, data);
    }
  }
  
  async del(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
  
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    
    // Fetch and cache
    const data = await fetcher();
    await this.set(key, data, ttl);
    return data;
  }
}

export const cacheService = new CacheService();
```

#### Cache Middleware

```typescript
export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await cacheService.get(key);
      if (cached) {
        return res.json(cached);
      }
      
      // Override res.json to cache response
      const originalJson = res.json.bind(res);
      res.json = (data: any) => {
        cacheService.set(key, data, ttl);
        return originalJson(data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

// Usage
router.get('/students',
  authenticate,
  cacheMiddleware(60),  // Cache for 60 seconds
  studentController.list
);
```

### Database Query Optimization

#### Selective Field Retrieval

```typescript
// Bad: Fetches all fields
const students = await prisma.student.findMany();

// Good: Fetch only needed fields
const students = await prisma.student.findMany({
  select: {
    id: true,
    admissionNo: true,
    firstName: true,
    lastName: true,
    class: {
      select: {
        name: true
      }
    }
  }
});
```

#### Pagination

```typescript
export const paginateResults = async (
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    prisma.student.findMany({
      skip,
      take: limit
    }),
    prisma.student.count()
  ]);
  
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
```

#### Parallel Queries

```typescript
// Bad: Sequential queries (slow)
const students = await prisma.student.count();
const classes = await prisma.class.count();
const teachers = await prisma.user.count({ where: { role: 'TEACHER' } });

// Good: Parallel queries (fast)
const [students, classes, teachers] = await Promise.all([
  prisma.student.count(),
  prisma.class.count(),
  prisma.user.count({ where: { role: 'TEACHER' } })
]);
```

---

## Security Implementation

### Input Sanitization

```typescript
import validator from 'validator';

export const sanitizeInput = (input: string): string => {
  return validator.escape(validator.trim(input));
};
```

### SQL Injection Prevention

Prisma automatically prevents SQL injection through parameterized queries:

```typescript
// Safe: Prisma uses parameterized queries
const student = await prisma.student.findUnique({
  where: { admissionNo: userInput }
});

// Never do raw SQL with user input:
// await prisma.$queryRaw`SELECT * FROM students WHERE admissionNo = ${userInput}`; // UNSAFE!

// If you must use raw SQL, use parameters:
await prisma.$queryRaw`SELECT * FROM students WHERE admissionNo = ${prisma.raw(userInput)}`;
```

### XSS Protection

```typescript
// Helmet middleware for security headers
import helmet from 'helmet';
app.use(helmet());

// Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  })
);
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,  // 1000 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints rate limit
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // Only 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Apply limiters
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

### Password Security

```typescript
import bcrypt from 'bcrypt';

// Hashing
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verification
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

---

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

## Monitoring & Maintenance

### Health Check Endpoint

```typescript
router.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'Unknown',
    redis: 'Unknown'
  };
  
  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.database = 'Connected';
  } catch (error) {
    health.database = 'Disconnected';
    health.status = 'ERROR';
  }
  
  // Check Redis
  try {
    await cacheService.redis.ping();
    health.redis = 'Connected';
  } catch (error) {
    health.redis = 'Disconnected';
  }
  
  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Performance Monitoring

```typescript
export const performanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests (>1000ms)
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        statusCode: res.statusCode
      });
    }
    
    // Store metrics
    res.setHeader('X-Response-Time', `${duration}ms`);
  });
  
  next();
};
```

---

## Troubleshooting

### Common Issues

#### Database Connection Issues

**Problem:** `P1001: Can't reach database server`

**Solutions:**
1. Verify MySQL is running
2. Check DATABASE_URL in .env
3. Verify network connectivity
4. Check firewall settings
5. Verify MySQL user permissions

#### Redis Connection Issues

**Problem:** Redis connection refused

**Solutions:**
1. Verify Redis is running: `redis-cli ping`
2. Check REDIS_HOST and REDIS_PORT in .env
3. Verify Redis password if configured
4. Check firewall settings

#### MPesa Integration Issues

**Problem:** STK Push not received

**Solutions:**
1. Verify phone number format (254XXXXXXXXX)
2. Check MPesa credentials in .env
3. Verify callback URL is publicly accessible
4. Check MPesa dashboard for errors
5. Ensure phone has network coverage

#### SMS Not Sending

**Problem:** SMS delivery failures

**Solutions:**
1. Check Africa's Talking account balance
2. Verify API credentials in .env
3. Check phone number format
4. Review SMS logs for error messages
5. Verify sender ID is registered

### Debugging

#### Enable Debug Logging

```bash
# Backend
LOG_LEVEL=debug npm run dev

# Prisma
DEBUG=prisma:* npm run dev
```

#### Check Application Logs

```bash
# View logs
tail -f combined.log
tail -f error.log

# Search logs
grep "ERROR" combined.log
```

#### Database Debugging

```bash
# Open Prisma Studio
npx prisma studio

# Run SQL query
npx prisma db execute --stdin < query.sql
```

---

## Additional Resources

- **API Reference:** [API_REFERENCE.md](./API_REFERENCE.md)
- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Admin Guide:** [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
- **User Manual:** [USER_MANUAL.md](./USER_MANUAL.md)
- **Testing Guide:** [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

## Contributing

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

### Testing

- Write unit tests for business logic
- Add integration tests for API endpoints
- Run tests before committing: `npm test`
- Maintain test coverage >80%

### Pull Request Process

1. Create feature branch
2. Make changes
3. Write tests
4. Update documentation
5. Submit PR
6. Address review comments
7. Merge after approval

---

**Last Updated:** November 19, 2025  
**Version:** 1.0  
**Maintainers:** Development Team

