'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Users, DollarSign, AlertCircle, TrendingUp, 
  Calendar, BookOpen, Bus, Home 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error: any) {
      // Fall back to demo data if backend not available
      if (!error.response || error.message === 'Network Error') {
        setStats({
          stats: {
            totalStudents: 450,
            activeStudents: 445,
            outstandingBalance: 1250000,
            totalStaff: 45,
            recentPayments: 127,
          },
          defaulters: [
            { id: '1', student: { firstName: 'John', lastName: 'Doe', admissionNumber: 'ADM001' }, balance: '45000' },
            { id: '2', student: { firstName: 'Jane', lastName: 'Smith', admissionNumber: 'ADM002' }, balance: '38000' },
            { id: '3', student: { firstName: 'Mike', lastName: 'Johnson', admissionNumber: 'ADM003' }, balance: '32000' },
            { id: '4', student: { firstName: 'Sarah', lastName: 'Williams', admissionNumber: 'ADM004' }, balance: '28000' },
            { id: '5', student: { firstName: 'Tom', lastName: 'Brown', admissionNumber: 'ADM005' }, balance: '25000' },
          ],
          recentPayments: [
            { id: '1', student: { firstName: 'Alice', lastName: 'Davis' }, amount: '15000', mode: 'MPESA', createdAt: new Date().toISOString() },
            { id: '2', student: { firstName: 'Bob', lastName: 'Wilson' }, amount: '20000', mode: 'BANK', createdAt: new Date(Date.now() - 86400000).toISOString() },
            { id: '3', student: { firstName: 'Carol', lastName: 'Moore' }, amount: '12000', mode: 'CASH', createdAt: new Date(Date.now() - 172800000).toISOString() },
            { id: '4', student: { firstName: 'David', lastName: 'Taylor' }, amount: '18000', mode: 'MPESA', createdAt: new Date(Date.now() - 259200000).toISOString() },
            { id: '5', student: { firstName: 'Emma', lastName: 'Anderson' }, amount: '22000', mode: 'BANK', createdAt: new Date(Date.now() - 345600000).toISOString() },
          ],
        });
      } else {
        console.error('Failed to fetch dashboard data:', error);
      }
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
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.stats?.totalStudents || 0,
      subtitle: `${stats?.stats?.activeStudents || 0} active`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/dashboard/students',
    },
    {
      title: 'Outstanding Fees',
      value: formatCurrency(stats?.stats?.outstandingBalance || 0),
      subtitle: 'Total fees due',
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/dashboard/fees',
    },
    {
      title: 'Staff Members',
      value: stats?.stats?.totalStaff || 0,
      subtitle: 'Teachers & Admin',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/dashboard/staff',
    },
    {
      title: 'Recent Payments',
      value: stats?.stats?.recentPayments || 0,
      subtitle: 'Last 30 days',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/dashboard/payments',
    },
  ];

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-gradient">School Dashboard</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Here's what's happening in your school today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat, index) => (
            <Card 
              key={index} 
              className={`card-modern cursor-pointer border-0 ${index === 0 ? 'animate-fadeIn' : `animate-fadeIn animation-delay-${index * 2000}`}`} // staggering isn't perfect with just css classes, but fadeIn works
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => window.location.href = stat.href}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg shadow-sm`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600 mt-2">Overview of fees and payments status</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Defaulters */}
            <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2.5 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-sm">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      Top Fee Defaulters
                    </CardTitle>
                    <CardDescription className="mt-2">Students with highest outstanding balances</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/fees'}>
                    View All
                  </Button>
                </div>
              </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.topDefaulters?.slice(0, 5).map((defaulter: any, index: number) => (
                  <div key={defaulter.studentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-red-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{defaulter.name}</p>
                        <p className="text-sm text-gray-500">{defaulter.admissionNumber}</p>
                      </div>
                    </div>
                    <Badge variant="destructive">{formatCurrency(defaulter.balance)}</Badge>
                  </div>
                ))}
                {(!stats?.topDefaulters || stats.topDefaulters.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No fee defaulters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

            {/* Recent Payments */}
            <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '500ms' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2.5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      Recent Payments
                    </CardTitle>
                    <CardDescription className="mt-2">Latest fee payments received</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/payments'}>
                    View All
                  </Button>
                </div>
              </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentPayments?.slice(0, 5).map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {payment.student?.firstName} {payment.student?.lastName}
                        </p>
                        <Badge variant={payment.paymentMode === 'MPESA' ? 'success' : 'secondary'} className="text-xs">
                          {payment.paymentMode}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(payment.createdAt)}</p>
                    </div>
                    <p className="font-semibold text-green-600">{formatCurrency(Number(payment.amount))}</p>
                  </div>
                ))}
                {(!stats?.recentPayments || stats.recentPayments.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No recent payments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 animate-fadeIn" style={{ animationDelay: '600ms' }}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-600 mt-2">Frequently used features for quick access</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Button 
              variant="outline" 
              className="h-32 flex-col gap-3 card-modern border-0 hover:scale-105 transition-transform"
              onClick={() => window.location.href = '/dashboard/students/new'}
            >
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <span className="font-semibold text-base">Add Student</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-32 flex-col gap-3 card-modern border-0 hover:scale-105 transition-transform"
              onClick={() => window.location.href = '/dashboard/payments/new'}
            >
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
              <span className="font-semibold text-base">Record Payment</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-32 flex-col gap-3 card-modern border-0 hover:scale-105 transition-transform"
              onClick={() => window.location.href = '/dashboard/fees'}
            >
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm">
                <BookOpen className="h-7 w-7 text-purple-600" />
              </div>
              <span className="font-semibold text-base">Fee Structure</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-32 flex-col gap-3 card-modern border-0 hover:scale-105 transition-transform"
              onClick={() => window.location.href = '/dashboard/reports'}
            >
              <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-sm">
                <TrendingUp className="h-7 w-7 text-orange-600" />
              </div>
              <span className="font-semibold text-base">Reports</span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
