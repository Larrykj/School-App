# How to Start the School Management System

## Method 1: Two Separate Terminals (RECOMMENDED)

### Terminal 1 - Backend Server

```powershell
cd C:\Users\HomePC\Desktop\School_App\backend
npm run dev
```

You should see:
```
Server running on port 5000
```

**Keep this terminal open!**

---

### Terminal 2 - Frontend Server

Open a NEW PowerShell window and run:

```powershell
cd C:\Users\HomePC\Desktop\School_App\frontend
npm run dev
```

You should see:
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
✓ Starting...
✓ Ready in 2.5s
```

**Keep this terminal open too!**

---

## Method 2: Using Start-Process (Windows)

Run this in ONE terminal:

```powershell
# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\HomePC\Desktop\School_App\backend; npm run dev"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\HomePC\Desktop\School_App\frontend; npm run dev"
```

This will open two new PowerShell windows.

---

## Once Both Servers Are Running:

### Step 1: Create Admin User

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

### Step 2: Open Browser

Go to: **http://localhost:3000**

Login with:
- Email: admin@school.com
- Password: admin123

---

## Verify Servers Are Running

### Check Backend:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health"
```

Should return:
```json
{
  "status": "OK",
  "message": "School Management System API"
}
```

### Check Frontend:
Open http://localhost:3000 in browser - should see login page

---

## Stop Servers

Press `Ctrl+C` in each terminal window.

Or if using Start-Process:
```powershell
Stop-Process -Name "node" -Force
```

---

## Troubleshooting

### "Port 5000 is already in use"
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill that process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### "Port 3000 is already in use"
The frontend will automatically use port 3001 or 3002.

### Backend won't start
1. Check MySQL is running
2. Verify .env file exists in backend folder
3. Run: `npx prisma generate`

### Database connection error
Update `backend/.env`:
```
DATABASE_URL="mysql://YOUR_USERNAME:YOUR_PASSWORD@localhost:3306/school_db"
```

