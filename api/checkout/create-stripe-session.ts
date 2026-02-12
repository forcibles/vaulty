import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createOrder, updateOrderStripeSession } from '../../src/lib/orders';
import type { OrderItem, Customer } from '../../src/lib/orders';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customer } = req.body as {
      items: OrderItem[];
      customer: Customer;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!customer || !customer.email || !customer.name) {
      return res.status(400).json({ error: 'Customer information is required' });
    }

    // Create order in our system
    const order = createOrder(items, customer, 'card');

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8080';

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
          unit_amount: Math.round(item.price * 100), // Convert to cents
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

    // Save Stripe session ID to order
    updateOrderStripeSession(order.id, session.id);

    return res.status(200).json({
      orderId: order.id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    });
  }
}
