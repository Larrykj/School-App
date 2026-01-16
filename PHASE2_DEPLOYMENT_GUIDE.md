# 🚀 Phase 2: Deployment Guide

## ⚠️ IMPORTANT: Stop Backend Server First!

Before running migration, **stop your backend server**:
- Press `Ctrl+C` in the terminal running `npm run dev`

---

## 📋 DEPLOYMENT STEPS

### Step 1: Stop Backend Server
```bash
# In the terminal running the backend:
Ctrl+C
```

### Step 2: Run Migration
```bash
cd backend
npx prisma migrate dev --name add_student_management_system
```

**When prompted:** Press `y` to accept the migration

**What it does:**
- Creates 6 new tables (applications, application_documents, student_documents, student_medical_records, disciplinary_records, student_id_cards)
- Adds new columns to students table (email, county, subCounty, photoUrl, bloodGroup, disabilities, medicalConditions, emergencyContactName, emergencyContactPhone, kuccpsIndex, placementType, placementYear)
- Adds applications relation to academic_programs table
- Creates indexes for performance

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

### Step 4: Build Backend
```bash
npm run build
```

### Step 5: Restart Backend
```bash
npm run dev
```

---

## 🧪 TESTING THE API

### Test 1: Check Server Health
```bash
GET http://localhost:5000/health
```

**Expected:** `{"status": "OK"}`

### Test 2: Create Application
```bash
POST http://localhost:5000/api/applications
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2000-01-15",
  "gender": "Male",
  "email": "john.doe@example.com",
  "phone": "+254712345678",
  "county": "Nairobi",
  "subCounty": "Westlands",
  "address": "123 Main Street",
  "programId": "YOUR_PROGRAM_ID_HERE",
  "intake": "September 2024",
  "guardianName": "Jane Doe",
  "guardianPhone": "+254787654321",
  "guardianRelationship": "Mother",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+254787654321",
  "emergencyContactRelation": "Mother"
}
```

**Expected Response:**
```json
{
  "message": "Application created successfully",
  "application": {
    "id": "uuid",
    "applicationNumber": "APP2024XXXX",
    "status": "DRAFT",
    ...
  }
}
```

### Test 3: Get All Applications
```bash
GET http://localhost:5000/api/applications
Authorization: Bearer YOUR_TOKEN
```

### Test 4: Get Statistics
```bash
GET http://localhost:5000/api/applications/statistics
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "statistics": {
    "total": 1,
    "draft": 1,
    "submitted": 0,
    "underReview": 0,
    "approved": 0,
    "rejected": 0,
    "waitlisted": 0
  }
}
```

### Test 5: Submit Application
```bash
POST http://localhost:5000/api/applications/{APPLICATION_ID}/submit
Authorization: Bearer YOUR_TOKEN
```

**Note:** This will fail if required documents aren't uploaded (by design)

### Test 6: Approve Application
```bash
PUT http://localhost:5000/api/applications/{APPLICATION_ID}/approve
Authorization: Bearer YOUR_TOKEN
```

**Expected:** Creates admission number like `BIT/2024/001`

---

## 🔧 TROUBLESHOOTING

### Error: "EPERM: operation not permitted"
**Solution:** Stop the backend server first with `Ctrl+C`

### Error: "Unique constraint failed on kuccpsIndex"
**Solution:** This means you have duplicate KUCCPS indices in your database. Either:
1. Clean up duplicates manually
2. Make the field nullable temporarily
3. Start with a fresh database

### Error: "Application not found"
**Solution:** Make sure you're using the correct application ID from the create response

### Error: "Missing required documents"
**Solution:** This is expected - document upload system is Phase 2 Part 2

---

## 📊 DATABASE VERIFICATION

After migration, verify tables exist:

```sql
-- Connect to MySQL
mysql -u root -p

-- Use your database
USE school_db;

-- Check new tables
SHOW TABLES LIKE '%application%';
SHOW TABLES LIKE '%student_%';

-- View application structure
DESCRIBE applications;

-- Check if students table was updated
DESCRIBE students;
```

**Expected Tables:**
- applications
- application_documents
- student_documents
- student_medical_records
- disciplinary_records
- student_id_cards

**Expected New Columns in students:**
- email
- county
- subCounty
- photoUrl
- bloodGroup
- disabilities
- medicalConditions
- emergencyContactName
- emergencyContactPhone
- kuccpsIndex (unique)
- placementType
- placementYear

---

## 🎯 WHAT'S WORKING NOW

After successful deployment:

✅ **Create Applications** - Students can apply online  
✅ **List Applications** - View all applications with filters  
✅ **Application Workflow** - Submit, Review, Approve, Reject  
✅ **Automatic Numbers** - Application & Admission numbers  
✅ **Statistics** - Dashboard-ready statistics  
✅ **KUCCPS Ready** - Fields for government placements  

---

## 🚀 NEXT: BUILD FRONTEND

While backend is ready, we'll build:

1. **Online Application Form** (multi-step wizard)
2. **Admin Application Dashboard**
3. **Application Review Interface**
4. **Statistics Dashboard**

---

## 📝 MIGRATION NOTES

**What Changed:**
- 6 new tables created
- Student model enhanced with 11 new fields
- ApplicationStatus enum added (6 values)
- DocumentType enum added (8 types)
- Relations established
- Indexes created for performance

**Safe to Run:**
- ✅ No data loss
- ✅ Existing records preserved
- ✅ Only adds new tables/columns
- ✅ Nullable fields (won't break existing data)

**Performance Impact:**
- Minimal - only adds indexes
- New tables are empty initially
- No impact on existing features

---

## 🎊 YOU'RE READY!

Once you complete these steps:
1. Stop backend
2. Run migration
3. Generate Prisma
4. Build & restart

Your system will have a **complete student admission system**! 🎓

---

**Questions?** Check the logs or ask for help! 👍

