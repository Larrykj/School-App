# School Management System - User Manual

**Version:** 1.0  
**Last Updated:** November 19, 2024

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles](#user-roles)
4. [Core Features](#core-features)
5. [Module Guides](#module-guides)
6. [Troubleshooting](#troubleshooting)
7. [Support](#support)

---

## Introduction

Welcome to the School Management System! This comprehensive platform helps schools manage students, fees, attendance, exams, and much more in one centralized location.

### Key Benefits
- 📊 Real-time analytics and reporting
- 💰 Automated fee tracking and MPesa integration
- 📱 Mobile-friendly design (works on any device)
- 🔔 Automated SMS notifications
- 📄 Instant receipt and report card generation
- 🚌 Transport and hostel management
- 📚 Library and inventory tracking

---

## Getting Started

### System Requirements
- **Browser:** Chrome, Firefox, Safari, or Edge (latest version)
- **Internet:** Stable internet connection (offline mode available for attendance)
- **Screen:** Minimum 1024x768 resolution (mobile responsive)

### First Login
1. Navigate to: `http://your-school-domain.com`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to your role-specific dashboard

### Password Reset
1. Click "Forgot Password?" on login page
2. Enter your registered email
3. Check email for reset link
4. Create new password
5. Login with new credentials

---

## User Roles

### 1. Admin 👨‍💼
**Full system access**
- Manage all users, students, and staff
- Configure fee structures
- View all reports and analytics
- Manage system settings

### 2. Teacher 👨‍🏫
**Academic management**
- Mark attendance
- Enter exam marks
- View student performance
- Generate report cards
- Access class timetable

### 3. Parent 👪
**Student monitoring**
- View children's attendance
- Check fee balance and payment history
- View exam results and report cards
- Receive SMS notifications
- Track transport/hostel information

### 4. Accountant 💼
**Financial management**
- Record payments (Cash, MPesa, Bank)
- Generate fee reports
- View defaulters list
- Export Excel reports
- Send fee reminders

---

## Core Features

### Dashboard Overview
Every user sees a personalized dashboard with:
- Quick stats and KPIs
- Recent activities
- Pending actions
- Important notifications

### Navigation
- **Sidebar Menu:** Main navigation (collapses on mobile)
- **Search Bar:** Quick search for students, classes, etc.
- **Profile Menu:** Access settings and logout

---

## Module Guides

### 📊 Fee Management

#### Adding a Fee Structure
1. Go to **Fees → Fee Structures**
2. Click "Add Fee Structure"
3. Fill in:
   - Name (e.g., "Term 1 Fees 2024")
   - Amount
   - Class/Category
   - Due Date
4. Click "Save"

#### Recording a Payment
1. Go to **Payments → New Payment**
2. Select student
3. Choose payment mode:
   - **Cash:** Enter amount, generate receipt
   - **MPesa:** Enter phone number, initiate STK Push
   - **Bank:** Upload deposit slip
4. Assign to fee items
5. Save and print receipt

#### Fee Reports
- **Defaulters:** Students with overdue fees
- **Collection Reports:** Daily/monthly collection summaries
- **Forecasts:** Revenue projections
- **Excel Export:** Download for further analysis

---

### 👨‍🎓 Student Management

#### Admitting a New Student
1. Go to **Students → Add Student**
2. Fill in required fields:
   - Admission Number (auto-generated)
   - Personal Information
   - Parent/Guardian Details
   - Medical Information (if any)
3. Assign to:
   - Class
   - Dormitory (if boarding)
   - Transport Route (if using school transport)
4. Click "Save"

#### Generating Student ID Cards
1. Go to **Students → [Select Student] → ID Card**
2. Review information
3. Click "Generate ID Card"
4. Print or download

---

### ✅ Attendance Management

#### Marking Daily Attendance
1. Go to **Attendance → Mark Attendance**
2. Select:
   - Date
   - Class
3. Mark each student as:
   - ✅ Present
   - ❌ Absent
   - 🏥 Sick
   - ✈️ Excused
4. Click "Submit"

**Offline Mode:**
- Attendance is saved locally if offline
- Auto-syncs when connection restored
- Check sync status in top-right corner

#### Viewing Attendance Reports
- Individual student attendance history
- Class-wide attendance summary
- Absent student alerts
- Attendance patterns and trends

---

### 📝 Exam & Results Management

#### Creating an Exam
1. Go to **Exams → Create Exam**
2. Fill in:
   - Exam Name (e.g., "Mid-Term 1 2024")
   - Class
   - Academic Year & Term
   - Date
3. Add subjects and max marks
4. Click "Create"

#### Entering Marks
1. Go to **Exams → [Select Exam] → Enter Marks**
2. Select subject
3. Enter marks for each student
4. System auto-calculates:
   - Grades
   - Total marks
   - Averages
5. Click "Save Marks"

#### Generating Report Cards
1. Go to **Exams → [Select Exam] → Report Cards**
2. Select students (individual or bulk)
3. Click "Generate Report Cards"
4. Download PDFs
5. Optional: Auto-send to parents via SMS/Email

---

### 📱 SMS Communication

#### Sending Individual SMS
1. Go to **SMS → Send SMS**
2. Select recipient (parent/student)
3. Type message
4. Click "Send"

#### Sending Bulk SMS
1. Go to **SMS → Bulk SMS**
2. Select recipients:
   - By Class
   - By Fee Status (Defaulters)
   - Custom Selection
3. Type message
4. Preview recipient count
5. Click "Send to All"

#### SMS Templates
Pre-built templates for:
- Fee reminders
- Exam notifications
- Attendance alerts
- Event announcements

---

### 🚌 Transport Management

#### Managing Routes
1. Go to **Transport → Routes**
2. Add route with stops
3. Assign vehicle and driver
4. Set route fee

#### GPS Tracking (If Available)
1. Go to **Transport → Live Tracking**
2. View real-time bus locations
3. Track route progress
4. View estimated arrival times

---

### 🏠 Hostel/Dormitory Management

#### Bed Assignment
1. Go to **Hostel → Dormitories**
2. Select dormitory
3. View available beds
4. Assign student to bed
5. Set dormitory fees

#### Hostel Reports
- Occupancy rates
- Available beds
- Fee collection per dorm

---

### 📚 Library Management

#### Issuing Books
1. Go to **Library → Issue Book**
2. Search for student
3. Search for book
4. Set due date
5. Click "Issue"

#### Returning Books
1. Go to **Library → Return Book**
2. Scan/search book
3. Check condition
4. Calculate fine (if overdue)
5. Mark as returned

---

### 📦 Inventory Management

#### Adding Inventory Items
1. Go to **Inventory → Add Item**
2. Fill in:
   - Item name
   - Category
   - Quantity
   - Unit price
3. Click "Save"

#### Recording Stock Movement
1. Go to **Inventory → Movement**
2. Select item
3. Choose type:
   - Purchase (stock in)
   - Issue (stock out)
   - Adjustment
4. Enter quantity and notes
5. Submit

---

### 🗓️ Timetable Management

#### Creating Class Timetable
1. Go to **Timetable → Create**
2. Select class
3. Add periods:
   - Day
   - Time slot
   - Subject
   - Teacher
   - Room
4. Save timetable

#### Auto-Generation (Admin Only)
1. Go to **Timetable → Auto-Generate**
2. Configure constraints:
   - Teacher availability
   - Room allocation
   - Subject distribution
3. Click "Generate"
4. Review and adjust
5. Publish

---

### 📈 Analytics & Reports

#### Dashboard Analytics
- Fee collection trends
- Student performance metrics
- Attendance patterns
- Revenue forecasts

#### Custom Reports
1. Go to **Reports → Custom Report**
2. Select data type:
   - Students
   - Fees
   - Attendance
   - Exams
3. Apply filters:
   - Date range
   - Class
   - Status
4. Choose format (PDF/Excel)
5. Generate

---

## Troubleshooting

### Common Issues

#### "Cannot connect to server"
- **Check:** Internet connection
- **Try:** Refresh page (Ctrl + F5)
- **Solution:** If offline, some features work in offline mode

#### "Login failed"
- **Check:** Email and password spelling
- **Try:** Password reset
- **Contact:** School admin for account issues

#### "Payment not reflecting"
- **MPesa:** Wait 1-2 minutes for confirmation
- **Check:** Payment status in Payments page
- **Contact:** Accountant if issue persists

#### "Attendance not syncing"
- **Check:** Internet connection
- **Look for:** Sync icon in top-right
- **Wait:** Auto-sync happens every 60 seconds
- **Manual:** Click sync button

#### "Slow loading"
- **Clear:** Browser cache
- **Close:** Unnecessary tabs
- **Check:** Internet speed
- **Try:** Different browser

---

## Support

### Getting Help

#### In-App Help
- Click **"?"** icon in navigation bar
- Access context-sensitive help

#### Contact Support
- **Email:** support@yourschool.com
- **Phone:** +254 XXX XXXXXX
- **Hours:** Monday-Friday, 8 AM - 5 PM

#### Training Sessions
- New user onboarding: Every Monday
- Advanced features: First Friday of month
- Custom training: Contact admin

### Feedback
We welcome your feedback!
- Submit via **Settings → Feedback**
- Email suggestions to: feedback@yourschool.com

---

## Best Practices

### For Admins
- ✅ Regular data backups (automated daily)
- ✅ Review user access permissions quarterly
- ✅ Monitor system performance weekly
- ✅ Update fee structures before term start
- ✅ Train staff on new features

### For Teachers
- ✅ Mark attendance by 10 AM daily
- ✅ Enter exam marks within 3 days
- ✅ Review report cards before publishing
- ✅ Keep student records updated

### For Parents
- ✅ Check portal weekly
- ✅ Update contact information promptly
- ✅ Pay fees before due date
- ✅ Respond to SMS notifications

### For Accountants
- ✅ Reconcile daily cash collections
- ✅ Generate monthly fee reports
- ✅ Send fee reminders 7 days before due date
- ✅ Follow up on defaulters promptly

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Quick Search | `Ctrl + K` |
| Save Form | `Ctrl + S` |
| New Student | `Ctrl + Shift + N` |
| Print | `Ctrl + P` |
| Logout | `Ctrl + Shift + L` |

---

## Appendix

### Glossary
- **Admission Number:** Unique student identifier
- **Term:** Academic period (typically 3 per year)
- **STK Push:** MPesa payment prompt on phone
- **Defaulter:** Student with overdue fees
- **PWA:** Progressive Web App (installable on mobile)

### System Limits
- Max file upload: 10 MB
- Max bulk SMS: 1000 recipients
- Max Excel export: 10,000 rows
- Session timeout: 8 hours

---

**End of User Manual**

*For technical documentation, see [Technical Guide](./TECHNICAL_GUIDE.md)*  
*For API documentation, see [API Reference](./API_REFERENCE.md)*

