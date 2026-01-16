'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  BarChart
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  programs: number;
  courses: number;
  students: number;
  currentSemester?: {
    name: string;
    academicYear: string;
    registrationOpen: boolean;
  };
  recentActivity: Array<{
    type: string;
    message: string;
    time: string;
  }>;
}

export default function AcademicDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('STUDENT');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get user role
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      }

      // Fetch dashboard stats
      const [programsRes, coursesRes, semesterRes] = await Promise.all([
        api.get('/academic/programs'),
        api.get('/academic/courses'),
        api.get('/academic/semesters/active'),
      ]);

      const semester = semesterRes.data.semester;
      const now = new Date();
      const regStart = new Date(semester.registrationStart);
      const regEnd = new Date(semester.registrationEnd);
      const isRegOpen = now >= regStart && now <= regEnd;

      setStats({
        programs: programsRes.data.programs?.length || 0,
        courses: coursesRes.data.courses?.length || 0,
        students: 1250, // Mock data
        currentSemester: {
          name: semester.name,
          academicYear: semester.academicYear.name,
          registrationOpen: isRegOpen,
        },
        recentActivity: [
          { type: 'registration', message: '45 students registered for courses', time: '2 hours ago' },
          { type: 'grade', message: '12 grades submitted by lecturers', time: '5 hours ago' },
          { type: 'transcript', message: '8 transcripts generated', time: '1 day ago' },
        ],
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setStats({
      programs: 15,
      courses: 120,
      students: 1250,
      currentSemester: {
        name: 'Semester 1',
        academicYear: '2024/2025',
        registrationOpen: true,
      },
      recentActivity: [
        { type: 'registration', message: '45 students registered for courses', time: '2 hours ago' },
        { type: 'grade', message: '12 grades submitted by lecturers', time: '5 hours ago' },
        { type: 'transcript', message: '8 transcripts generated', time: '1 day ago' },
      ],
    });
  };

  const quickLinks = {
    STUDENT: [
      { title: 'Register for Courses', href: '/dashboard/academic/courses', icon: BookOpen, color: 'indigo' },
      { title: 'View GPA', href: '/dashboard/academic/gpa', icon: TrendingUp, color: 'green' },
      { title: 'My Transcripts', href: '/dashboard/academic/transcript', icon: FileText, color: 'purple' },
    ],
    TEACHER: [
      { title: 'Submit Grades', href: '/dashboard/academic/lecturer/grades', icon: CheckCircle, color: 'green' },
      { title: 'My Courses', href: '/dashboard/academic/lecturer/grades', icon: BookOpen, color: 'indigo' },
      { title: 'Student Performance', href: '/dashboard/academic/lecturer/grades', icon: BarChart, color: 'purple' },
    ],
    SCHOOL_ADMIN: [
      { title: 'Manage Programs', href: '/dashboard/academic/admin/programs', icon: GraduationCap, color: 'indigo' },
      { title: 'Manage Courses', href: '/dashboard/academic/admin/courses', icon: BookOpen, color: 'blue' },
      { title: 'Manage Semesters', href: '/dashboard/academic/admin/semesters', icon: Calendar, color: 'green' },
    ],
    SUPER_ADMIN: [
      { title: 'Manage Programs', href: '/dashboard/academic/admin/programs', icon: GraduationCap, color: 'indigo' },
      { title: 'Manage Courses', href: '/dashboard/academic/admin/courses', icon: BookOpen, color: 'blue' },
      { title: 'Manage Semesters', href: '/dashboard/academic/admin/semesters', icon: Calendar, color: 'green' },
    ],
  };

  const userQuickLinks = quickLinks[userRole as keyof typeof quickLinks] || quickLinks.STUDENT;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Academic Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome to the academic management system</p>
        </div>

        {/* Current Semester Banner */}
        {stats?.currentSemester && (
          <Card className="card-modern border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white animate-fadeIn">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{stats.currentSemester.name}</h3>
                    <p className="text-white/90">{stats.currentSemester.academicYear}</p>
                  </div>
                </div>
                <div className="text-right">
                  {stats.currentSemester.registrationOpen ? (
                    <Badge className="bg-green-500 text-white text-sm px-4 py-2">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Registration Open
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500 text-white text-sm px-4 py-2">
                      <Clock className="h-4 w-4 mr-2" />
                      Registration Closed
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-modern animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Academic Programs</p>
              <p className="text-4xl font-bold text-indigo-600 mt-2">{stats?.programs || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Active programs</p>
            </CardContent>
          </Card>

          <Card className="card-modern animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{stats?.courses || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Available courses</p>
            </CardContent>
          </Card>

          <Card className="card-modern animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{stats?.students || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Enrolled students</p>
            </CardContent>
          </Card>

          <Card className="card-modern animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Active Semester</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {stats?.currentSemester?.name || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stats?.currentSemester?.academicYear}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="card-modern animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userQuickLinks.map((link, idx) => (
                <Link key={idx} href={link.href}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-indigo-500 h-full">
                    <CardContent className="p-6">
                      <div className={`p-3 bg-gradient-to-br from-${link.color}-400 to-${link.color}-600 rounded-lg w-fit mb-4`}>
                        <link.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{link.title}</h3>
                      <p className="text-sm text-gray-600">Click to access →</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-modern animate-fadeIn" style={{ animationDelay: '600ms' }}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in the academic system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'registration' ? 'bg-blue-100' :
                    activity.type === 'grade' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'registration' && <Users className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'grade' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {activity.type === 'transcript' && <FileText className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Guide */}
        <Card className="card-modern bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200 animate-fadeIn" style={{ animationDelay: '700ms' }}>
          <CardHeader>
            <CardTitle className="text-indigo-900">Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {userRole === 'STUDENT' && (
              <>
                <p className="text-indigo-800">
                  <strong>1. Register for Courses:</strong> Browse available courses and register for your semester
                </p>
                <p className="text-indigo-800">
                  <strong>2. Track Your GPA:</strong> Monitor your academic performance and standing
                </p>
                <p className="text-indigo-800">
                  <strong>3. Generate Transcripts:</strong> Create unofficial transcripts or request official ones
                </p>
              </>
            )}
            {(userRole === 'SCHOOL_ADMIN' || userRole === 'SUPER_ADMIN') && (
              <>
                <p className="text-indigo-800">
                  <strong>1. Set Up Programs:</strong> Create and manage academic programs
                </p>
                <p className="text-indigo-800">
                  <strong>2. Add Courses:</strong> Build your course catalog with prerequisites
                </p>
                <p className="text-indigo-800">
                  <strong>3. Configure Semesters:</strong> Set up semesters with registration periods
                </p>
              </>
            )}
            {userRole === 'TEACHER' && (
              <>
                <p className="text-indigo-800">
                  <strong>1. View Your Courses:</strong> See all courses assigned to you
                </p>
                <p className="text-indigo-800">
                  <strong>2. Submit Grades:</strong> Enter CAT and exam marks for your students
                </p>
                <p className="text-indigo-800">
                  <strong>3. Track Performance:</strong> Monitor student progress and GPA
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

