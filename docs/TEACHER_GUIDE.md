# Teacher Guide - School Management System

**Version:** 1.0  
**Last Updated:** November 19, 2025

---

## Table of Contents

1. [Welcome](#welcome)
2. [Getting Started](#getting-started)
3. [Daily Workflow](#daily-workflow)
4. [Core Features](#core-features)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Tips & Tricks](#tips--tricks)

---

## Welcome

Welcome, Teacher! This guide will help you use the School Management System effectively for your daily teaching and administrative tasks.

### What You Can Do

As a teacher, you have access to:
- ✅ Mark daily attendance
- ✅ Enter exam marks
- ✅ Generate report cards
- ✅ View student performance
- ✅ Manage your classes
- ✅ View class timetable
- ✅ Post announcements
- ✅ Communicate with parents

---

## Getting Started

### First Time Login

1. **Access the System**
   - Open your browser (Chrome, Firefox, or Safari recommended)
   - Go to: `http://your-school-domain.com`
   - Or use the mobile app (available on Play Store)

2. **Login Credentials**
   - Email: Your school-provided email
   - Password: Temporary password (change on first login)

3. **Change Password**
   - Click your profile icon (top right)
   - Select "Change Password"
   - Enter old password
   - Create new strong password
   - Click "Update"

### Dashboard Overview

Your teacher dashboard shows:
- **Today's Classes:** Your schedule for the day
- **Pending Tasks:** Attendance to mark, marks to enter
- **Recent Activities:** Your recent actions
- **Quick Stats:** Student count, attendance rate, pending marks
- **Announcements:** Important school updates

---

## Daily Workflow

### Morning Routine (Before Classes)

1. **Login** to the system
2. **Check Today's Schedule**
   - View your classes for the day
   - Note any room changes
   - Check if any students are absent (sick notes)

3. **Review Pending Tasks**
   - Yesterday's attendance (if not completed)
   - Marks to be entered
   - Report cards to review

### During Classes

#### Taking Attendance

**Method 1: During Class (Recommended)**
1. Go to **Attendance → Mark Attendance**
2. Select today's date (auto-selected)
3. Select your class from dropdown
4. You'll see a list of all students
5. Mark each student:
   - ✅ **Present** (green) - Student is in class
   - ❌ **Absent** (red) - Student is not in class
   - 🏥 **Sick** (yellow) - Student is sick (with note)
   - ✈️ **Excused** (blue) - Pre-approved absence
6. Add notes if needed (optional)
7. Click **"Submit Attendance"**

**Method 2: Quick Roll Call**
- All students are marked "Present" by default
- Simply tap absent students to change status
- This is faster for large classes

**Offline Mode:**
- If internet is down, don't worry!
- The system works offline
- Your attendance is saved locally
- It will automatically sync when internet returns
- Look for the sync icon (🔄) in top-right corner

### End of Day

1. **Verify Attendance** submitted for all classes
2. **Log any incidents** or special notes
3. **Check notifications** for tomorrow
4. **Logout** or close tab

---

## Core Features

### 📋 Attendance Management

#### Viewing Attendance History

1. Go to **Attendance → View Records**
2. Filters available:
   - Date range
   - Class
   - Student name
   - Status (Present/Absent/Sick/Excused)
3. Click "Search"
4. Export to Excel if needed

#### Editing Attendance

If you made a mistake:
1. Go to **Attendance → View Records**
2. Find the date and class
3. Click "Edit" icon
4. Make corrections
5. Add reason for change (required)
6. Click "Update"

Note: You can only edit attendance for current week. Contact admin for older records.

#### Attendance Reports

**Individual Student Report:**
1. Go to **Students → [Select Student]**
2. Click "Attendance" tab
3. View attendance percentage and patterns
4. See dates of absence

**Class Report:**
1. Go to **Attendance → Reports**
2. Select your class
3. Choose date range
4. View:
   - Class attendance rate
   - Individual student percentages
   - Trends over time
   - Students with low attendance (flagged in red)

---

### 📝 Exam & Marks Management

#### Creating an Exam

1. Go to **Exams → Create Exam**
2. Fill in required information:
   - **Exam Name:** e.g., "Mid-Term 1 2025"
   - **Class:** Select your class
   - **Term:** Current term
   - **Academic Year:** 2025
   - **Exam Date:** When exam is held
3. **Add Subjects:**
   - Click "Add Subject"
   - Select subject (e.g., Mathematics)
   - Enter maximum marks (e.g., 100)
   - Repeat for all subjects
4. Click **"Create Exam"**

#### Entering Marks

**Single Subject Entry:**
1. Go to **Exams → Enter Marks**
2. Select exam from dropdown
3. Select subject
4. You'll see all students in class
5. Enter marks for each student:
   - Type mark in the box
   - Press Tab to move to next
   - Marks out of max (e.g., 75/100)
6. System auto-calculates:
   - Grade (A, B, C, D, E)
   - Percentage
   - Position in class
7. Click **"Save Marks"**

**Tips for Entering Marks:**
- Use Tab key to quickly move between fields
- Press Ctrl+S to save as you go
- Marks are saved automatically every 2 minutes
- You can save partial marks and continue later
- Invalid marks (over maximum) will show error in red

#### Bulk Mark Entry (CSV Upload)

For faster entry of large classes:
1. Go to **Exams → Bulk Upload**
2. Download CSV template
3. Fill marks in Excel:
   ```
   Admission Number, Student Name, Math, English, Science
   2025001, John Doe, 85, 78, 92
   2025002, Jane Smith, 90, 88, 85
   ```
4. Save as CSV
5. Upload file
6. Review preview
7. Click "Import"

#### Grade Configuration

The grading system (can't be changed by teachers):
- **A:** 80-100 (Excellent)
- **B:** 60-79 (Good)
- **C:** 50-59 (Average)
- **D:** 40-49 (Below Average)
- **E:** 0-39 (Fail)

Your admin can customize this if needed.

---

### 📊 Report Cards

#### Generating Report Cards

**Individual Report Card:**
1. Go to **Exams → Report Cards**
2. Select exam
3. Select student
4. Click "Preview"
5. Review information:
   - Student details
   - All subject marks and grades
   - Overall performance
   - Position in class
   - Teacher's comment
   - Head teacher's comment
6. Add your comment (if required)
7. Click **"Generate PDF"**
8. Download or print

**Bulk Report Cards:**
1. Go to **Exams → Report Cards**
2. Select exam
3. Select "All Students" or specific class
4. Add general comments (optional)
5. Click **"Generate All"**
6. System processes in background
7. You'll receive notification when ready
8. Download as ZIP file

**Sending Report Cards:**
- Option 1: Download PDFs and print
- Option 2: Email to parents (if emails are registered)
- Option 3: Send SMS link to parents

---

### 👥 Student Management

#### Viewing Student Information

1. Go to **Students → View Students**
2. Search by:
   - Name
   - Admission number
   - Class
3. Click on student name
4. View tabs:
   - **Profile:** Personal info, photo, contact
   - **Academic:** Exam history, performance
   - **Attendance:** Attendance record
   - **Fees:** Fee balance (read-only)
   - **Behavior:** Disciplinary records

#### Student Performance Analysis

1. Go to **Students → [Select Student] → Performance**
2. View:
   - **Exam Trends:** Graph showing performance over time
   - **Subject Strengths:** Best performing subjects
   - **Areas to Improve:** Subjects needing attention
   - **Comparison:** How student compares to class average
3. Use this data for:
   - Parent-teacher meetings
   - Identifying struggling students
   - Academic interventions

#### Class Management

**View Your Classes:**
1. Go to **My Classes**
2. See all classes you teach
3. For each class, view:
   - Total students
   - Current attendance rate
   - Average performance
   - Outstanding tasks

**Class Timetable:**
1. Go to **Timetable → My Timetable**
2. View weekly schedule
3. See:
   - Time slots
   - Classes
   - Rooms
   - Number of lessons per subject
4. Download or print timetable

---

### 📢 Communication

#### Posting Announcements

1. Go to **Communication → Announcements**
2. Click "New Announcement"
3. Fill in:
   - Title (e.g., "Homework Due Tomorrow")
   - Message
   - Target: Your class(es) or specific students
   - Priority: Normal, Important, Urgent
4. Attach files if needed (optional)
5. Click "Post"

Students and parents can see announcements in their portals.

#### Viewing Messages

1. Go to **Communication → Messages**
2. View:
   - Inbox: Messages from parents, admin, other teachers
   - Sent: Your sent messages
3. Reply to messages
4. Star important messages

#### Contacting Parents

**Individual Parent:**
1. Go to **Students → [Select Student] → Contact**
2. Choose method:
   - **System Message:** Send through platform
   - **Request SMS:** Ask admin to send SMS
   - **View Contact:** See parent phone/email (call directly)

**Class Parents (Bulk):**
1. Go to **Communication → Bulk Message**
2. Select your class
3. Type message
4. Submit request to admin
5. Admin will review and send SMS

Note: Teachers cannot directly send SMS (to prevent abuse), but admin can send on your behalf.

---

### 📚 Resources & Materials

#### Uploading Class Materials

1. Go to **Resources → My Materials**
2. Click "Upload"
3. Select files:
   - Notes (PDF, Word)
   - Assignments (PDF)
   - Presentations (PPT)
   - Videos (links)
4. Add details:
   - Title
   - Description
   - Class
   - Subject
5. Click "Upload"

Students can access materials from their portal.

#### Homework/Assignments

1. Go to **Assignments → Create**
2. Fill in:
   - Title: "Week 3 Math Assignment"
   - Description/Instructions
   - Subject & Class
   - Due Date
   - Maximum Points
3. Attach file or add text
4. Click "Assign"

Students will see assignment in their portal.

**Tracking Submissions:**
1. Go to **Assignments → View Assignments**
2. Click on assignment
3. See:
   - Total submissions
   - Pending submissions
   - Late submissions
4. Grade submissions
5. Provide feedback

---

## Best Practices

### Attendance

✅ **DO:**
- Mark attendance before 10 AM daily
- Use "Sick" status when student has medical note
- Add notes for unusual patterns
- Report chronic absenteeism to admin
- Double-check before submitting

❌ **DON'T:**
- Mark attendance days in advance
- Mark students present if they're not there
- Forget to mark attendance (affects records)
- Change attendance without noting reason

### Marks Entry

✅ **DO:**
- Enter marks within 3 days of exam
- Double-check calculations
- Review marks before finalizing
- Keep physical exam papers as backup
- Save progress frequently

❌ **DON'T:**
- Rush mark entry (accuracy is key)
- Enter marks without verification
- Share marks publicly before official release
- Lose student answer sheets

### Report Cards

✅ **DO:**
- Write constructive, helpful comments
- Be specific about strengths and weaknesses
- Provide actionable suggestions
- Proofread comments before generating
- Maintain professional tone

❌ **DON'T:**
- Use negative or discouraging language
- Copy-paste same comment for all students
- Include personal opinions
- Be vague ("Try harder" - not helpful)

### Communication

✅ **DO:**
- Respond to parent messages within 24 hours
- Keep communication professional
- Document important conversations
- Follow up on parent concerns
- Use announcements for class-wide info

❌ **DON'T:**
- Share personal phone number
- Engage in arguments
- Discuss other students
- Make promises you can't keep

---

## Troubleshooting

### Common Issues & Solutions

#### "I can't mark attendance - class not showing"

**Possible Causes:**
- You're not assigned to that class
- Class has been deleted or archived
- Wrong date selected

**Solution:**
1. Check if you teach that class (My Classes)
2. Verify date is correct (not future or too old)
3. Contact admin if class is missing

---

#### "Marks are not saving"

**Possible Causes:**
- Internet connection issue
- Marks exceed maximum
- Invalid characters in marks field
- Session expired

**Solution:**
1. Check internet connection
2. Verify marks are valid numbers
3. Look for red error messages
4. Try refreshing page (marks may have saved)
5. If still failing, screenshot and contact IT

---

#### "Report card generation failed"

**Possible Causes:**
- Not all marks entered
- Student data incomplete
- System overload (many teachers generating at once)

**Solution:**
1. Verify all subject marks are entered
2. Check if student has photo uploaded
3. Try generating one report card first (test)
4. If bulk generation fails, try smaller batches
5. Generate during off-peak hours

---

#### "Offline mode - attendance not syncing"

**Status Check:**
- Look for sync icon in top-right
- Green check ✅: Synced
- Orange spinner 🔄: Syncing
- Red X ❌: Sync failed

**Solution:**
1. Check internet connection
2. If connected, sync should happen automatically
3. Click sync icon to force sync
4. If sync fails repeatedly:
   - Note the data locally
   - Contact IT support
   - Don't close browser until synced

---

#### "Student showing in wrong class"

**Note:** Teachers cannot move students between classes.

**Solution:**
1. Verify student details
2. Check if student was recently promoted
3. Contact admin to reassign student
4. Provide: Student name, admission number, current class, correct class

---

#### "I need to access attendance from 2 months ago"

**Solution:**
- Historical attendance (older than 1 week) is read-only for teachers
- View: Go to Attendance → View Records → Select date
- Edit: Contact admin with details of correction needed
- Export: You can export historical data to Excel

---

### Getting Help

1. **In-App Help:** Click "?" icon for context-specific help
2. **User Manual:** Access full manual from Help menu
3. **IT Support:** Contact school IT support
4. **Admin:** Reach out to school admin for access/permissions issues
5. **Training:** Attend monthly training sessions

---

## Tips & Tricks

### ⚡ Speed Tips

1. **Keyboard Shortcuts:**
   - `Ctrl + K`: Quick search
   - `Tab`: Move between fields
   - `Ctrl + S`: Save form
   - `Ctrl + Enter`: Submit form

2. **Quick Attendance:**
   - All students default to "Present"
   - Only click absent students
   - 2x faster than marking each one

3. **Bulk Operations:**
   - Use CSV upload for marks (faster for 30+ students)
   - Generate all report cards at once
   - Use bulk messages for class communication

### 📊 Data Insights

1. **Identify At-Risk Students:**
   - Go to Dashboard → My Students
   - Sort by attendance rate (ascending)
   - Students under 75% need attention
   - Sort by performance to find struggling students

2. **Track Your Performance:**
   - View your class average over time
   - Compare to school average
   - Identify which topics students struggle with
   - Use data to improve teaching methods

### 🔒 Security Tips

1. **Password Safety:**
   - Change password every 3 months
   - Use strong password (8+ characters, mix of letters, numbers, symbols)
   - Never share your login
   - Logout on shared computers

2. **Data Privacy:**
   - Don't share student data outside system
   - Don't screenshot student records
   - Don't discuss student performance publicly
   - Follow school data protection policy

### 🎯 Efficiency Tips

1. **Set a Routine:**
   - Mark attendance same time daily (e.g., 9 AM)
   - Dedicate specific day for mark entry (e.g., Fridays)
   - Review pending tasks every morning

2. **Use Mobile App:**
   - Install PWA on phone
   - Mark attendance from phone (faster)
   - Get notifications on the go
   - Works offline

3. **Batch Your Work:**
   - Enter all marks for one subject across all classes
   - Generate all report cards at once
   - Review all pending tasks together

### 💬 Communication Tips

1. **Parent Communication:**
   - Be proactive (don't wait for parents to reach out)
   - Share positive news, not just problems
   - Use system messages for documentation
   - Follow up on conversations

2. **Student Motivation:**
   - Post encouraging announcements
   - Recognize top performers publicly (with permission)
   - Share helpful resources
   - Provide constructive feedback

---

## Frequently Asked Questions

### Q1: Can I change my class assignments?

**A:** No, only admin can assign or change class assignments. Contact admin if you need changes.

### Q2: Can I see other teachers' marks?

**A:** No, for privacy reasons. Only admin can view all marks. You can see your students' marks from other subjects in the report card.

### Q3: What if I'm sick and can't mark attendance?

**A:** Contact admin or another teacher to mark attendance on your behalf. Provide them with absence information.

### Q4: Can I delete or edit old exams?

**A:** You can edit marks within the same term. Deleting exams requires admin permission. Contact admin if you created an exam by mistake.

### Q5: Can parents see attendance immediately?

**A:** Yes, once you submit attendance, parents can see it in their portal within seconds. They may also receive SMS notification if enabled.

### Q6: What happens if I enter wrong marks?

**A:** You can edit marks before report cards are generated. After report cards are issued, you must contact admin to make corrections.

### Q7: Can students see their marks before report cards?

**A:** This depends on school policy. Some schools allow students to view marks in real-time; others only show marks with report cards. Check with admin.

### Q8: How do I request a new feature?

**A:** Go to Settings → Feedback → Submit Suggestion. The admin reviews all suggestions and forwards to IT.

### Q9: Why can't I send SMS directly to parents?

**A:** To prevent abuse and control costs, SMS must be approved by admin. Submit request through Communication → Bulk Message.

### Q10: Can I use the system on my phone?

**A:** Yes! The system is fully mobile-responsive. You can also install the PWA (Progressive Web App) for app-like experience.

---

## Quick Reference Card

### Daily Tasks
- [ ] Mark attendance (before 10 AM)
- [ ] Check pending marks
- [ ] Review messages/announcements
- [ ] Update class progress

### Weekly Tasks
- [ ] Enter any pending exam marks
- [ ] Review student performance
- [ ] Respond to all parent messages
- [ ] Post weekly announcements

### Monthly Tasks
- [ ] Generate class performance report
- [ ] Review attendance patterns
- [ ] Identify at-risk students
- [ ] Attend training session

### Term Tasks
- [ ] Enter all exam marks
- [ ] Generate report cards
- [ ] Add report comments
- [ ] Review term performance

---

## Contact Information

### Technical Support
- **Email:** it@yourschool.com
- **Phone:** +254 XXX XXXXXX
- **Hours:** Monday-Friday, 8 AM - 5 PM

### Admin Office
- **Email:** admin@yourschool.com
- **Phone:** +254 XXX XXXXXX

### Emergency Support
- **Hotline:** +254 XXX XXXXXX (24/7)

---

## Additional Resources

- **Full User Manual:** [USER_MANUAL.md](./USER_MANUAL.md)
- **Video Tutorials:** Available in Help → Tutorials
- **Training Schedule:** Contact admin office
- **FAQ:** Help → Frequently Asked Questions

---

**Remember:** This system is here to make your work easier. Don't hesitate to ask for help!

---

**Happy Teaching! 🎓**

*Last Updated: November 19, 2025*

