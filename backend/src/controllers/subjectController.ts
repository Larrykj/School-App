import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    // For now, return a predefined list of common subjects
    // In the future, this could be stored in the database
    const subjects = [
      { id: '1', name: 'Mathematics', code: 'MATH' },
      { id: '2', name: 'English', code: 'ENG' },
      { id: '3', name: 'Kiswahili', code: 'KIS' },
      { id: '4', name: 'Science', code: 'SCI' },
      { id: '5', name: 'Social Studies', code: 'SST' },
      { id: '6', name: 'Religious Education', code: 'RE' },
      { id: '7', name: 'Physical Education', code: 'PE' },
      { id: '8', name: 'Art & Crafts', code: 'ART' },
      { id: '9', name: 'Music', code: 'MUS' },
      { id: '10', name: 'Computer Studies', code: 'COMP' },
      { id: '11', name: 'Agriculture', code: 'AGR' },
      { id: '12', name: 'Home Science', code: 'HS' },
      { id: '13', name: 'Business Studies', code: 'BUS' },
      { id: '14', name: 'Geography', code: 'GEO' },
      { id: '15', name: 'History', code: 'HIST' },
      { id: '16', name: 'Biology', code: 'BIO' },
      { id: '17', name: 'Chemistry', code: 'CHEM' },
      { id: '18', name: 'Physics', code: 'PHY' },
    ];

    res.json({ subjects });
  } catch (error: any) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code } = req.body;

    // For future implementation when subjects are stored in DB
    res.status(201).json({ 
      message: 'Subject created successfully', 
      subject: { name, code } 
    });
  } catch (error: any) {
    console.error('Create subject error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

