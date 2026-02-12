import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { getOrderByStripeSession, markOrderPaid } from '../../src/lib/orders';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, need raw body for signature verification
  },
};

// Helper to read raw body as buffer
async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'];

    if (!signature || typeof signature !== 'string') {
      console.error('[Stripe Webhook] Missing signature');
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    if (!webhookSecret) {
      console.error('[Stripe Webhook] Missing webhook secret');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error('[Stripe Webhook] Signature verification failed:', err);
      return res.status(400).json({
        error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('[Stripe Webhook] Checkout session completed:', {
        sessionId: session.id,
        clientReferenceId: session.client_reference_id,
        paymentStatus: session.payment_status,
      });

      // Get order by client_reference_id or session.id
      const orderId = session.client_reference_id || session.metadata?.orderId;
      let order = null;

      if (orderId) {
        const { getOrder } = await import('../../src/lib/orders');
        order = getOrder(orderId);
      } else {
        // Fallback: find by session ID
        order = getOrderByStripeSession(session.id);
      }

      if (order) {
        markOrderPaid(order.id);
        console.log('[Stripe Webhook] Order paid:', order.id);
      } else {
        console.warn('[Stripe Webhook] Order not found for session:', session.id);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Webhook processing failed',
    });
  }
}
