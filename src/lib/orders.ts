import { nanoid } from 'nanoid';

// Types
export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

export type Customer = {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  customer: Customer;
  total: number;
  paymentMethod: 'card' | 'crypto';
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripeSessionId?: string;
  hoodpayPaymentId?: string;
  createdAt: Date;
};

// In-memory storage (will be replaced with a database later)
const orders = new Map<string, Order>();

// Functions
export function createOrder(
  items: OrderItem[],
  customer: Customer,
  paymentMethod: 'card' | 'crypto'
): Order {
  const id = nanoid(12);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order: Order = {
    id,
    items,
    customer,
    total,
    paymentMethod,
    paymentStatus: 'pending',
    createdAt: new Date(),
  };

  orders.set(id, order);
  return order;
}

export function getOrder(id: string): Order | null {
  return orders.get(id) || null;
}

export function getOrderByStripeSession(sessionId: string): Order | null {
  for (const order of orders.values()) {
    if (order.stripeSessionId === sessionId) {
      return order;
    }
  }
  return null;
}

export function getOrderByHoodPayId(paymentId: string): Order | null {
  for (const order of orders.values()) {
    if (order.hoodpayPaymentId === paymentId) {
      return order;
    }
  }
  return null;
}

export function markOrderPaid(id: string): void {
  const order = orders.get(id);
  if (order) {
    order.paymentStatus = 'paid';
    orders.set(id, order);
  }
}

export function markOrderFailed(id: string): void {
  const order = orders.get(id);
  if (order) {
    order.paymentStatus = 'failed';
    orders.set(id, order);
  }
}

export function updateOrderStripeSession(id: string, sessionId: string): void {
  const order = orders.get(id);
  if (order) {
    order.stripeSessionId = sessionId;
    orders.set(id, order);
  }
}

export function updateOrderHoodPayId(id: string, paymentId: string): void {
  const order = orders.get(id);
  if (order) {
    order.hoodpayPaymentId = paymentId;
    orders.set(id, order);
  }
}
