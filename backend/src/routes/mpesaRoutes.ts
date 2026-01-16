import { Router } from 'express';
import { MpesaService } from '../services/mpesaService';

const router = Router();

// MPesa webhook callback
router.post('/callback', async (req, res) => {
  try {
    const callbackData = req.body;
    await MpesaService.handleCallback(callbackData);
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error: any) {
    console.error('MPesa callback error:', error);
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Error processing callback' });
  }
});

// Query transaction status
router.post('/query', async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;
    const result = await MpesaService.queryTransactionStatus(checkoutRequestId);
    res.json(result);
  } catch (error: any) {
    console.error('Query transaction error:', error);
    res.status(500).json({ error: 'Failed to query transaction' });
  }
});

export default router;

