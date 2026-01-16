'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DollarSign, Search, Plus, Download, Filter, CheckCircle, Clock } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'COMPLETED' | 'PENDING' | 'FAILED'>('all');
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      const params: any = { limit: 50 };
      if (filter !== 'all') params.status = filter;

      const response = await api.get('/payments', { params });
      const paymentsData = response.data.payments || [];
      setPayments(paymentsData);

      // Calculate stats
      const total = paymentsData.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
      const completed = paymentsData
        .filter((p: any) => p.status === 'COMPLETED')
        .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
      const pending = paymentsData
        .filter((p: any) => p.status === 'PENDING')
        .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

      setStats({ total, completed, pending });
    } catch (error: any) {
      // Fall back to demo data if backend not available
      if (!error.response || error.message === 'Network Error') {
        const demoPayments = [
          {
            id: '1',
            student: { firstName: 'Alice', lastName: 'Davis', admissionNumber: 'ADM006' },
            amount: '15000',
            mode: 'MPESA',
            status: 'COMPLETED',
            paidBy: 'Alice Davis',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            student: { firstName: 'Bob', lastName: 'Wilson', admissionNumber: 'ADM007' },
            amount: '20000',
            mode: 'BANK',
            status: 'COMPLETED',
            paidBy: 'Robert Wilson',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            student: { firstName: 'Carol', lastName: 'Moore', admissionNumber: 'ADM008' },
            amount: '12000',
            mode: 'CASH',
            status: 'COMPLETED',
            paidBy: 'Carol Moore',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: '4',
            student: { firstName: 'David', lastName: 'Taylor', admissionNumber: 'ADM009' },
            amount: '18000',
            mode: 'MPESA',
            status: 'PENDING',
            paidBy: 'David Taylor',
            createdAt: new Date(Date.now() - 259200000).toISOString(),
          },
          {
            id: '5',
            student: { firstName: 'Emma', lastName: 'Anderson', admissionNumber: 'ADM010' },
            amount: '22000',
            mode: 'BANK',
            status: 'COMPLETED',
            paidBy: 'Emma Anderson',
            createdAt: new Date(Date.now() - 345600000).toISOString(),
          },
          {
            id: '6',
            student: { firstName: 'Frank', lastName: 'Thomas', admissionNumber: 'ADM011' },
            amount: '16000',
            mode: 'MPESA',
            status: 'COMPLETED',
            paidBy: 'Frank Thomas',
            createdAt: new Date(Date.now() - 432000000).toISOString(),
          },
        ];
        
        // Filter by status
        const filteredData = filter === 'all' ? demoPayments : demoPayments.filter(p => p.status === filter.toUpperCase());
        setPayments(filteredData);

        // Calculate stats
        const total = filteredData.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
        const completed = filteredData
          .filter((p: any) => p.status === 'COMPLETED')
          .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
        const pending = filteredData
          .filter((p: any) => p.status === 'PENDING')
          .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

        setStats({ total, completed, pending });
      } else {
        console.error('Failed to fetch payments:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.student?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      payment.student?.lastName.toLowerCase().includes(search.toLowerCase()) ||
      payment.student?.admissionNumber.toLowerCase().includes(search.toLowerCase()) ||
      payment.paidBy?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">Payments</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Track and manage all fee payments
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/payments/export'}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => window.location.href = '/dashboard/payments/new'}>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
              <p className="text-xs text-gray-500 mt-1">{payments.length} transactions</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.completed)}</div>
              <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pending)}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by student name, admission number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'COMPLETED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('COMPLETED')}
                >
                  Completed
                </Button>
                <Button
                  variant={filter === 'PENDING' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('PENDING')}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === 'FAILED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('FAILED')}
                >
                  Failed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading payments...</p>
            </div>
          </div>
        ) : filteredPayments.length > 0 ? (
          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full table-modern">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.student?.firstName} {payment.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.student?.admissionNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(Number(payment.amount))}
                          </div>
                          {payment.paidBy && (
                            <div className="text-xs text-gray-500">By: {payment.paidBy}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              payment.paymentMode === 'MPESA' ? 'success' :
                              payment.paymentMode === 'CASH' ? 'warning' : 'secondary'
                            }
                          >
                            {payment.paymentMode}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              payment.status === 'COMPLETED' ? 'success' :
                              payment.status === 'PENDING' ? 'warning' : 'destructive'
                            }
                          >
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.location.href = `/dashboard/payments/${payment.id}`}
                          >
                            View Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {search ? 'No payments found' : 'No payments yet'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {search ? 'Try adjusting your search terms' : 'Record your first payment to get started'}
              </p>
              {!search && (
                <Button onClick={() => window.location.href = '/dashboard/payments/new'}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

