# Stop School Management System

Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

Write-Host "✓ All servers stopped" -ForegroundColor Green

