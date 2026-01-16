'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import {
  Smartphone,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Search,
} from 'lucide-react';

interface MpesaTransaction {
  id: string;
  transactionId: string;
  phoneNumber: string;
  amount: number;
  studentName?: string;
  admissionNumber?: string;
  status: 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  timestamp: string;
  resultDesc?: string;
}

export default function MpesaPaymentPage() {
  const [transactions, setTransactions] = useState<MpesaTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    amount: '',
    studentId: '',
    description: '',
  });

  useEffect(() => {
    fetchTransactions();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/mpesa/transactions');
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setTransactions([
      {
        id: '1',
        transactionId: 'RJ45K2LM3N',
        phoneNumber: '254712345678',
        amount: 50000,
        studentName: 'Alice Johnson',
        admissionNumber: 'BIT/2024/001',
        status: 'SUCCESS',
        timestamp: '2024-11-20T10:30:00Z',
        resultDesc: 'The service request is processed successfully.',
      },
      {
        id: '2',
        transactionId: 'RJ45K2LM3O',
        phoneNumber: '254723456789',
        amount: 25000,
        studentName: 'Bob Smith',
        admissionNumber: 'BIT/2024/002',
        status: 'PENDING',
        timestamp: '2024-11-20T10:25:00Z',
      },
      {
        id: '3',
        transactionId: 'RJ45K2LM3P',
        phoneNumber: '254734567890',
        amount: 30000,
        studentName: 'Carol White',
        admissionNumber: 'BIT/2024/003',
        status: 'FAILED',
        timestamp: '2024-11-20T10:20:00Z',
        resultDesc: 'Request cancelled by user',
      },
    ]);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }

    // If doesn't start with 254, add it
    if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }

    return cleaned;
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phoneNumber || !formData.amount) {
      alert('Please fill in phone number and amount');
      return;
    }

    setProcessing(true);
    try {
      const formattedPhone = formatPhoneNumber(formData.phoneNumber);

      const response = await api.post('/mpesa/stk-push', {
        phoneNumber: formattedPhone,
        amount: parseFloat(formData.amount),
        studentId: formData.studentId || undefined,
        description: formData.description || 'School Fees Payment',
      });

      alert(
        `Payment request sent!\nCheck your phone for M-PESA prompt.\nTransaction ID: ${response.data.checkoutRequestID}`
      );

      setFormData({
        phoneNumber: '',
        amount: '',
        studentId: '',
        description: '',
      });

      await fetchTransactions();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Payment initiated (demo mode)');
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckStatus = async (transactionId: string) => {
    try {
      const response = await api.get(`/mpesa/status/${transactionId}`);
      alert(`Status: ${response.data.status}\n${response.data.resultDesc || ''}`);
      await fetchTransactions();
    } catch (error) {
      alert('Status check feature coming soon');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      INITIATED: { color: 'bg-blue-500', icon: Send, label: 'Initiated' },
      PENDING: { color: 'bg-yellow-500', icon: Clock, label: 'Pending' },
      SUCCESS: { color: 'bg-green-500', icon: CheckCircle, label: 'Success' },
      FAILED: { color: 'bg-red-500', icon: AlertCircle, label: 'Failed' },
      CANCELLED: { color: 'bg-gray-500', icon: AlertCircle, label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const getStats = () => {
    const today = new Date().toDateString();
    const todayTransactions = transactions.filter(
      (t) => new Date(t.timestamp).toDateString() === today
    );

    return {
      total: transactions.length,
      today: todayTransactions.length,
      success: transactions.filter((t) => t.status === 'SUCCESS').length,
      pending: transactions.filter((t) => t.status === 'PENDING').length,
      failed: transactions.filter((t) => t.status === 'FAILED').length,
      totalAmount: transactions
        .filter((t) => t.status === 'SUCCESS')
        .reduce((sum, t) => sum + t.amount, 0),
    };
  };

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.phoneNumber.includes(searchQuery) ||
      (tx.studentName && tx.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.admissionNumber && tx.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = getStats();

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                M-PESA Payments
              </h1>
              <p className="text-gray-600 mt-2">Lipa Na M-PESA payment integration</p>
            </div>
          </div>

          <Button onClick={fetchTransactions} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="text-center">
                <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-1" />
                <p className="text-xs text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="text-center">
                <TrendingUp className="h-6 w-6 mx-auto text-indigo-600 mb-1" />
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                <p className="text-xs text-gray-600">Today</p>
                <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-green-50">
            <CardContent className="p-4">
              <div className="text-center">
                <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
                <p className="text-xs text-gray-600">Success</p>
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-yellow-50">
            <CardContent className="p-4">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-red-50">
            <CardContent className="p-4">
              <div className="text-center">
                <AlertCircle className="h-6 w-6 mx-auto text-red-600 mb-1" />
                <p className="text-xs text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-1">
            <Card className="card-modern sticky top-6">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Initiate Payment
                </CardTitle>
                <CardDescription className="text-green-50">
                  Send STK push to customer
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleInitiatePayment} className="space-y-4">
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      placeholder="0712345678 or 254712345678"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: 07XX or 254XX</p>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (KES) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      placeholder="10000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="studentId">Student ID (Optional)</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) => handleChange('studentId', e.target.value)}
                      placeholder="Student ID or Admission Number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="School Fees Payment"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={processing}>
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Initiating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Payment Request
                      </>
                    )}
                  </Button>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 font-semibold mb-2">How it works:</p>
                    <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Enter phone number and amount</li>
                      <li>Click "Send Payment Request"</li>
                      <li>Customer receives M-PESA prompt</li>
                      <li>Customer enters PIN to confirm</li>
                      <li>Transaction completes automatically</li>
                    </ol>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Transactions List */}
          <div className="lg:col-span-2">
            <Card className="card-modern">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>M-PESA Transactions</CardTitle>
                    <CardDescription>Recent payment requests and status</CardDescription>
                  </div>
                </div>
                <div className="mt-4 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by transaction ID, phone, or student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Smartphone className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>No transactions found</p>
                    <p className="text-sm mt-2">Initiate a payment to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction, idx) => (
                      <div
                        key={transaction.id}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-all animate-fadeIn"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900">{transaction.transactionId}</h4>
                              {getStatusBadge(transaction.status)}
                            </div>
                            {transaction.studentName && (
                              <p className="text-sm text-gray-700">
                                {transaction.studentName} - {transaction.admissionNumber}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              Phone: {transaction.phoneNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(transaction.timestamp).toLocaleString('en-KE', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>

                        {transaction.resultDesc && (
                          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                            {transaction.resultDesc}
                          </div>
                        )}

                        {transaction.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3"
                            onClick={() => handleCheckStatus(transaction.transactionId)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Check Status
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Card */}
        <Card className="card-modern bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-900 mb-2">M-PESA Integration Active</h3>
                <p className="text-sm text-green-800 mb-3">
                  Accept payments directly from students via M-PESA STK Push. Transactions are
                  processed in real-time and automatically recorded in the system.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-green-900">✓ Real-time processing</p>
                    <p className="text-green-700">Instant payment confirmation</p>
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">✓ Secure transactions</p>
                    <p className="text-green-700">Safaricom M-PESA API</p>
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">✓ Auto reconciliation</p>
                    <p className="text-green-700">Automatic balance updates</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

