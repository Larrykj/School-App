import axios from 'axios';
import crypto from 'crypto';
import prisma from '../utils/prisma';
import { Decimal } from '@prisma/client/runtime/library';

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const SHORTCODE = process.env.MPESA_SHORTCODE || '';
const PASSKEY = process.env.MPESA_PASSKEY || '';
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || '';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

export class MpesaService {
  /**
   * Get access token
   */
  private static async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    try {
      const response = await axios.get(
        `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      console.error('MPesa token error:', error);
      throw new Error('Failed to get MPesa access token');
    }
  }

  /**
   * Generate password for STK Push
   */
  private static generatePassword(): string {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
    return password;
  }

  /**
   * Generate timestamp
   */
  private static generateTimestamp(): string {
    return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  }

  /**
   * Initiate STK Push
   */
  static async initiateSTKPush(
    phoneNumber: string,
    amount: number,
    accountReference: string,
    transactionDesc: string
  ): Promise<{ checkoutRequestId: string; merchantRequestId: string }> {
    const accessToken = await this.getAccessToken();
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword();

    // Format phone number (254XXXXXXXXX)
    const formattedPhone = phoneNumber.startsWith('0')
      ? `254${phoneNumber.substring(1)}`
      : phoneNumber.startsWith('254')
      ? phoneNumber
      : `254${phoneNumber}`;

    const requestBody = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
      };
    } catch (error: any) {
      console.error('STK Push error:', error.response?.data || error.message);
      throw new Error('Failed to initiate STK Push');
    }
  }

  /**
   * Query transaction status
   */
  static async queryTransactionStatus(checkoutRequestId: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword();

    const requestBody = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Query transaction error:', error.response?.data || error.message);
      throw new Error('Failed to query transaction status');
    }
  }

  /**
   * Handle MPesa callback
   */
  static async handleCallback(callbackData: any): Promise<void> {
    const {
      Body: {
        stkCallback: {
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata,
        },
      },
    } = callbackData;

    // Find transaction
    const transaction = await prisma.mpesaTransaction.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
      include: { payment: true },
    });

    if (!transaction) {
      console.error('Transaction not found:', CheckoutRequestID);
      return;
    }

    const status = ResultCode === 0 ? 'COMPLETED' : 'FAILED';
    let mpesaReceiptNumber = null;
    let transactionDate = null;

    if (ResultCode === 0 && CallbackMetadata?.Item) {
      const items = CallbackMetadata.Item;
      const receiptItem = items.find((item: any) => item.Name === 'MpesaReceiptNumber');
      const dateItem = items.find((item: any) => item.Name === 'TransactionDate');

      if (receiptItem) mpesaReceiptNumber = receiptItem.Value;
      if (dateItem) {
        const dateStr = dateItem.Value.toString();
        transactionDate = new Date(
          parseInt(dateStr.substring(0, 4)),
          parseInt(dateStr.substring(4, 6)) - 1,
          parseInt(dateStr.substring(6, 8)),
          parseInt(dateStr.substring(8, 10)),
          parseInt(dateStr.substring(10, 12)),
          parseInt(dateStr.substring(12, 14))
        );
      }
    }

    // Update transaction
    await prisma.mpesaTransaction.update({
      where: { id: transaction.id },
      data: {
        resultCode: ResultCode?.toString(),
        resultDesc: ResultDesc,
        status,
        mpesaReceiptNumber,
        transactionDate,
      },
    });

    // Update payment status
    if (status === 'COMPLETED') {
      await prisma.payment.update({
        where: { id: transaction.paymentId },
        data: {
          status: 'COMPLETED',
          reference: mpesaReceiptNumber,
        },
      });

      // Apply payment to fees
      const payment = await prisma.payment.findUnique({
        where: { id: transaction.paymentId },
      });

      if (payment) {
        const feeService = await import('./feeService');
        await feeService.FeeService.applyPayment(
          payment.studentId,
          Number(payment.amount),
          payment.id
        );
      }
    } else {
      await prisma.payment.update({
        where: { id: transaction.paymentId },
        data: { status: 'FAILED' },
      });
    }
  }
}

