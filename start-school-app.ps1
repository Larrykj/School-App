# School Management System Startup Script

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  STARTING SCHOOL MANAGEMENT SYSTEM" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Cyan

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'BACKEND SERVER' -ForegroundColor Green; npm run dev"

# Wait for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'FRONTEND SERVER' -ForegroundColor Green; npm run dev"

# Wait a bit more
Start-Sleep -Seconds 3

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  SERVERS STARTED!" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Cyan

Write-Host "Backend:  " -NoNewline
Write-Host "http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: " -NoNewline  
Write-Host "http://localhost:3000`n" -ForegroundColor Yellow

Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Wait 10-15 seconds for servers to fully start"
Write-Host "2. Run the admin user creation command (see QUICKSTART.md)"
Write-Host "3. Open http://localhost:3000 in your browser`n"

Write-Host "To stop servers: Close the terminal windows or press Ctrl+C" -ForegroundColor Gray
Write-Host "`nPress any key to open the app in your browser..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:3000"

