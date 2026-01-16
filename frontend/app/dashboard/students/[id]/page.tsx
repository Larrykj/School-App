'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import {
  User,
  FileText,
  CreditCard,
  BookOpen,
  DollarSign,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  class?: { name: string };
  program?: { name: string };
}

export default function StudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      const response = await api.get(`/students/${studentId}/profile`);
      setStudent(response.data.student);
    } catch (error) {
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setStudent({
      id: studentId,
      admissionNumber: 'BIT/2024/001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      class: { name: 'BIT Year 1' },
      program: { name: 'Bachelor of Information Technology' },
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  const quickLinks = [
    {
      title: 'View Profile',
      description: 'View and edit student profile information',
      icon: User,
      href: `/dashboard/students/${studentId}/profile`,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Documents',
      description: 'Upload and manage student documents',
      icon: FileText,
      href: `/dashboard/students/${studentId}/documents`,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'ID Card',
      description: 'Generate and print student ID card',
      icon: CreditCard,
      href: `/dashboard/students/${studentId}/id-card`,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Academic Records',
      description: 'View courses, grades, and GPA',
      icon: BookOpen,
      href: '/dashboard/academic/gpa',
      color: 'from-orange-500 to-red-600',
    },
    {
      title: 'Fee Statement',
      description: 'View fee balance and payment history',
      icon: DollarSign,
      href: '/dashboard/finance',
      color: 'from-teal-500 to-cyan-600',
    },
    {
      title: 'Exam Results',
      description: 'View examination results and performance',
      icon: GraduationCap,
      href: '/dashboard/exams',
      color: 'from-indigo-500 to-blue-600',
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            {student?.firstName} {student?.lastName} - {student?.admissionNumber}
          </p>
          <p className="text-sm text-gray-500">
            {student?.program?.name || student?.class?.name}
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <Card
                key={idx}
                className="card-modern cursor-pointer hover:shadow-xl transition-all group animate-fadeIn"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => router.push(link.href)}
              >
                <CardContent className="p-6">
                  <div className={`p-4 bg-gradient-to-r ${link.color} rounded-lg mb-4 inline-block`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{link.description}</p>
                  <div className="flex items-center text-indigo-600 text-sm font-semibold">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Student Info Card */}
        <Card className="card-modern bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Quick overview of student details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Admission Number</p>
                <p className="text-lg font-bold text-indigo-600">{student?.admissionNumber}</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm font-semibold text-gray-900">{student?.email}</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Program</p>
                <p className="text-sm font-semibold text-gray-900">
                  {student?.program?.name || student?.class?.name || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

