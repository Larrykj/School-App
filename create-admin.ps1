# Create Admin User for School Management System

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  CREATING ADMIN USER" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Admin user details
$body = @{
    email = "admin@school.com"
    password = "admin123"
    firstName = "Admin"
    lastName = "User"
    role = "SUPER_ADMIN"
    phone = "0712345678"
} | ConvertTo-Json

Write-Host "Attempting to create admin user..." -ForegroundColor Yellow
Write-Host "Email: admin@school.com"
Write-Host "Password: admin123`n"

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Admin user created" -ForegroundColor Green  
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "User ID: $($result.user.id)"
    Write-Host "Email: $($result.user.email)"
    Write-Host "Name: $($result.user.firstName) $($result.user.lastName)"
    Write-Host "Role: $($result.user.role)`n"
    
    Write-Host "You can now login at http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Press any key to open the app..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Start-Process "http://localhost:3000"
}
catch {
    $errorMsg = $_.Exception.Message
    
    if ($errorMsg -like "*User already exists*" -or $errorMsg -like "*already exists*") {
        Write-Host "========================================" -ForegroundColor Yellow
        Write-Host "  User already exists!" -ForegroundColor Yellow
        Write-Host "========================================`n" -ForegroundColor Yellow
        Write-Host "You can login with:"
        Write-Host "  Email: admin@school.com"
        Write-Host "  Password: admin123`n"
    }
    elseif ($errorMsg -like "*Unable to connect*") {
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  Backend server is not running!" -ForegroundColor Red
        Write-Host "========================================`n" -ForegroundColor Red
        Write-Host "Please start the backend server first:`n"
        Write-Host "cd backend"
        Write-Host "npm run dev`n"
    }
    else {
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  Error!" -ForegroundColor Red
        Write-Host "========================================`n" -ForegroundColor Red
        Write-Host $errorMsg`n
    }
}

