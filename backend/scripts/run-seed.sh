#!/bin/bash

echo "🌱 Starting Database Seeding Process..."
echo "========================================"
echo ""

# Check if database is accessible
echo "📡 Checking database connection..."
if ! npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to database. Please check your DATABASE_URL"
    exit 1
fi
echo "✅ Database connection successful"
echo ""

# Confirm before proceeding
echo "⚠️  WARNING: This will delete ALL existing data!"
echo "   Are you sure you want to continue? (yes/no)"
read -r response

if [ "$response" != "yes" ]; then
    echo "❌ Seeding cancelled"
    exit 0
fi
echo ""

# Run the seed
echo "🚀 Running seed script..."
echo "This may take 2-5 minutes..."
echo ""

npm run seed

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Seeding completed successfully!"
    echo ""
    echo "📊 You can now:"
    echo "   • Start the backend: npm run dev"
    echo "   • View data in Prisma Studio: npm run prisma:studio"
    echo "   • Login with: admin@university.ac.ke / password123"
else
    echo ""
    echo "❌ Seeding failed. Please check the error above."
    exit 1
fi

