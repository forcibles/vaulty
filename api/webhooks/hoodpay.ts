import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'crypto';
import { getOrder, markOrderPaid } from '../../src/lib/orders';

const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || '';

// Helper to verify webhook signature
function verifyNowPaymentsSignature(payload: string, signature: string, secret: string): boolean {
  if (!secret) return true; // Skip verification if no secret configured (dev mode)

  try {
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  } catch (error) {
    console.error('[NowPayments Webhook] Signature verification error:', error);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // Log the full payload for debugging
    console.log('[NowPayments Webhook] Full payload:', JSON.stringify(body, null, 2));

    // Verify signature if IPN secret is configured
    if (ipnSecret) {
      const signature = req.headers['x-nowpayments-sig'];

      if (signature && typeof signature === 'string') {
        const rawBody = JSON.stringify(body);
        const isValid = verifyNowPaymentsSignature(rawBody, signature, ipnSecret);

        if (!isValid) {
          console.error('[NowPayments Webhook] Invalid signature');
          return res.status(401).json({ error: 'Invalid signature' });
        }
      }
    }

    // Extract order ID
    const orderId = body.order_id;

    if (!orderId) {
      console.error('[NowPayments Webhook] No order_id found in payload');
      return res.status(400).json({ error: 'No order_id found' });
    }

    console.log('[NowPayments Webhook] Order ID:', orderId);
    console.log('[NowPayments Webhook] Payment status:', body.payment_status);

    // NowPayments payment statuses:
    // waiting, confirming, confirmed, sending, partially_paid, finished, failed, refunded, expired
    const completedStatuses = ['finished', 'confirmed'];
    const isCompleted = completedStatuses.includes(body.payment_status);

    if (isCompleted) {
      const order = getOrder(orderId);

      if (order) {
        markOrderPaid(orderId);
        console.log('[NowPayments Webhook] Order paid:', orderId);
      } else {
        console.warn('[NowPayments Webhook] Order not found:', orderId);
      }
    } else {
      console.log('[NowPayments Webhook] Payment not completed yet. Status:', body.payment_status);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[NowPayments Webhook] Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Webhook processing failed',
    });
  }
}
