'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award, TrendingUp, Users, Target } from 'lucide-react';
import axios from 'axios';

interface TeacherMetrics {
  teacherId: string;
  teacherName: string;
  classCount: number;
  studentCount: number;
  averagePerformance: number;
  attendanceRate: number;
  examsCreated: number;
  marksEntered: number;
}

export default function TeacherPerformancePage() {
  const [metrics, setMetrics] = useState<TeacherMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherMetrics();
  }, []);

  const fetchTeacherMetrics = async () => {
    try {
      setLoading(true);
      // In production, this would fetch real teacher metrics
      // For now, generate mock data
      const mockMetrics: TeacherMetrics[] = [
        {
          teacherId: '1',
          teacherName: 'John Kamau',
          classCount: 3,
          studentCount: 120,
          averagePerformance: 78.5,
          attendanceRate: 92.3,
          examsCreated: 15,
          marksEntered: 450,
        },
        {
          teacherId: '2',
          teacherName: 'Mary Wanjiku',
          classCount: 2,
          studentCount: 80,
          averagePerformance: 82.1,
          attendanceRate: 94.7,
          examsCreated: 12,
          marksEntered: 360,
        },
        {
          teacherId: '3',
          teacherName: 'David Ochieng',
          classCount: 4,
          studentCount: 160,
          averagePerformance: 75.3,
          attendanceRate: 88.9,
          examsCreated: 20,
          marksEntered: 600,
        },
      ];
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to fetch teacher metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teacher Performance Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor teacher effectiveness and productivity</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-3xl font-bold text-indigo-600">{metrics.length}</p>
              </div>
              <Users className="w-10 h-10 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-3xl font-bold text-green-600">
                  {(metrics.reduce((sum, m) => sum + m.averagePerformance, 0) / metrics.length).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <p className="text-3xl font-bold text-blue-600">
                  {(metrics.reduce((sum, m) => sum + m.attendanceRate, 0) / metrics.length).toFixed(1)}%
                </p>
              </div>
              <Target className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-3xl font-bold text-purple-600">
                  {metrics.reduce((sum, m) => sum + m.examsCreated, 0)}
                </p>
              </div>
              <Award className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Teacher Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Teacher Name</th>
                  <th className="text-center p-3">Classes</th>
                  <th className="text-center p-3">Students</th>
                  <th className="text-center p-3">Avg Performance</th>
                  <th className="text-center p-3">Attendance Rate</th>
                  <th className="text-center p-3">Exams Created</th>
                  <th className="text-center p-3">Marks Entered</th>
                  <th className="text-center p-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((teacher) => {
                  // Calculate overall rating (0-5 stars)
                  const rating = Math.round(
                    ((teacher.averagePerformance / 100 +
                      teacher.attendanceRate / 100 +
                      Math.min(teacher.examsCreated / 20, 1)) /
                      3) *
                      5
                  );

                  return (
                    <tr key={teacher.teacherId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{teacher.teacherName}</td>
                      <td className="text-center p-3">{teacher.classCount}</td>
                      <td className="text-center p-3">{teacher.studentCount}</td>
                      <td className="text-center p-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            teacher.averagePerformance >= 80
                              ? 'bg-green-100 text-green-800'
                              : teacher.averagePerformance >= 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {teacher.averagePerformance.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            teacher.attendanceRate >= 90
                              ? 'bg-green-100 text-green-800'
                              : teacher.attendanceRate >= 75
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {teacher.attendanceRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-center p-3">{teacher.examsCreated}</td>
                      <td className="text-center p-3">{teacher.marksEntered}</td>
                      <td className="text-center p-3">
                        <div className="flex justify-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics
                .sort((a, b) => b.averagePerformance - a.averagePerformance)
                .slice(0, 3)
                .map((teacher, index) => (
                  <div key={teacher.teacherId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-400 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        'bg-orange-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{teacher.teacherName}</span>
                    </div>
                    <span className="text-green-600 font-bold">{teacher.averagePerformance.toFixed(1)}%</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Needs Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics
                .filter(t => t.averagePerformance < 80 || t.attendanceRate < 90)
                .sort((a, b) => a.averagePerformance - b.averagePerformance)
                .slice(0, 3)
                .map((teacher) => (
                  <div key={teacher.teacherId} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{teacher.teacherName}</span>
                      <span className="text-red-600 font-bold">{teacher.averagePerformance.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {teacher.averagePerformance < 70 && 'Low student performance. '}
                      {teacher.attendanceRate < 90 && 'Attendance marking needs improvement. '}
                      {teacher.examsCreated < 10 && 'Create more assessments.'}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

