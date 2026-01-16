'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Search,
  Filter,
  Calendar,
  PieChart,
} from 'lucide-react';

interface FinancialSummary {
  totalRevenue: number;
  collectedAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  studentsWithBalance: number;
  studentsFullyPaid: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
}

interface RecentPayment {
  id: string;
  studentName: string;
  admissionNumber: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  date: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export default function FinanceDashboard() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('today');

  useEffect(() => {
    fetchData();
  }, [filterPeriod]);

  const fetchData = async () => {
    try {
      const [summaryRes, paymentsRes] = await Promise.all([
        api.get('/finance/summary'),
        api.get('/finance/payments/recent', { params: { period: filterPeriod } }),
      ]);

      setSummary(summaryRes.data.summary);
      setRecentPayments(paymentsRes.data.payments || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setSummary({
      totalRevenue: 4500000,
      collectedAmount: 3200000,
      pendingAmount: 1000000,
      overdueAmount: 300000,
      studentsWithBalance: 45,
      studentsFullyPaid: 155,
      thisMonthRevenue: 850000,
      lastMonthRevenue: 720000,
    });

    setRecentPayments([
      {
        id: '1',
        studentName: 'Alice Johnson',
        admissionNumber: 'BIT/2024/001',
        amount: 50000,
        paymentMethod: 'M-PESA',
        reference: 'RJ45K2LM3N',
        date: '2024-11-20T10:30:00Z',
        status: 'SUCCESS',
      },
      {
        id: '2',
        studentName: 'Bob Smith',
        admissionNumber: 'BIT/2024/002',
        amount: 25000,
        paymentMethod: 'BANK_TRANSFER',
        reference: 'BNK20241120001',
        date: '2024-11-20T09:15:00Z',
        status: 'SUCCESS',
      },
      {
        id: '3',
        studentName: 'Carol White',
        admissionNumber: 'BIT/2024/003',
        amount: 30000,
        paymentMethod: 'M-PESA',
        reference: 'RJ45K2LM3P',
        date: '2024-11-20T08:45:00Z',
        status: 'PENDING',
      },
      {
        id: '4',
        studentName: 'David Brown',
        admissionNumber: 'BIT/2024/004',
        amount: 15000,
        paymentMethod: 'CASH',
        reference: 'CSH20241120001',
        date: '2024-11-19T16:20:00Z',
        status: 'SUCCESS',
      },
      {
        id: '5',
        studentName: 'Eve Davis',
        admissionNumber: 'BIT/2024/005',
        amount: 20000,
        paymentMethod: 'M-PESA',
        reference: 'RJ45K2LM3Q',
        date: '2024-11-19T14:10:00Z',
        status: 'FAILED',
      },
    ]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      SUCCESS: { color: 'bg-green-500', icon: CheckCircle, label: 'Success' },
      PENDING: { color: 'bg-yellow-500', icon: Clock, label: 'Pending' },
      FAILED: { color: 'bg-red-500', icon: AlertCircle, label: 'Failed' },
    };

    const config = statusConfig[status] || statusConfig.SUCCESS;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig: any = {
      'M-PESA': { color: 'bg-green-600', label: 'M-PESA' },
      BANK_TRANSFER: { color: 'bg-blue-600', label: 'Bank Transfer' },
      CASH: { color: 'bg-purple-600', label: 'Cash' },
      CHEQUE: { color: 'bg-orange-600', label: 'Cheque' },
    };

    const config = methodConfig[method] || { color: 'bg-gray-600', label: method };

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const calculateGrowth = () => {
    if (!summary) return 0;
    if (summary.lastMonthRevenue === 0) return 100;
    return Math.round(
      ((summary.thisMonthRevenue - summary.lastMonthRevenue) / summary.lastMonthRevenue) * 100
    );
  };

  const filteredPayments = recentPayments.filter(
    (payment) =>
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  const growth = calculateGrowth();

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Financial Management
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive financial overview and management</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-modern bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90">Total Revenue</p>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(summary?.totalRevenue || 0)}</p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Academic Year 2024</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90">Collected</p>
                  <p className="text-3xl font-bold mt-1">
                    {formatCurrency(summary?.collectedAmount || 0)}
                  </p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span>
                  {summary &&
                    Math.round((summary.collectedAmount / summary.totalRevenue) * 100)}
                  % of total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90">Pending</p>
                  <p className="text-3xl font-bold mt-1">
                    {formatCurrency(summary?.pendingAmount || 0)}
                  </p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span>{summary?.studentsWithBalance || 0} students</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-gradient-to-br from-red-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90">Overdue</p>
                  <p className="text-3xl font-bold mt-1">
                    {formatCurrency(summary?.overdueAmount || 0)}
                  </p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <AlertCircle className="h-8 w-8" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span>Requires attention</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">This Month Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(summary?.thisMonthRevenue || 0)}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-500" />
              </div>
              <div className="flex items-center">
                {growth >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-semibold">+{growth}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600 font-semibold">{growth}%</span>
                  </>
                )}
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Fully Paid Students</p>
                  <p className="text-2xl font-bold text-gray-900">{summary?.studentsFullyPaid || 0}</p>
                </div>
                <Users className="h-10 w-10 text-green-500" />
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-gray-600">
                  {summary &&
                    Math.round(
                      (summary.studentsFullyPaid /
                        (summary.studentsFullyPaid + summary.studentsWithBalance)) *
                        100
                    )}
                  % completion rate
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Students With Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summary?.studentsWithBalance || 0}
                  </p>
                </div>
                <AlertCircle className="h-10 w-10 text-orange-500" />
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-sm text-gray-600">Pending payments</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="card-modern">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, admission number, or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={filterPeriod === 'today' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPeriod('today')}
                >
                  Today
                </Button>
                <Button
                  variant={filterPeriod === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPeriod('week')}
                >
                  This Week
                </Button>
                <Button
                  variant={filterPeriod === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPeriod('month')}
                >
                  This Month
                </Button>
                <Button
                  variant={filterPeriod === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPeriod('all')}
                >
                  All Time
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="card-modern">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest payment transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>No payments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left p-3 font-semibold text-gray-700">Date & Time</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Student</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Adm. Number</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Amount</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Method</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Reference</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Status</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment, idx) => (
                      <tr
                        key={payment.id}
                        className="border-b hover:bg-gray-50 transition-colors animate-fadeIn"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <td className="p-3 text-sm">
                          {new Date(payment.date).toLocaleString('en-KE', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="p-3 font-medium">{payment.studentName}</td>
                        <td className="p-3 font-mono text-sm">{payment.admissionNumber}</td>
                        <td className="p-3 text-right font-bold text-green-600">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="p-3 text-center">{getPaymentMethodBadge(payment.paymentMethod)}</td>
                        <td className="p-3 font-mono text-sm text-gray-600">{payment.reference}</td>
                        <td className="p-3 text-center">{getStatusBadge(payment.status)}</td>
                        <td className="p-3 text-center">
                          <Button variant="outline" size="sm">
                            Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-modern cursor-pointer hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fee Structures</h3>
              <p className="text-sm text-gray-600">Manage fee structures</p>
            </CardContent>
          </Card>

          <Card className="card-modern cursor-pointer hover:shadow-xl transition-all bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Student Balances</h3>
              <p className="text-sm text-gray-600">View all balances</p>
            </CardContent>
          </Card>

          <Card className="card-modern cursor-pointer hover:shadow-xl transition-all bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <PieChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Reports</h3>
              <p className="text-sm text-gray-600">Financial reports</p>
            </CardContent>
          </Card>

          <Card className="card-modern cursor-pointer hover:shadow-xl transition-all bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Payment Plans</h3>
              <p className="text-sm text-gray-600">Manage installments</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

