# Quick Start Guide

## ✅ Servers Running

- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000

## Step 1: Create Admin User

Run this in PowerShell:

```powershell
$body = @{
    email = "admin@school.com"
    password = "admin123"
    firstName = "Admin"
    lastName = "User"
    role = "SUPER_ADMIN"
    phone = "0712345678"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

## Step 2: Login

1. Open http://localhost:3000 in your browser
2. Login with:
   - **Email**: admin@school.com
   - **Password**: admin123

## Step 3: Explore the New Modern UI

You'll see:
- ✨ **Modern Dashboard** with visual stats
- 📊 **Fee tracking** cards
- 💳 **Payment system** ready
- 👥 **Student management**
- 📱 **Mobile-responsive** design

## What's New in the Modernized UI

### 1. Modern Admin Dashboard
- Beautiful stat cards with icons
- Top defaulters list (visual)
- Recent payments timeline
- Quick action buttons
- Color-coded badges

### 2. Better UX
- Loading states with spinners
- Currency formatting (KES)
- Date formatting
- Hover effects
- Smooth transitions

### 3. Modern Components
- Button variants (default, outline, ghost)
- Card layouts
- Badges (success, warning, danger)
- Better forms

## Create Test Data

### Add a Student
```powershell
$student = @{
    firstName = "John"
    lastName = "Doe"
    dateOfBirth = "2010-01-15"
    gender = "Male"
    phone = "0712345678"
    address = "Nairobi"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/students" -Method Post -Body $student -Headers $headers
```

### Add Fee Structure
```powershell
$fee = @{
    name = "Tuition Fee"
    amount = 50000
    term = "Term 1"
    academicYear = "2024"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/fees/structures" -Method Post -Body $fee -Headers $headers
```

## Test MPesa Integration

1. Go to Payments
2. Select MPesa as payment mode
3. Enter phone number (sandbox: any number works)
4. System will:
   - Send STK Push
   - Auto-update payment status
   - Send SMS confirmation
   - Generate PDF receipt

## Mobile Testing

Open http://localhost:3000 on your phone or:
- Use Chrome DevTools (F12) → Device toolbar
- Test responsive design
- Try offline mode (in DevTools → Network → Offline)

## Features to Test

### ✅ Already Working
- [x] User authentication
- [x] Role-based access
- [x] Modern dashboard
- [x] Student management (backend)
- [x] Fee tracking (backend)
- [x] Payment system (backend)
- [x] MPesa integration (backend)
- [x] SMS notifications (backend)
- [x] PDF generation (backend)
- [x] Excel exports (backend)

### 🚧 UI Being Modernized
- [ ] Fee management pages
- [ ] Payment interface (MPesa wizard)
- [ ] Student forms
- [ ] Parent portal
- [ ] Teacher portal
- [ ] Reports & analytics

## Stop Servers

```powershell
Get-Job | Stop-Job
Get-Job | Remove-Job
```

## Restart Servers

```powershell
# Backend
cd C:\Users\HomePC\Desktop\School_App\backend
npm run dev

# Frontend (new terminal)
cd C:\Users\HomePC\Desktop\School_App\frontend
npm run dev
```

## Troubleshooting

### Backend not starting?
- Check MySQL is running
- Verify .env file exists
- Run: `npx prisma generate`

### Frontend not starting?
- Delete .next folder
- Run: `npm install`
- Try different port (3001)

### Can't login?
- Make sure you created admin user
- Check backend logs
- Verify database connection

## Next Steps

1. **Test current features** - See what works
2. **Provide feedback** - What needs improvement?
3. **Continue modernization** - More pages coming!

