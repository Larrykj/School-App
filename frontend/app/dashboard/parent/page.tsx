'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  User, DollarSign, TrendingUp, Calendar, AlertCircle, 
  FileText, BookOpen, Award, Phone, MapPin 
} from 'lucide-react';

export default function ParentDashboard() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [feeBalance, setFeeBalance] = useState<any>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildData(selectedChild.id);
    }
  }, [selectedChild]);

  const fetchData = async () => {
    try {
      const response = await api.get('/parents/me/children');
      const childrenData = response.data.children || [];
      setChildren(childrenData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
    } catch (error) {
      console.error('Failed to fetch children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildData = async (studentId: string) => {
    try {
      const [feeRes, paymentsRes, attendanceRes, performanceRes] = await Promise.all([
        api.get(`/fees/student/${studentId}`).catch(() => ({ data: {} })),
        api.get(`/payments?studentId=${studentId}&limit=5`).catch(() => ({ data: { payments: [] } })),
        api.get(`/attendance/student/${studentId}/summary`).catch(() => ({ data: {} })),
        api.get(`/students/${studentId}/performance`).catch(() => ({ data: { marks: [] } }))
      ]);

      setFeeBalance(feeRes.data.balance);
      setRecentPayments(paymentsRes.data.payments || []);
      setAttendance(attendanceRes.data.summary);
      setPerformance(performanceRes.data.marks || []);
    } catch (error) {
      console.error('Failed to fetch child data:', error);
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

  if (children.length === 0) {
    return (
      <Layout>
        <Card className="max-w-lg mx-auto mt-12">
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">No Children Registered</p>
            <p className="text-sm text-gray-500">
              Please contact the school to link your children to your account.
            </p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Monitor your child's academic progress, fees, and attendance
          </p>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {children.map((child: any) => (
                <Button
                  key={child.id}
                  variant={selectedChild?.id === child.id ? 'default' : 'outline'}
                  onClick={() => setSelectedChild(child)}
                  className="whitespace-nowrap"
                >
                  {child.firstName} {child.lastName}
                  {child.class && ` (${child.class.name})`}
                </Button>
              ))}
            </div>
          </div>
        )}

        {selectedChild && (
          <>
            {/* Student Info Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {selectedChild.firstName[0]}{selectedChild.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedChild.firstName} {selectedChild.lastName}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">
                        {selectedChild.admissionNumber}
                      </Badge>
                      {selectedChild.class && (
                        <Badge variant="secondary">
                          {selectedChild.class.name}
                        </Badge>
                      )}
                      <Badge variant="success">
                        {selectedChild.gender}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Fee Balance */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fee Balance</CardTitle>
                  <DollarSign className={`h-4 w-4 ${
                    feeBalance?.balance > 0 ? 'text-red-500' : 'text-green-500'
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    feeBalance?.balance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(feeBalance?.balance || 0)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {feeBalance?.balance > 0 ? 'Outstanding' : 'Fully Paid'}
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => window.location.href = '/dashboard/payments/new'}
                  >
                    Make Payment
                  </Button>
                </CardContent>
              </Card>

              {/* Attendance */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {attendance?.attendanceRate || 0}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {attendance?.totalPresent || 0} of {attendance?.totalDays || 0} days
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${attendance?.attendanceRate || 0}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Performance */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {performance.length > 0
                      ? Math.round(
                          performance.reduce((sum: number, p: any) => sum + (p.marks || 0), 0) /
                            performance.length
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {performance.length} subjects
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => window.location.href = `/dashboard/students/${selectedChild.id}/performance`}
                  >
                    View Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Payments */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest fee payments made</CardDescription>
              </CardHeader>
              <CardContent>
                {recentPayments.length > 0 ? (
                  <div className="space-y-4">
                    {recentPayments.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(Number(payment.amount))}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(payment.paymentDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            payment.paymentMode === 'MPESA' ? 'success' :
                            payment.paymentMode === 'CASH' ? 'warning' : 'secondary'
                          }>
                            {payment.paymentMode}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {payment.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No payments yet</p>
                )}
              </CardContent>
            </Card>

            {/* Academic Performance Breakdown */}
            {performance.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>Subject-wise scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performance.slice(0, 5).map((mark: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{mark.subject || 'Subject'}</span>
                          <span className="text-sm font-semibold">
                            {mark.marks}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              mark.marks >= 75 ? 'bg-green-500' :
                              mark.marks >= 50 ? 'bg-blue-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${mark.marks}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {performance.length > 5 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => window.location.href = `/dashboard/students/${selectedChild.id}/performance`}
                    >
                      View All Subjects
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.location.href = '/dashboard/payments/new'}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Make Payment
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.location.href = `/dashboard/students/${selectedChild.id}/attendance`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Attendance
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.location.href = `/dashboard/students/${selectedChild.id}/performance`}
                >
                  <Award className="h-4 w-4 mr-2" />
                  View Report Card
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
