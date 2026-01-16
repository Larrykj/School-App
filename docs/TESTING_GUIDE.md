# Testing Guide - School Management System

## Overview
This document provides comprehensive testing guidelines for the School Management System.

---

## Test Structure

### Backend Tests (`backend/src/__tests__/`)
```
__tests__/
├── setup.ts              # Test configuration
├── services/             # Unit tests for services
│   ├── feeService.test.ts
│   ├── analyticsService.test.ts
│   └── smsService.test.ts
└── integration/          # API integration tests
    ├── auth.test.ts
    ├── students.test.ts
    └── payments.test.ts
```

### Frontend Tests (`frontend/e2e/`)
```
e2e/
├── auth.spec.ts
├── student-management.spec.ts
├── fee-management.spec.ts
└── analytics.spec.ts
```

---

## Running Tests

### Backend Unit Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm run test:unit

# Watch mode
npm run test:watch
```

### Frontend E2E Tests
```bash
cd frontend

# Run all E2E tests
npx playwright test

# Run in UI mode
npx playwright test --ui

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

---

## Test Coverage Goals

| Component | Target Coverage | Current |
|-----------|----------------|---------|
| Backend Services | 80%+ | TBD |
| API Endpoints | 70%+ | TBD |
| Frontend Components | 60%+ | TBD |
| Critical Paths | 100% | TBD |

---

## Manual Testing Checklist

### 1. Authentication & Authorization ✅
- [ ] Admin login works
- [ ] Teacher login works
- [ ] Parent login works
- [ ] Invalid credentials rejected
- [ ] Token expiration handled
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Role-based access enforced

### 2. Student Management ✅
- [ ] Create new student
- [ ] Edit student details
- [ ] Assign to class
- [ ] Assign to dormitory
- [ ] Assign to transport
- [ ] Generate ID card with QR code
- [ ] View student profile
- [ ] Search functionality
- [ ] Bulk import (Excel)

### 3. Fee Management ✅
- [ ] Create fee structure
- [ ] Assign fees to students
- [ ] View fee balance
- [ ] Auto-calculation works
- [ ] Overpayment carryover
- [ ] Fee deadlines tracked
- [ ] Class-wide reports
- [ ] Excel export works

### 4. Payment Processing ✅
- [ ] Cash payment processing
- [ ] Bank payment recording
- [ ] Cheque payment handling
- [ ] Payment history viewing
- [ ] Receipt generation (PDF)
- [ ] Receipt download

### 5. MPesa Integration ✅
- [ ] STK Push initiates correctly
- [ ] Callback URL accessible
- [ ] Transaction status updates
- [ ] Auto-reconciliation works
- [ ] Failed transactions handled
- [ ] SMS confirmation sent
- [ ] Sandbox testing complete
- [ ] Production credentials configured

### 6. SMS Communication ✅
- [ ] Single SMS sending
- [ ] Bulk SMS to class
- [ ] Bulk SMS to all parents
- [ ] Fee reminders send
- [ ] Payment confirmations
- [ ] SMS logs tracked
- [ ] Failed SMS handled
- [ ] SMS statistics accurate

### 7. Attendance Tracking ✅
- [ ] Mark attendance (class)
- [ ] Edit attendance
- [ ] View attendance history
- [ ] Attendance statistics
- [ ] Offline marking works
- [ ] Sync when online
- [ ] Low attendance alerts

### 8. Exam & Report Cards ✅
- [ ] Create exam
- [ ] Enter marks
- [ ] Edit marks
- [ ] Generate report card
- [ ] Download report card (PDF)
- [ ] Grade calculation correct
- [ ] Term-wise tracking

### 9. Analytics Dashboard ✅
- [ ] Fee analytics load
- [ ] Performance analytics accurate
- [ ] Attendance trends display
- [ ] Charts render correctly
- [ ] Filters work
- [ ] Revenue forecast shown
- [ ] Defaulters list accurate

### 10. PWA & Offline Mode ✅
- [ ] Service worker registers
- [ ] "Add to Home Screen" works
- [ ] Offline attendance saves
- [ ] Auto-sync on reconnect
- [ ] IndexedDB stores data
- [ ] Works on mobile devices

---

## Security Testing Checklist

### Authentication & Authorization
- [ ] JWT tokens properly validated
- [ ] Passwords hashed (bcrypt)
- [ ] SQL injection prevented (Prisma)
- [ ] XSS protection enabled
- [ ] CSRF protection (if applicable)
- [ ] Rate limiting implemented
- [ ] Brute force protection
- [ ] Session management secure

### API Security
- [ ] All endpoints authenticated
- [ ] RBAC properly enforced
- [ ] Input validation on all endpoints
- [ ] Sensitive data not exposed
- [ ] Error messages don't leak info
- [ ] File upload validation
- [ ] CORS configured correctly

### Data Protection
- [ ] Sensitive data encrypted
- [ ] Database credentials secured
- [ ] API keys not in code
- [ ] Environment variables used
- [ ] Backup strategy in place
- [ ] GDPR compliance considered

---

## Performance Testing

### Load Testing Scenarios
1. **Concurrent Users:** 100 simultaneous logins
2. **Database Queries:** 1000 student records retrieval
3. **Payment Processing:** 50 concurrent payments
4. **Analytics:** Dashboard load with large dataset
5. **File Generation:** 100 PDF receipts

### Performance Targets
- API Response Time: < 200ms
- Page Load Time: < 1.5s
- Time to Interactive: < 3s
- Database Queries: < 100ms
- File Generation: < 2s

### Tools
- Apache JMeter
- k6
- Lighthouse (frontend)
- Chrome DevTools Performance

---

## Accessibility Testing

### WCAG 2.1 AA Compliance
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Form labels present
- [ ] Alt text for images
- [ ] ARIA labels where needed
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Tools
- Lighthouse Accessibility Audit
- axe DevTools
- WAVE Browser Extension
- NVDA Screen Reader

---

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Chrome (Android)
- Mobile Safari (iOS)

### Testing Matrix
| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| Login | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Charts | ✅ | ✅ | ✅ | ✅ | ✅ |
| PWA | ✅ | ✅ | ✅ | ✅ | ✅ |
| Offline | ✅ | ✅ | ⚠️ | ✅ | ✅ |

---

## Bug Tracking

### Bug Priority Levels
1. **Critical:** System crashes, data loss, security vulnerabilities
2. **High:** Major features broken, significant UX issues
3. **Medium:** Minor features broken, cosmetic issues
4. **Low:** Enhancement requests, nice-to-have

### Bug Report Template
```markdown
## Bug Title
[Clear, concise title]

## Priority
Critical / High / Medium / Low

## Environment
- OS: [Windows/Mac/Linux]
- Browser: [Chrome 120]
- Device: [Desktop/Mobile]

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[If applicable]

## Additional Context
[Any other relevant information]
```

---

## Test Data

### Test Users
```
Admin:
- Email: admin@school.com
- Password: admin123

Teacher:
- Email: teacher@school.com
- Password: teacher123

Parent:
- Email: parent@school.com
- Password: parent123
```

### Test MPesa Numbers (Sandbox)
```
Success: 254708374149
Insufficient Funds: 254708374150
Invalid Account: 254708374151
```

---

## Continuous Integration

### GitHub Actions Workflow (Example)
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd backend && npm install
      - name: Run tests
        run: cd backend && npm test
        
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Install Playwright
        run: cd frontend && npx playwright install
      - name: Run E2E tests
        run: cd frontend && npx playwright test
```

---

## Test Reports

### Generating Reports
```bash
# Backend coverage report
cd backend
npm run test:coverage
# Open: backend/coverage/lcov-report/index.html

# Playwright HTML report
cd frontend
npx playwright test --reporter=html
# Open: frontend/playwright-report/index.html
```

---

## Best Practices

1. **Write tests first** (TDD when possible)
2. **Test behavior, not implementation**
3. **Keep tests isolated** (no dependencies between tests)
4. **Use descriptive test names**
5. **Mock external dependencies** (APIs, databases in unit tests)
6. **Test edge cases** and error scenarios
7. **Maintain test data** separate from production
8. **Run tests before commits**
9. **Keep tests fast** (unit tests < 1s, integration < 5s)
10. **Update tests** when features change

---

## Next Steps

1. Complete all manual testing checklist items
2. Achieve 80%+ test coverage
3. Set up CI/CD pipeline
4. Perform security audit
5. Conduct user acceptance testing (UAT)
6. Load testing with production-like data
7. Fix all critical and high priority bugs
8. Document known issues

---

**Last Updated:** November 19, 2024
**Version:** 1.0.0

