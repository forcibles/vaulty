import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin } from 'vite';
import Stripe from 'stripe';
import { createHmac } from 'crypto';
import {
  createOrder,
  getOrder,
  updateOrderStripeSession,
  updateOrderHoodPayId,
  markOrderPaid,
  getOrderByStripeSession,
} from './orders';
import type { OrderItem, Customer } from './orders';

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');
  res.end(JSON.stringify(body));
};

const readJsonBody = async (req: IncomingMessage): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw.trim()) return {};
  return JSON.parse(raw) as Record<string, unknown>;
};

const readRawBody = async (req: IncomingMessage): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

export const paymentApiPlugin = (env: Record<string, string>): Plugin => ({
  name: 'payment-api',
  configureServer(server) {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-12-18.acacia',
    });

    server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      // Handle CORS preflight
      if (req.method === 'OPTIONS') {
        sendJson(res, 200, {});
        return;
      }

      // 1. Create Stripe Checkout Session
      if (req.url === '/api/checkout/create-stripe-session' && req.method === 'POST') {
        try {
          const body = await readJsonBody(req);
          const { items, customer } = body as { items: OrderItem[]; customer: Customer };

          if (!items || !Array.isArray(items) || items.length === 0) {
            sendJson(res, 400, { error: 'Items are required' });
            return;
          }

          if (!customer || !customer.email || !customer.name) {
            sendJson(res, 400, { error: 'Customer information is required' });
            return;
          }

          // Create order
          const order = createOrder(items, customer, 'card');

          const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8080';

          // Create Stripe Checkout Session
          const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'], // Explicitly enable card payments
            line_items: items.map((item) => ({
              price_data: {
                currency: 'usd',
                product_data: {
                  name: item.name,
                  ...(item.image && { images: [item.image] }),
                },
                unit_amount: Math.round(item.price * 100),
              },
              quantity: item.quantity,
            })),
            client_reference_id: order.id,
            customer_email: customer.email,
            success_url: `${siteUrl}/checkout/success?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/checkout?canceled=true`,
            metadata: {
              orderId: order.id,
            },
          });

          updateOrderStripeSession(order.id, session.id);

          sendJson(res, 200, {
            orderId: order.id,
            checkoutUrl: session.url,
          });
        } catch (error) {
          console.error('[Stripe Checkout] Error:', error);
          sendJson(res, 500, {
            error: error instanceof Error ? error.message : 'Failed to create checkout session',
          });
        }
        return;
      }

      // 2. Create NowPayments Checkout Session
      if (req.url === '/api/checkout/create-hoodpay-session' && req.method === 'POST') {
        try {
          const body = await readJsonBody(req);
          const { items, customer } = body as { items: OrderItem[]; customer: Customer };

          if (!items || !Array.isArray(items) || items.length === 0) {
            sendJson(res, 400, { error: 'Items are required' });
            return;
          }

          if (!customer || !customer.email || !customer.name) {
            sendJson(res, 400, { error: 'Customer information is required' });
            return;
          }

          // Create order
          const order = createOrder(items, customer, 'crypto');

          const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8081';
          const successUrl = `${siteUrl}/checkout/success?orderId=${order.id}`;

          // Create payment via NowPayments API
          const NOWPAYMENTS_API_KEY = env.NOWPAYMENTS_API_KEY;

          console.log('[NowPayments] Starting checkout for order:', order.id);
          console.log('[NowPayments] API Key present:', !!NOWPAYMENTS_API_KEY);

          if (!NOWPAYMENTS_API_KEY) {
            sendJson(res, 500, { error: 'NowPayments API key not configured' });
            return;
          }

          try {
            // Create invoice via NowPayments API
            const response = await fetch('https://api.nowpayments.io/v1/invoice', {
              method: 'POST',
              headers: {
                'x-api-key': NOWPAYMENTS_API_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                price_amount: order.total,
                price_currency: 'usd',
                order_id: order.id,
                order_description: `Order ${order.id} - ${items.length} item(s)`,
                ipn_callback_url: `${siteUrl}/api/webhooks/nowpayments`,
                success_url: successUrl,
                cancel_url: `${siteUrl}/checkout?canceled=true`,
              }),
            });

            const data = await response.json();

            console.log('[NowPayments] Response status:', response.status);
            console.log('[NowPayments] Response data:', data);

            if (!response.ok) {
              console.error('[NowPayments] API error:', data);
              sendJson(res, response.status, {
                error: data.message || 'NowPayments API error',
                details: data,
              });
              return;
            }

            if (data.invoice_url) {
              // Save invoice ID
              if (data.id) {
                updateOrderHoodPayId(order.id, data.id.toString());
              }

              console.log('[NowPayments] SUCCESS! Invoice URL:', data.invoice_url);

              sendJson(res, 200, {
                orderId: order.id,
                checkoutUrl: data.invoice_url,
              });
            } else {
              console.error('[NowPayments] No invoice URL in response:', data);
              sendJson(res, 500, {
                error: 'Invalid response from NowPayments',
                details: data,
              });
            }
          } catch (error) {
            console.error('[NowPayments] Error:', error);
            sendJson(res, 500, {
              error: error instanceof Error ? error.message : 'Failed to create payment',
            });
          }
        } catch (error) {
          console.error('[HoodPay Checkout] Error:', error);
          sendJson(res, 500, {
            error: error instanceof Error ? error.message : 'Failed to create checkout session',
          });
        }
        return;
      }

      // 3. Get Order Status
      if (req.url?.startsWith('/api/checkout/order-status') && req.method === 'GET') {
        try {
          const url = new URL(req.url || '', 'http://localhost');
          const orderId = url.searchParams.get('orderId');

          if (!orderId) {
            sendJson(res, 400, { error: 'Order ID is required' });
            return;
          }

          const order = getOrder(orderId);

          if (!order) {
            sendJson(res, 404, { error: 'Order not found' });
            return;
          }

          sendJson(res, 200, {
            order: {
              id: order.id,
              paymentStatus: order.paymentStatus,
              total: order.total,
              items: order.items,
              customer: order.customer,
              paymentMethod: order.paymentMethod,
              createdAt: order.createdAt,
            },
          });
        } catch (error) {
          console.error('[Order Status] Error:', error);
          sendJson(res, 500, {
            error: error instanceof Error ? error.message : 'Failed to fetch order status',
          });
        }
        return;
      }

      // 4. Stripe Webhook
      if (req.url === '/api/webhooks/stripe' && req.method === 'POST') {
        try {
          const rawBody = await readRawBody(req);
          const signature = req.headers['stripe-signature'];

          if (!signature || typeof signature !== 'string') {
            console.error('[Stripe Webhook] Missing signature');
            sendJson(res, 400, { error: 'Missing stripe-signature header' });
            return;
          }

          const webhookSecret = env.STRIPE_WEBHOOK_SECRET || '';

          if (!webhookSecret) {
            console.error('[Stripe Webhook] Missing webhook secret');
            sendJson(res, 500, { error: 'Webhook secret not configured' });
            return;
          }

          let event: Stripe.Event;
          try {
            event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
          } catch (err) {
            console.error('[Stripe Webhook] Signature verification failed:', err);
            sendJson(res, 400, {
              error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
            });
            return;
          }

          if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            console.log('[Stripe Webhook] Checkout session completed:', {
              sessionId: session.id,
              clientReferenceId: session.client_reference_id,
              paymentStatus: session.payment_status,
            });

            const orderId = session.client_reference_id || session.metadata?.orderId;
            let order = null;

            if (orderId) {
              order = getOrder(orderId);
            } else {
              order = getOrderByStripeSession(session.id);
            }

            if (order) {
              markOrderPaid(order.id);
              console.log('[Stripe Webhook] Order paid:', order.id);
            } else {
              console.warn('[Stripe Webhook] Order not found for session:', session.id);
            }
          }

          sendJson(res, 200, { received: true });
        } catch (error) {
          console.error('[Stripe Webhook] Error:', error);
          sendJson(res, 500, {
            error: error instanceof Error ? error.message : 'Webhook processing failed',
          });
        }
        return;
      }

      // 5. NowPayments Webhook (IPN)
      if (req.url === '/api/webhooks/nowpayments' && req.method === 'POST') {
        try {
          const body = await readJsonBody(req);

          console.log('[NowPayments Webhook] Full payload:', JSON.stringify(body, null, 2));

          // NowPayments IPN verification (optional but recommended)
          const ipnSecret = env.NOWPAYMENTS_IPN_SECRET || '';

          if (ipnSecret) {
            const signature = req.headers['x-nowpayments-sig'];

            if (signature && typeof signature === 'string') {
              const rawBody = JSON.stringify(body);
              const expectedSignature = createHmac('sha256', ipnSecret)
                .update(rawBody)
                .digest('hex');

              if (signature !== expectedSignature) {
                console.error('[NowPayments Webhook] Invalid signature');
                sendJson(res, 401, { error: 'Invalid signature' });
                return;
              }
            }
          }

          // Extract order ID
          const orderId = body.order_id;

          if (!orderId) {
            console.error('[NowPayments Webhook] No order_id found in payload');
            sendJson(res, 400, { error: 'No order_id found' });
            return;
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

          sendJson(res, 200, { received: true });
        } catch (error) {
          console.error('[NowPayments Webhook] Error:', error);
          sendJson(res, 500, {
            error: error instanceof Error ? error.message : 'Webhook processing failed',
          });
        }
        return;
      }

      next();
    });
  },
});
