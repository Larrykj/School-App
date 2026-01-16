'use client';

import { useState } from 'react';
import api from '@/lib/api';

interface MPesaPaymentProps {
  studentId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function MPesaPayment({ studentId, amount, onSuccess, onError }: MPesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/payments', {
        studentId,
        amount,
        paymentMode: 'MPESA',
        phoneNumber,
      });

      if (response.data.checkoutRequestId) {
        setCheckoutRequestId(response.data.checkoutRequestId);
        // Poll for payment status
        pollPaymentStatus(response.data.checkoutRequestId);
      }
    } catch (error: any) {
      onError?.(error.response?.data?.error || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (requestId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await api.post('/mpesa/query', { checkoutRequestId: requestId });
        const resultCode = response.data.ResultCode;

        if (resultCode === '0') {
          clearInterval(interval);
          onSuccess?.();
          setLoading(false);
        } else if (resultCode && resultCode !== '1032') {
          // 1032 is "Request processing" - keep polling
          clearInterval(interval);
          onError?.('Payment failed or was cancelled');
          setLoading(false);
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          onError?.('Payment timeout. Please check your phone.');
          setLoading(false);
        }
      } catch (error) {
        // Continue polling on error
      }
    }, 3000); // Poll every 3 seconds
  };

  if (checkoutRequestId) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-blue-800">
          Payment request sent! Please check your phone and enter your MPesa PIN to complete the
          payment.
        </p>
        <p className="text-sm text-blue-600 mt-2">Waiting for confirmation...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="07XXXXXXXX or 2547XXXXXXXX"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter your MPesa registered phone number
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-700">
          Amount: <span className="font-semibold">KES {amount.toLocaleString()}</span>
        </p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay with MPesa'}
      </button>
    </form>
  );
}

