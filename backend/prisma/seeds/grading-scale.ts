import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Kenyan University Grading Scale (Based on common TVET/University standards)
 */
export const gradingScaleData = [
  {
    minPercentage: 70,
    maxPercentage: 100,
    letterGrade: 'A',
    gradePoints: 4.0,
    description: 'Excellent',
  },
  {
    minPercentage: 60,
    maxPercentage: 69.99,
    letterGrade: 'B',
    gradePoints: 3.0,
    description: 'Good',
  },
  {
    minPercentage: 50,
    maxPercentage: 59.99,
    letterGrade: 'C',
    gradePoints: 2.0,
    description: 'Satisfactory',
  },
  {
    minPercentage: 40,
    maxPercentage: 49.99,
    letterGrade: 'D',
    gradePoints: 1.0,
    description: 'Pass',
  },
  {
    minPercentage: 0,
    maxPercentage: 39.99,
    letterGrade: 'E',
    gradePoints: 0.0,
    description: 'Fail',
  },
];

export async function seedGradingScale() {
  console.log('🎓 Seeding grading scale...');
  
  for (const grade of gradingScaleData) {
    await prisma.gradingScale.upsert({
      where: {
        letterGrade: grade.letterGrade,
      },
      update: grade,
      create: grade,
    });
  }
  
  console.log('✅ Grading scale seeded successfully');
}

// Run if executed directly
if (require.main === module) {
  seedGradingScale()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

