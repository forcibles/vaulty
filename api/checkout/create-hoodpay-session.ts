import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createOrder, updateOrderHoodPayId } from '../../src/lib/orders';
import type { OrderItem, Customer } from '../../src/lib/orders';

// NowPayments API configuration
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1/invoice';
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;

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
    const order = createOrder(items, customer, 'crypto');

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8081';
    const successUrl = `${siteUrl}/checkout/success?orderId=${order.id}`;

    if (!NOWPAYMENTS_API_KEY) {
      return res.status(500).json({ error: 'NowPayments API key not configured' });
    }

    // Create invoice via NowPayments API
    try {
      const response = await fetch(NOWPAYMENTS_API_URL, {
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

      if (!response.ok) {
        console.error('[NowPayments] API error:', data);
        return res.status(response.status).json({
          error: data.message || 'NowPayments API error',
          details: data,
        });
      }

      if (data.invoice_url) {
        // Save invoice ID
        if (data.id) {
          updateOrderHoodPayId(order.id, data.id.toString());
        }

        console.log('[NowPayments] SUCCESS! Invoice URL:', data.invoice_url);

        return res.status(200).json({
          orderId: order.id,
          checkoutUrl: data.invoice_url,
        });
      } else {
        console.error('[NowPayments] No invoice URL in response:', data);
        return res.status(500).json({
          error: 'Invalid response from NowPayments',
          details: data,
        });
      }
    } catch (apiError) {
      console.error('[NowPayments] Error:', apiError);
      return res.status(500).json({
        error: apiError instanceof Error ? apiError.message : 'Failed to create payment',
      });
    }
  } catch (error) {
    console.error('HoodPay checkout error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    });
  }
}
