'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { 
  Users, BookOpen, Calendar, CheckCircle, XCircle,
  Clock, Award, ClipboardList, UserCheck
} from 'lucide-react';

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalStudents: 0, presentToday: 0, absentToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesRes, attendanceRes] = await Promise.all([
        api.get('/teachers/me/classes').catch(() => ({ data: { classes: [] } })),
        api.get('/attendance/today').catch(() => ({ data: { attendance: [] } }))
      ]);

      const classesData = classesRes.data.classes || [];
      const attendanceData = attendanceRes.data.attendance || [];
      
      setClasses(classesData);
      setTodayAttendance(attendanceData);

      // Calculate stats
      const totalStudents = classesData.reduce(
        (sum: number, cls: any) => sum + (cls.students?.length || 0),
        0
      );
      const presentToday = attendanceData.filter((a: any) => a.status === 'PRESENT').length;
      const absentToday = attendanceData.filter((a: any) => a.status === 'ABSENT').length;

      setStats({ totalStudents, presentToday, absentToday });
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your classes, take attendance, and record student performance
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Students</CardTitle>
              <Users className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-gray-500 mt-1">
                Across {classes.length} classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.presentToday}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalStudents > 0 
                  ? `${Math.round((stats.presentToday / stats.totalStudents) * 100)}% attendance`
                  : '0% attendance'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absentToday}</div>
              <p className="text-xs text-gray-500 mt-1">
                Requires follow-up
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                Active classes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for teachers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="default"
                className="justify-start h-auto py-4"
                onClick={() => window.location.href = '/dashboard/attendance/mark'}
              >
                <Calendar className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Mark Attendance</p>
                  <p className="text-xs opacity-80">For today</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                onClick={() => window.location.href = '/dashboard/marks/enter'}
              >
                <Award className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Enter Marks</p>
                  <p className="text-xs">Record exam scores</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                onClick={() => window.location.href = '/dashboard/timetable'}
              >
                <Clock className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">My Timetable</p>
                  <p className="text-xs">View schedule</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                onClick={() => window.location.href = '/dashboard/reports'}
              >
                <ClipboardList className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Class Reports</p>
                  <p className="text-xs">Performance analytics</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Classes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
            <CardDescription>Classes you are teaching this term</CardDescription>
          </CardHeader>
          <CardContent>
            {classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls: any) => (
                  <div
                    key={cls.id}
                    className="border rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => window.location.href = `/dashboard/classes/${cls.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{cls.name}</h3>
                        <p className="text-sm text-gray-500">{cls.section || 'Main Section'}</p>
                      </div>
                      <Badge variant="secondary">
                        {cls.students?.length || 0} students
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      {cls.classTeacher && (
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          Class Teacher: {cls.classTeacher.user?.firstName} {cls.classTeacher.user?.lastName}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/dashboard/attendance/mark?classId=${cls.id}`;
                        }}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Attendance
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/dashboard/marks/enter?classId=${cls.id}`;
                        }}
                      >
                        <Award className="h-3 w-3 mr-1" />
                        Marks
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No classes assigned yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Contact the admin to assign classes to you
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Attendance Summary */}
        {todayAttendance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>{formatDate(new Date().toISOString())}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAttendance.slice(0, 10).map((attendance: any) => (
                  <div key={attendance.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {attendance.student?.firstName[0]}{attendance.student?.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {attendance.student?.firstName} {attendance.student?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {attendance.student?.class?.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant={attendance.status === 'PRESENT' ? 'success' : 'destructive'}>
                      {attendance.status === 'PRESENT' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {attendance.status}
                    </Badge>
                  </div>
                ))}
              </div>
              {todayAttendance.length > 10 && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => window.location.href = '/dashboard/attendance'}
                >
                  View All Attendance Records
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
