# School Management System - Production Build Script

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  BUILDING FOR PRODUCTION" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Cyan

# 1. Backend Build
Write-Host "Step 1: Building Backend..." -ForegroundColor Yellow
cd backend
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "Backend install failed"; exit 1 }

Write-Host "  Generating Prisma Client..." -ForegroundColor Gray
npx prisma generate
if ($LASTEXITCODE -ne 0) { Write-Error "Prisma generate failed"; exit 1 }

Write-Host "  Compiling TypeScript..." -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Backend build failed"; exit 1 }

cd ..
Write-Host "✓ Backend built successfully!`n" -ForegroundColor Green

# 2. Frontend Build
Write-Host "Step 2: Building Frontend..." -ForegroundColor Yellow
cd frontend
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend install failed"; exit 1 }

Write-Host "  Building Next.js App..." -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed"; exit 1 }

cd ..
Write-Host "✓ Frontend built successfully!`n" -ForegroundColor Green

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  BUILD COMPLETE! 🚀" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Cyan
Write-Host "To start the app in production:"
Write-Host "1. Backend:  cd backend; node dist/index.js"
Write-Host "2. Frontend: cd frontend; npm start"

