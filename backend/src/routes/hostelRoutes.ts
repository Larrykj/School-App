import express from 'express';
import { authenticate } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all dormitories
router.get('/', authenticate, async (req, res) => {
  try {
    const dorms = await prisma.dormitory.findMany({
      include: {
        students: true
      }
    });
    res.json({ dorms });
  } catch (error) {
    console.error('Failed to fetch dorms:', error);
    res.status(500).json({ error: 'Failed to fetch dorms' });
  }
});

// Create a dormitory
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, type, capacity, description } = req.body;

    if (!name || !type || !capacity) {
      return res.status(400).json({ error: 'Name, type (gender), and capacity are required' });
    }

    const dorm = await prisma.dormitory.create({
      data: {
        name,
        gender: type, // Map 'type' to 'gender'
        capacity: parseInt(capacity),
        description
      }
    });

    res.json({ dorm });
  } catch (error) {
    console.error('Failed to create dorm:', error);
    res.status(500).json({ error: 'Failed to create dorm' });
  }
});

// Assign student to bed
router.post('/assign', authenticate, async (req, res) => {
  try {
    const { studentId, dormitoryId, bedNumber } = req.body;

    // Check if bed is taken
    const existingAssignment = await prisma.bedAssignment.findFirst({
      where: {
        dormitoryId,
        bedNumber,
        status: 'ACTIVE'
      }
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'Bed is already occupied' });
    }

    const assignment = await prisma.bedAssignment.create({
      data: {
        studentId,
        dormitoryId,
        bedNumber
      }
    });

    res.json({ assignment });
  } catch (error) {
    console.error('Failed to assign bed:', error);
    res.status(500).json({ error: 'Failed to assign bed' });
  }
});

export default router;

