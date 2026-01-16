# Admin Quick Start Guide

## 🎯 Your Role: System Administrator

As an admin, you have full control over the school management system. This guide covers your most important daily and periodic tasks.

---

## 📋 Daily Tasks Checklist

### Morning (8:00 AM - 10:00 AM)
- [ ] Review dashboard for critical alerts
- [ ] Check pending user approvals
- [ ] Monitor system performance
- [ ] Review overnight payment reconciliation

### Midday (12:00 PM - 2:00 PM)
- [ ] Respond to support tickets
- [ ] Review teacher attendance submissions
- [ ] Check SMS delivery status

### Evening (4:00 PM - 5:00 PM)
- [ ] Generate daily collection report
- [ ] Review attendance summary
- [ ] Plan next day's activities

---

## 🚀 Quick Actions

### Add New Student
```
Dashboard → Students → Add Student
→ Fill form → Assign Class → Save
```

### Add Staff Member
```
Dashboard → Staff → Add Staff
→ Select Role → Set Permissions → Save
```

### Create Fee Structure
```
Dashboard → Fees → Fee Structures → New
→ Set Amount & Due Date → Assign Classes → Save
```

### View Reports
```
Dashboard → Reports → Select Type
→ Apply Filters → Generate → Download
```

---

## 🔑 Key Admin Functions

### User Management
**Adding Users:**
1. Navigate to **Settings → Users**
2. Click "Add User"
3. Select role: Admin, Teacher, Accountant, Parent
4. Set permissions
5. Send credentials

**Resetting Passwords:**
1. Find user in Users list
2. Click "Reset Password"
3. System sends reset email

**Deactivating Users:**
1. Find user
2. Toggle "Active" status
3. Confirm action

### Class Management
**Creating Classes:**
1. Go to **Academic → Classes**
2. Add class (e.g., "Form 1A")
3. Assign class teacher
4. Set capacity
5. Save

**Student Assignment:**
- Bulk assign during admission
- Individual moves via student profile
- Auto-promotion at year end

### System Configuration
**Fee Settings:**
- Late payment penalties
- Payment modes enabled
- Receipt numbering format
- Auto-reminders schedule

**SMS Settings:**
- Africa's Talking API credentials
- Sender ID configuration
- SMS templates
- Rate limit settings

**MPesa Settings:**
- Consumer Key & Secret
- Passkey & Till Number
- Callback URL
- Test/Production mode

---

## 📊 Important Reports

### Weekly Reports
- Fee collection summary
- Attendance overview
- New admissions
- Staff activity log

### Monthly Reports
- Revenue vs budget
- Defaulters list
- Student performance trends
- Resource utilization

### Term Reports
- Full fee collection
- Exam results analysis
- Attendance statistics
- Teacher performance

---

## ⚠️ Critical Alerts to Monitor

### System Alerts
- ❌ Failed SMS deliveries
- ❌ MPesa callback failures
- ❌ Low system storage
- ❌ Database backup failures

### Financial Alerts
- 💰 Payments pending reconciliation
- 💰 High number of defaulters
- 💰 Unusual payment patterns

### Academic Alerts
- 📚 Low attendance rates
- 📚 Missing exam marks
- 📚 Uncompleted report cards

---

## 🛠️ Troubleshooting Common Issues

### "MPesa not working"
1. Check credentials in Settings → Payments → MPesa
2. Verify callback URL is accessible
3. Check MPesa dashboard for errors
4. Contact Safaricom support if needed

### "SMS not sending"
1. Verify Africa's Talking balance
2. Check API credentials
3. Review SMS logs for error messages
4. Test with single SMS first

### "Slow system performance"
1. Check active users count
2. Review server resources
3. Clear cache: Settings → System → Clear Cache
4. Contact technical support

### "Report not generating"
1. Check date range validity
2. Reduce data scope if large
3. Try different format (PDF/Excel)
4. Check browser console for errors

---

## 🔐 Security Best Practices

### Password Policy
- Change admin password monthly
- Use strong passwords (12+ chars)
- Enable 2FA if available
- Don't share credentials

### Access Control
- Review user permissions quarterly
- Deactivate unused accounts
- Monitor admin activity logs
- Use principle of least privilege

### Data Protection
- Verify backup schedule (daily)
- Test restore procedure monthly
- Limit data export permissions
- Secure exported files

---

## 📅 Term Start Checklist

### Before Term Starts (2 weeks before)
- [ ] Update fee structures
- [ ] Verify class allocations
- [ ] Review teacher assignments
- [ ] Update timetables
- [ ] Test all systems
- [ ] Train new staff
- [ ] Send welcome messages

### First Week of Term
- [ ] Admit new students
- [ ] Collect term fees
- [ ] Confirm student class assignments
- [ ] Start attendance tracking
- [ ] Distribute timetables
- [ ] Send term fee reminders

### During Term
- [ ] Monitor fee collection progress
- [ ] Weekly attendance reviews
- [ ] Mid-term performance check
- [ ] Address parent concerns
- [ ] System maintenance

### End of Term
- [ ] Finalize exam marks
- [ ] Generate report cards
- [ ] Term fee summary report
- [ ] Student promotion/retention
- [ ] Archive term data
- [ ] System backup verification

---

## 📞 Escalation Procedures

### Level 1: Self-Service
- Check this guide
- Review system help docs
- Search FAQ

### Level 2: Internal Support
- Contact IT staff
- Email: it@yourschool.com
- Response: 2 hours

### Level 3: Vendor Support
- Technical issues beyond Level 2
- Email: support@vendor.com
- Phone: +254 XXX XXXXXX
- Response: 4 hours (business hours)

### Level 4: Emergency
- System down during critical period
- Data loss or security breach
- Emergency hotline: +254 XXX XXXXXX
- Response: Immediate

---

## 💡 Pro Tips

1. **Use Bulk Operations:** Save time with bulk student imports, bulk SMS, bulk promotions
2. **Set Up Automation:** Configure auto-reminders for fees, birthdays, events
3. **Regular Backups:** Download critical reports weekly as backup
4. **Monitor Trends:** Use analytics to spot issues early
5. **Communicate:** Regular updates to staff keep everyone aligned
6. **Document Changes:** Keep log of configuration changes
7. **Test Before Deploy:** Test new features in sandbox environment
8. **Train Continuously:** Regular training sessions for all users
9. **Listen to Feedback:** User feedback improves system adoption
10. **Stay Updated:** Review system updates and new features monthly

---

## 📚 Additional Resources

- [Full User Manual](./USER_MANUAL.md)
- [Technical Documentation](./TECHNICAL_GUIDE.md)
- [API Reference](./API_REFERENCE.md)
- [Video Tutorials](https://videos.yourschool.com)
- [Community Forum](https://forum.yourschool.com)

---

**Questions?** Email: admin-support@yourschool.com

