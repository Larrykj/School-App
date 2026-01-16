# 🌱 How to Seed Your Database

## Quick Start (5 Minutes)

### Step 1: Make Sure Backend is NOT Running
Stop your backend server if it's running (Ctrl+C in the backend terminal).

### Step 2: Run the Seed

**Option A - Simple (Windows PowerShell):**
```powershell
cd backend
npm run seed
```

**Option B - With Helper Script (Windows):**
```powershell
cd backend
.\scripts\run-seed.ps1
```

**Option C - Unix/Linux/Mac:**
```bash
cd backend
chmod +x scripts/run-seed.sh
./scripts/run-seed.sh
```

### Step 3: Wait (2-5 minutes)
The script will:
1. Clear existing data
2. Create 671 users
3. Generate 30,000+ records
4. Show progress updates
5. Display final summary

### Step 4: Verify Success
You'll see:
```
✅ All phases complete!
Seeding complete! 🎉

📊 SEEDING SUMMARY:
===================
Total Users: 671
Students: 500
...
⏱️  Total time: XXXs
🎉 Database seeded successfully!
```

---

## 🔐 Login Credentials (After Seeding)

**Super Admin:**
- Email: `admin@university.ac.ke`
- Password: `password123`

**Lecturers:**
- Email: `lecturer1@university.ac.ke` to `lecturer50@university.ac.ke`
- Password: `password123`

**Accountants:**
- Email: `accountant1@university.ac.ke` to `accountant5@university.ac.ke`
- Password: `password123`

**Students:**
- Email: `firstname.lastnameN@student.ac.ke` (check console output for examples)
- Password: `password123`

---

## 📊 What Gets Created

### 30,000+ Records Including:
- **671 Users** (admins, lecturers, students, parents)
- **500 Students** with complete profiles
- **15 Departments** and **29 Programs**
- **200+ Courses** with prerequisites
- **5,000+ Course Registrations**
- **5,000+ Grades** with GPA calculations
- **300 Applications** (approved, pending, rejected)
- **2,000 Payments** (70% M-PESA)
- **10,000+ Attendance Records**
- **640 Timetable Entries**
- **128 Exams** with **5,000+ Results**
- **10 Dormitories** with **400 Bed Assignments**
- **500+ Library Books** with **1,000 Borrows**
- And much more!

### All Data is Kenyan-Authentic:
- Real Kenyan names (Kamau, Wanjiku, Omondi, etc.)
- +254 phone numbers
- M-PESA transaction references
- KUCCPS indexes
- Kenyan counties and sub-counties
- Realistic distributions (60% govt, 40% parallel)

---

## 🔄 Re-seeding

To clear and re-seed the database:
```bash
cd backend
npm run seed
```
(It automatically clears existing data first)

---

## 🛠️ Troubleshooting

### Error: "Cannot connect to database"
✅ **Fix:**
1. Check `backend/.env` has correct `DATABASE_URL`
2. Make sure MySQL/PostgreSQL is running
3. Test connection: `npm run prisma:studio`

### Error: "Prisma Client not generated"
✅ **Fix:**
```bash
cd backend
npx prisma generate
```

### Error: "Out of memory"
✅ **Fix:**
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run seed
```

### Seeding is slow
✅ **Normal:** First run takes 2-5 minutes due to password hashing

### Want to view the data?
✅ **Use Prisma Studio:**
```bash
cd backend
npm run prisma:studio
```
Open: http://localhost:5555

---

## ✅ Next Steps

After seeding:

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Login:**
   - Go to http://localhost:3000
   - Email: `admin@university.ac.ke`
   - Password: `password123`

4. **Explore:**
   - View students
   - Check grades
   - See payments
   - Review applications
   - Manage courses
   - Everything has data!

---

## 📚 More Information

- **Detailed Guide:** `backend/prisma/SEEDING_GUIDE.md`
- **Implementation Details:** `SEED_IMPLEMENTATION_COMPLETE.md`
- **Seed Script:** `backend/prisma/seed.ts`

---

## 🎉 You're Done!

Your database is now full of realistic data. Time to test all features!

**Need help?** Check the troubleshooting section or the detailed guide.

**Happy Testing!** 🚀

