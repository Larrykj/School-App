import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { configureSecurityMiddleware } from './middleware/security';
import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';
import feeRoutes from './routes/feeRoutes';
import paymentRoutes from './routes/paymentRoutes';
import mpesaRoutes from './routes/mpesaRoutes';
import smsRoutes from './routes/smsRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import examRoutes from './routes/examRoutes';
import adminRoutes from './routes/adminRoutes';
import classRoutes from './routes/classRoutes';
import libraryRoutes from './routes/libraryRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import timetableRoutes from './routes/timetableRoutes';
import transportRoutes from './routes/transportRoutes';
import hostelRoutes from './routes/hostelRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import subjectRoutes from './routes/subjectRoutes';
import teacherRoutes from './routes/teacherRoutes';
import academicRoutes from './routes/academicRoutes';
import applicationRoutes from './routes/applicationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware (Helmet, Rate Limiting)
configureSecurityMiddleware(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (PDFs, Excel exports)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/pdfs', express.static(path.join(__dirname, '../pdfs')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/dorms', hostelRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'School Management System API' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

import http from 'http';
import { SocketService } from './services/socketService';

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
SocketService.init(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

