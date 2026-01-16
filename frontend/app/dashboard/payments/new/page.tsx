'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { 
  DollarSign, CreditCard, Smartphone, Building2, 
  CheckCircle, Loader2, AlertCircle, ArrowRight, ArrowLeft 
} from 'lucide-react';

type PaymentMode = 'CASH' | 'MPESA' | 'BANK';

interface StudentOption {
  id: string;
  name: string;
  admissionNumber: string;
  balance: number;
}

export default function NewPaymentPage() {
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [mpesaStatus, setMpesaStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm) {
      searchStudents();
    }
  }, [searchTerm]);

  const searchStudents = async () => {
    try {
      const response = await api.get('/students', {
        params: { search: searchTerm, limit: 10 }
      });
      
      const studentsWithBalance = await Promise.all(
        (response.data.students || []).map(async (student: any) => {
          try {
            const feeResponse = await api.get(`/fees/student/${student.id}`);
            return {
              id: student.id,
              name: `${student.firstName} ${student.lastName}`,
              admissionNumber: student.admissionNumber,
              balance: feeResponse.data.balance?.balance || 0
            };
          } catch {
            return {
              id: student.id,
              name: `${student.firstName} ${student.lastName}`,
              admissionNumber: student.admissionNumber,
              balance: 0
            };
          }
        })
      );
      
      setStudents(studentsWithBalance);
    } catch (error) {
      console.error('Failed to search students:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStudent || !amount) return;

    setLoading(true);

    try {
      const paymentData: any = {
        studentId: selectedStudent.id,
        amount: parseFloat(amount),
        paymentMode,
        paidBy: paidBy || selectedStudent.name,
        notes,
      };

      if (paymentMode === 'MPESA') {
        paymentData.phoneNumber = phoneNumber;
        setMpesaStatus('processing');
      }

      const response = await api.post('/payments', paymentData);
      setPaymentId(response.data.payment.id);

      if (paymentMode === 'MPESA') {
        // Poll for payment status
        const checkoutRequestId = response.data.checkoutRequestId;
        pollMpesaStatus(checkoutRequestId);
      } else {
        setStep(4); // Success step
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      if (paymentMode === 'MPESA') {
        setMpesaStatus('failed');
      }
      alert(error.response?.data?.error || 'Payment failed');
    } finally {
      if (paymentMode !== 'MPESA') {
        setLoading(false);
      }
    }
  };

  const pollMpesaStatus = async (checkoutRequestId: string) => {
    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await api.post('/mpesa/query', { checkoutRequestId });
        const resultCode = response.data.ResultCode;

        if (resultCode === '0') {
          clearInterval(interval);
          setMpesaStatus('success');
          setStep(4);
          setLoading(false);
        } else if (resultCode && resultCode !== '1032') {
          clearInterval(interval);
          setMpesaStatus('failed');
          setLoading(false);
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setMpesaStatus('failed');
          setLoading(false);
        }
      } catch (error) {
        // Continue polling
      }
    }, 3000);
  };

  const paymentModes = [
    {
      id: 'CASH',
      name: 'Cash',
      icon: DollarSign,
      description: 'Direct cash payment',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'MPESA',
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Mobile money (STK Push)',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'BANK',
      name: 'Bank Transfer',
      icon: Building2,
      description: 'Bank deposit or transfer',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
  ];

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Record Payment</h1>
          <p className="mt-2 text-sm text-gray-600">
            Process fee payments via Cash, M-Pesa, or Bank Transfer
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Select Student</span>
            <span>Payment Mode</span>
            <span>Details</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Step 1: Select Student */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Student</CardTitle>
              <CardDescription>Search for the student making the payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {students.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => {
                        setSelectedStudent(student);
                        setStep(2);
                      }}
                      className={`p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-colors ${
                        selectedStudent?.id === student.id ? 'border-indigo-500 bg-indigo-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.admissionNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Outstanding Balance</p>
                          <p className="text-lg font-semibold text-red-600">
                            {formatCurrency(student.balance)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Payment Mode */}
        {step === 2 && selectedStudent && (
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>
                How is {selectedStudent.name} paying?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <div
                      key={mode.id}
                      onClick={() => {
                        setPaymentMode(mode.id as PaymentMode);
                        setStep(3);
                      }}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                        paymentMode === mode.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className={`${mode.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${mode.color}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{mode.name}</h3>
                      <p className="text-sm text-gray-500">{mode.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment Details */}
        {step === 3 && selectedStudent && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Enter the payment information for {selectedStudent.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Outstanding Balance:</span>
                  <span className="text-lg font-semibold text-red-600">
                    {formatCurrency(selectedStudent.balance)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount *
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              {paymentMode === 'MPESA' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="07XX XXX XXX or 2547XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You'll receive an STK Push prompt on this number
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid By (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="Name of person making payment"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !amount || (paymentMode === 'MPESA' && !phoneNumber)}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMode === 'MPESA' ? 'Send M-Pesa Prompt' : 'Record Payment'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* M-Pesa Processing Status */}
              {paymentMode === 'MPESA' && mpesaStatus === 'processing' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    <div>
                      <p className="font-medium text-blue-900">M-Pesa Prompt Sent!</p>
                      <p className="text-sm text-blue-700">
                        Please check your phone and enter your M-Pesa PIN to complete the payment.
                        Waiting for confirmation...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMode === 'MPESA' && mpesaStatus === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Payment Failed</p>
                      <p className="text-sm text-red-700">
                        The M-Pesa payment was not completed. Please try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                The payment has been recorded successfully.
                {paymentMode === 'MPESA' && ' An SMS confirmation has been sent.'}
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-6 max-w-md mx-auto">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Student:</span>
                    <span className="font-medium">{selectedStudent?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-green-600">{formatCurrency(parseFloat(amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode:</span>
                    <span className="font-medium">{paymentMode}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                {paymentId && (
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = `/dashboard/payments/${paymentId}`}
                  >
                    View Receipt
                  </Button>
                )}
                <Button onClick={() => window.location.href = '/dashboard/payments/new'}>
                  Record Another Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

