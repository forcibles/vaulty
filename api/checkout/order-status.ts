import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOrder } from '../../src/lib/orders';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.query;

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = getOrder(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({
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
    console.error('Order status error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch order status',
    });
  }
}
