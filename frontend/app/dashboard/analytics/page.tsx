'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, AlertTriangle } from 'lucide-react';

// Dynamically import charts to reduce initial bundle size
const Line = dynamic(() => import('@/components/Charts').then((mod) => mod.Line), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-lg" />,
});
const Bar = dynamic(() => import('@/components/Charts').then((mod) => mod.Bar), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-lg" />,
});
const Pie = dynamic(() => import('@/components/Charts').then((mod) => mod.Pie), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-lg" />,
});

interface Analytics {
  feeAnalytics: any;
  performanceAnalytics: any;
  attendanceAnalytics: any;
  forecast: any;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState('2024');
  const [term, setTerm] = useState('Term 1');

  useEffect(() => {
    fetchAnalytics();
  }, [academicYear, term]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { academicYear, term },
      });
      setAnalytics(response.data.detailedAnalytics);
    } catch (error: any) {
      // Fall back to demo data if backend not available
      if (!error.response || error.message === 'Network Error') {
        // Backend not running or not responding
        setAnalytics({
          feeAnalytics: {
            collectionRate: 75.8,
            totalOutstanding: 1250000,
            monthlyTrends: [
              { month: 'Jan', collected: 450000, expected: 600000 },
              { month: 'Feb', collected: 520000, expected: 650000 },
              { month: 'Mar', collected: 580000, expected: 700000 },
              { month: 'Apr', collected: 620000, expected: 750000 },
              { month: 'May', collected: 680000, expected: 800000 },
              { month: 'Jun', collected: 720000, expected: 850000 },
            ],
            paymentModeBreakdown: [
              { mode: 'M-Pesa', amount: 2250000 },
              { mode: 'Bank Transfer', amount: 1125000 },
              { mode: 'Cash', amount: 375000 },
            ],
            defaulters: [
              { studentName: 'John Doe', outstandingAmount: 45000, daysPastDue: 45 },
              { studentName: 'Jane Smith', outstandingAmount: 38000, daysPastDue: 32 },
              { studentName: 'Mike Johnson', outstandingAmount: 32000, daysPastDue: 28 },
              { studentName: 'Sarah Williams', outstandingAmount: 28000, daysPastDue: 21 },
              { studentName: 'Tom Brown', outstandingAmount: 25000, daysPastDue: 18 },
              { studentName: 'Alice Davis', outstandingAmount: 22000, daysPastDue: 15 },
              { studentName: 'Bob Wilson', outstandingAmount: 18000, daysPastDue: 12 },
              { studentName: 'Carol Moore', outstandingAmount: 15000, daysPastDue: 9 },
              { studentName: 'David Taylor', outstandingAmount: 12000, daysPastDue: 7 },
              { studentName: 'Emma Anderson', outstandingAmount: 10000, daysPastDue: 5 },
            ],
          },
          performanceAnalytics: {
            averageScore: 72.5,
            subjectAnalysis: [
              { subject: 'Mathematics', average: 75.2 },
              { subject: 'English', average: 68.8 },
              { subject: 'Science', average: 78.5 },
              { subject: 'History', average: 70.3 },
              { subject: 'Geography', average: 73.6 },
              { subject: 'Kiswahili', average: 71.9 },
            ],
          },
          attendanceAnalytics: {
            overallRate: 92.3,
            monthlyTrends: [
              { month: 'Jan', rate: 89.5 },
              { month: 'Feb', rate: 91.2 },
              { month: 'Mar', rate: 93.8 },
              { month: 'Apr', rate: 92.1 },
              { month: 'May', rate: 94.5 },
              { month: 'Jun', rate: 93.2 },
            ],
            lowAttendanceStudents: [
              { studentName: 'James Wilson', attendanceRate: 65.5, absences: 28 },
              { studentName: 'Lisa Garcia', attendanceRate: 68.2, absences: 24 },
              { studentName: 'Robert Martinez', attendanceRate: 70.8, absences: 22 },
              { studentName: 'Maria Rodriguez', attendanceRate: 72.3, absences: 20 },
              { studentName: 'Kevin Lee', attendanceRate: 74.1, absences: 18 },
              { studentName: 'Nancy White', attendanceRate: 75.6, absences: 17 },
              { studentName: 'Paul Harris', attendanceRate: 76.8, absences: 15 },
              { studentName: 'Sandra Clark', attendanceRate: 78.2, absences: 14 },
              { studentName: 'George Lewis', attendanceRate: 79.5, absences: 13 },
              { studentName: 'Betty Walker', attendanceRate: 80.1, absences: 12 },
            ],
          },
          forecast: {
            // Future forecast data
          },
        });
      } else {
        console.error('Failed to fetch analytics:', error);
      }
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

  if (!analytics) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load analytics data.</p>
      </div>
    );
  }

  // Fee Collection Chart Data
  const feeChartData = {
    labels: analytics.feeAnalytics.monthlyTrends.map((t: any) => t.month),
    datasets: [
      {
        label: 'Collected',
        data: analytics.feeAnalytics.monthlyTrends.map((t: any) => t.collected),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Expected',
        data: analytics.feeAnalytics.monthlyTrends.map((t: any) => t.expected),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Payment Mode Breakdown
  const paymentModeData = {
    labels: analytics.feeAnalytics.paymentModeBreakdown.map((p: any) => p.mode),
    datasets: [
      {
        data: analytics.feeAnalytics.paymentModeBreakdown.map((p: any) => p.amount),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Subject Performance Chart
  const subjectChartData = {
    labels: analytics.performanceAnalytics.subjectAnalysis.map((s: any) => s.subject),
    datasets: [
      {
        label: 'Average Score',
        data: analytics.performanceAnalytics.subjectAnalysis.map((s: any) => s.average),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  // Attendance Trends
  const attendanceChartData = {
    labels: analytics.attendanceAnalytics.monthlyTrends.map((t: any) => t.month),
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: analytics.attendanceAnalytics.monthlyTrends.map((t: any) => t.rate),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">Advanced Analytics</span>
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and forecasts</p>
        </div>
        <div className="flex gap-3">
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collection Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {analytics.feeAnalytics.collectionRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-3xl font-bold text-red-600">
                  KES {analytics.feeAnalytics.totalOutstanding.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {analytics.performanceAnalytics.averageScore.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-3xl font-bold text-blue-600">
                  {analytics.attendanceAnalytics.overallRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Collection Trends */}
      <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle>Fee Collection Trends (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line
              data={feeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Mode Breakdown */}
        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '600ms' }}>
          <CardHeader>
            <CardTitle>Payment Mode Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie
                data={paymentModeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '700ms' }}>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar
                data={subjectChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Trends */}
      <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '800ms' }}>
        <CardHeader>
          <CardTitle>Attendance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Line
              data={attendanceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Top Defaulters */}
      <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '900ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            Top Fee Defaulters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-modern">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Student</th>
                  <th className="text-right p-3">Outstanding</th>
                  <th className="text-right p-3">Days Overdue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.feeAnalytics.defaulters.slice(0, 10).map((d: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{d.studentName}</td>
                    <td className="text-right p-3 text-red-600 font-semibold">
                      KES {d.outstandingAmount.toLocaleString()}
                    </td>
                    <td className="text-right p-3">{d.daysPastDue} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Low Attendance Students */}
      <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '1000ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            Low Attendance Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-modern">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Student</th>
                  <th className="text-right p-3">Attendance Rate</th>
                  <th className="text-right p-3">Absences</th>
                </tr>
              </thead>
              <tbody>
                {analytics.attendanceAnalytics.lowAttendanceStudents.slice(0, 10).map((s: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{s.studentName}</td>
                    <td className="text-right p-3 text-orange-600 font-semibold">
                      {s.attendanceRate.toFixed(1)}%
                    </td>
                    <td className="text-right p-3">{s.absences}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

