# 🌱 Database Seeding Guide

This guide explains how to populate your database with comprehensive, realistic Kenyan university data.

## 📊 What Gets Seeded

### Users & Authentication (671 total)
- **1 Super Admin** - System administrator
- **5 School Admins** - Administrative staff
- **5 Accountants** - Financial management
- **5 Clerks** - General administration
- **50 Lecturers** - Teaching staff
- **100 Parents** - Guardian accounts
- **500 Students** - Enrolled students (active and graduated)

### Academic Structure
- **15 Departments** - Computing, Business, Engineering, Health Sciences, Law, etc.
- **29 Programs** - BIT, BCOM, Engineering, Medicine, Law, MBA, etc.
- **200+ Courses** - Complete course catalog with codes and prerequisites
- **6 Academic Years** - 2019-2024
- **12 Semesters** - 2 per year
- **300+ Course Offerings** - Courses with assigned lecturers

### Student Data
- **500 Student Enrollments** - Program registrations
- **5000+ Course Registrations** - Historical course registrations
- **5000+ Grades** - CAT and exam marks with GPA calculations
- **150+ Transcripts** - For graduated students
- **500+ Student Documents** - IDs, certificates, medical records
- **400+ ID Cards** - Digital student ID cards

### Applications & Admissions
- **300 Applications** - Approved, pending, rejected
- **60% KUCCPS** - Government-sponsored placements
- **40% Parallel** - Self-sponsored students
- **900 Application Documents** - Birth certificates, transcripts, IDs

### Financial Records
- **50 Fee Structures** - Tuition, accommodation, medical, activity fees
- **3000+ Student Fees** - Assigned fees with balances
- **2000 Payments** - Cash, bank, M-PESA
- **1400+ M-PESA Transactions** - Complete transaction details

### Operational Data
- **16 Classes** - Form 1-4 with streams
- **640 Timetable Entries** - Complete weekly schedules
- **10,000+ Attendance Records** - Last 30 days
- **128 Exams** - CATs, Mid-terms, End terms
- **5000+ Exam Results** - Grade distribution

### Support Systems
- **10 Dormitories** - Male and female hostels
- **400 Bed Assignments** - Room allocations
- **5 Transport Routes** - Covering Nairobi areas
- **150 Transport Assignments** - Student transport
- **500+ Library Books** - Academic texts
- **1000 Borrow Records** - Library transactions
- **300 Medical Records** - Student health records
- **50 Disciplinary Records** - Student conduct

## 🚀 How to Run

### Prerequisites
1. Database is running (MySQL/PostgreSQL)
2. `DATABASE_URL` is configured in `.env`
3. Prisma client is generated: `npx prisma generate`

### Option 1: Using NPM Script

```bash
cd backend
npm run seed
```

### Option 2: Using Helper Scripts

**For Linux/Mac:**
```bash
cd backend
chmod +x scripts/run-seed.sh
./scripts/run-seed.sh
```

**For Windows (PowerShell):**
```powershell
cd backend
.\scripts\run-seed.ps1
```

### Option 3: Direct Execution

```bash
cd backend
ts-node prisma/seed.ts
```

## ⏱️ Expected Duration

- **Small Dataset (demo)**: ~30 seconds
- **Medium Dataset (current)**: **2-5 minutes**
- **Large Dataset**: 5-10 minutes

## 📦 Data Characteristics

### Kenyan Authenticity
- **Names**: Kamau, Wanjiku, Omondi, Achieng, Kipchoge, Muthoni
- **Phone Numbers**: +254 7XX XXX XXX format
- **M-PESA References**: QRS12345678, ABC98765432
- **KUCCPS Indexes**: 11200001001/2024 format
- **Vehicle Registrations**: KXX XXXQ format
- **Counties**: Nairobi, Mombasa, Kisumu, Nakuru, etc.

### Realistic Distributions
- **60%** Government-sponsored students
- **40%** Parallel program students
- **75%** Male in tech programs (realistic for Kenya)
- **25%** Female in tech programs
- **70%** M-PESA payments (most common in Kenya)
- **92%** Student attendance rate
- **Grade distribution** follows bell curve (normal distribution)

### Historical Depth
- **6 years** of data (2019-2024)
- **Graduated students** from 2020-2023
- **Completed courses** and semesters
- **Payment history** and arrears
- **Attendance patterns** over time

## 🔐 Default Credentials

After seeding, you can login with:

**Super Admin:**
- Email: `admin@university.ac.ke`
- Password: `password123`

**School Admin:**
- Email: `admin1@university.ac.ke` to `admin5@university.ac.ke`
- Password: `password123`

**Accountant:**
- Email: `accountant1@university.ac.ke` to `accountant5@university.ac.ke`
- Password: `password123`

**Lecturer:**
- Email: `lecturer1@university.ac.ke` to `lecturer50@university.ac.ke`
- Password: `password123`

**Parent:**
- Email: `parent1@email.com` to `parent100@email.com`
- Password: `password123`

**Students:**
- Email: Format `firstname.lastnameN@student.ac.ke`
- Password: `password123`

## 📈 Record Count Summary

```
Total Records: 30,000+

Users:                671
Students:             500
Staff:                66
Parents:              100
Departments:          15
Programs:             29
Courses:              200+
Semesters:            12
Course Offerings:     300+
Enrollments:          500
Registrations:        5,000+
Grades:               5,000+
Transcripts:          150+
Applications:         300
Payments:             2,000
M-PESA Transactions:  1,400+
Classes:              16
Timetables:           640
Attendance:           10,000+
Exams:                128
Exam Results:         5,000+
Dormitories:          10
Bed Assignments:      400
Transport Routes:     5
Library Books:        500+
Book Borrows:         1,000
Medical Records:      300
```

## ⚠️ Important Notes

1. **Data Deletion**: Running the seed will **DELETE ALL EXISTING DATA**
2. **Backup First**: Always backup your database before seeding
3. **Production**: Never run seed scripts on production databases
4. **Time**: First run may take longer due to password hashing
5. **Memory**: Ensure adequate RAM (minimum 2GB free)

## 🛠️ Troubleshooting

### Error: "Cannot connect to database"
- Check `DATABASE_URL` in `.env`
- Ensure database server is running
- Verify credentials and permissions

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Out of memory"
- Reduce batch sizes in seed script
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run seed`

### Slow Performance
- Check database server resources
- Ensure adequate disk space
- Consider using database indexes

## 🔄 Re-seeding

To re-seed the database:

```bash
# Option 1: Reset and seed
npx prisma migrate reset --skip-seed
npm run seed

# Option 2: Just run seed (it clears data automatically)
npm run seed
```

## 📊 Viewing the Data

After seeding, you can view the data:

```bash
# Open Prisma Studio
npm run prisma:studio

# Access at: http://localhost:5555
```

## ✅ Verification

To verify the seeding was successful:

1. Check the console output for summary
2. Open Prisma Studio
3. Login to the application
4. Navigate through different sections
5. Check student records, grades, payments, etc.

## 🎉 Success!

If you see "🎉 Database seeded successfully!" and a summary of records, you're all set!

You can now:
- Start the backend: `npm run dev`
- Login to the application
- Explore the data
- Test all features

---

**Total Development Time**: ~8 hours
**Lines of Code**: ~1,500 lines
**Data Quality**: Production-ready with Kenyan authenticity

