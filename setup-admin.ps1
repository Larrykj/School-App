# School Management System - Admin User Setup Script

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  ADMIN USER SETUP" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Cyan

# Check if backend is running
Write-Host "Checking if backend server is running..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✓ Backend server is running!" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend server is NOT running!" -ForegroundColor Red
    Write-Host "`nStarting backend server..." -ForegroundColor Yellow
    
    # Start backend in new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'BACKEND SERVER - Keep this window open!' -ForegroundColor Green; npm run dev"
    
    Write-Host "Waiting 10 seconds for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check again
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 2 -ErrorAction Stop
        Write-Host "✓ Backend server started successfully!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to start backend server!" -ForegroundColor Red
        Write-Host "Please check the backend terminal window for errors." -ForegroundColor Yellow
        Write-Host "`nCommon issues:"
        Write-Host "1. MySQL is not running"
        Write-Host "2. Database connection error in .env file"
        Write-Host "3. Port 5000 is already in use"
        exit
    }
}

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  CREATING ADMIN USER" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Cyan

$body = @{
    email = "admin@school.com"
    password = "admin123"
    firstName = "Admin"
    lastName = "User"
    role = "SUPER_ADMIN"
    phone = "0712345678"
} | ConvertTo-Json

Write-Host "Email: admin@school.com" -ForegroundColor Cyan
Write-Host "Password: admin123" -ForegroundColor Cyan
Write-Host "Role: SUPER_ADMIN`n" -ForegroundColor Cyan

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  ✓ ADMIN USER CREATED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "================================================`n" -ForegroundColor Green
    
    Write-Host "User Details:" -ForegroundColor White
    Write-Host "  ID: $($result.user.id)" -ForegroundColor Gray
    Write-Host "  Email: $($result.user.email)" -ForegroundColor Gray
    Write-Host "  Name: $($result.user.firstName) $($result.user.lastName)" -ForegroundColor Gray
    Write-Host "  Role: $($result.user.role)" -ForegroundColor Gray
    
    Write-Host "`n================================================" -ForegroundColor Cyan
    Write-Host "  NEXT STEPS" -ForegroundColor Green
    Write-Host "================================================`n" -ForegroundColor Cyan
    
    # Check if frontend is running
    Write-Host "Checking frontend server..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        Write-Host "✓ Frontend is already running at http://localhost:3000" -ForegroundColor Green
    } catch {
        Write-Host "✗ Frontend is not running. Starting it now..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'FRONTEND SERVER - Keep this window open!' -ForegroundColor Green; npm run dev"
        Write-Host "Frontend starting... Give it 10-15 seconds" -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
    
    Write-Host "`n1. Open your browser to: " -NoNewline
    Write-Host "http://localhost:3000" -ForegroundColor Yellow
    
    Write-Host "`n2. Login with:" -ForegroundColor White
    Write-Host "   Email:    " -NoNewline
    Write-Host "admin@school.com" -ForegroundColor Yellow
    Write-Host "   Password: " -NoNewline
    Write-Host "admin123`n" -ForegroundColor Yellow
    
    Write-Host "Press any key to open the app in your browser..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    Start-Process "http://localhost:3000"
} catch {
    $errorMessage = $_.Exception.Message
    
    if ($errorMessage -like "*already exists*" -or $errorMessage -like "*User already exists*") {
        Write-Host "================================================" -ForegroundColor Yellow
        Write-Host "  USER ALREADY EXISTS!" -ForegroundColor Yellow
        Write-Host "================================================`n" -ForegroundColor Yellow
        
        Write-Host "The admin user has already been created." -ForegroundColor White
        Write-Host "`nYou can login with:" -ForegroundColor White
        Write-Host "  Email:    " -NoNewline
        Write-Host "admin@school.com" -ForegroundColor Yellow
        Write-Host "  Password: " -NoNewline
        Write-Host "admin123`n" -ForegroundColor Yellow
        
        Write-Host "Opening the app..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:3000"
    }
    else {
        Write-Host "================================================" -ForegroundColor Red
        Write-Host "  ✗ ERROR CREATING USER" -ForegroundColor Red
        Write-Host "================================================`n" -ForegroundColor Red
        
        Write-Host "Error: $errorMessage`n" -ForegroundColor Red
        
        Write-Host "Troubleshooting:" -ForegroundColor Yellow
        Write-Host "1. Make sure backend server is running (check the other window)"
        Write-Host "2. Check if MySQL database is accessible"
        Write-Host "3. Verify the .env file in backend folder"
        Write-Host "`nBackend logs should show more details."
    }
}

