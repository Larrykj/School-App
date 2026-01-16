# PowerShell script for Windows

Write-Host "🌱 Starting Database Seeding Process..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if database is accessible
Write-Host "📡 Checking database connection..." -ForegroundColor Yellow
try {
    $null = npx prisma db execute --stdin --input "SELECT 1;" 2>&1
    Write-Host "✅ Database connection successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to database. Please check your DATABASE_URL" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Confirm before proceeding
Write-Host "⚠️  WARNING: This will delete ALL existing data!" -ForegroundColor Yellow
$response = Read-Host "   Are you sure you want to continue? (yes/no)"

if ($response -ne "yes") {
    Write-Host "❌ Seeding cancelled" -ForegroundColor Red
    exit 0
}
Write-Host ""

# Run the seed
Write-Host "🚀 Running seed script..." -ForegroundColor Cyan
Write-Host "This may take 2-5 minutes..." -ForegroundColor Cyan
Write-Host ""

npm run seed

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Seeding completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 You can now:" -ForegroundColor Cyan
    Write-Host "   • Start the backend: npm run dev" -ForegroundColor White
    Write-Host "   • View data in Prisma Studio: npm run prisma:studio" -ForegroundColor White
    Write-Host "   • Login with: admin@university.ac.ke / password123" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Seeding failed. Please check the error above." -ForegroundColor Red
    exit 1
}

