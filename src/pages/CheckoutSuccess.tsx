import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoBackground from '@/components/VideoBackground';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, XCircle, ShoppingBag } from 'lucide-react';
import { incrementPurchaseCounts } from '@/lib/purchaseStats';

type OrderStatus = 'paid' | 'pending' | 'failed' | 'not_found';

type Order = {
  id: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  total: number;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  customer: {
    email: string;
    name: string;
  };
  paymentMethod: 'card' | 'crypto';
};

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const orderId = searchParams.get('orderId');
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [order, setOrder] = useState<Order | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [hasCleared, setHasCleared] = useState(false);
  const [hasRecordedPurchase, setHasRecordedPurchase] = useState(false);

  const maxPollAttempts = 20; // 60 seconds total (3 seconds * 20)

  useEffect(() => {
    if (!orderId) {
      setStatus('not_found');
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`/api/checkout/order-status?orderId=${orderId}`);
        const data = await response.json();

        if (!response.ok || data.error) {
          setStatus('not_found');
          return;
        }

        setOrder(data.order);

        if (data.order.paymentStatus === 'paid') {
          setStatus('paid');
          // Clear cart only once when payment is confirmed
          if (!hasCleared) {
            clearCart();
            setHasCleared(true);
          }
          if (!hasRecordedPurchase) {
            incrementPurchaseCounts(data.order.items);
            setHasRecordedPurchase(true);
          }
        } else if (data.order.paymentStatus === 'failed') {
          setStatus('failed');
        } else {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Failed to fetch order status:', error);
        setStatus('not_found');
      }
    };

    // Initial fetch
    fetchOrderStatus();

    // Poll for status updates if pending
    const pollInterval = setInterval(() => {
      if (status === 'pending' && pollCount < maxPollAttempts) {
        fetchOrderStatus();
        setPollCount((prev) => prev + 1);
      } else {
        clearInterval(pollInterval);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [orderId, status, pollCount, clearCart, hasCleared, hasRecordedPurchase]);

  return (
    <>
      <SEOHead
        title="Order Status - CheatVault"
        description="Track your checkout confirmation and payment status."
        keywords={['order status', 'payment confirmation', 'checkout success', 'cheatvault']}
        breadcrumbs={[
          { position: 1, name: 'Home', url: '/' },
          { position: 2, name: 'Checkout Status' },
        ]}
      />
      <div className="grain-overlay flex min-h-screen flex-col">
        <VideoBackground />
        <Navbar />

        <main className="page-main flex-1">
          <div className="page-wrap max-w-2xl">
            <div className="page-panel p-8 text-center">
              {/* PAID STATE */}
              {status === 'paid' && order && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <CheckCircle2 className="h-20 w-20 text-green-500 animate-in zoom-in duration-500" />
                      <div className="absolute inset-0 h-20 w-20 rounded-full bg-green-500/20 animate-ping" />
                    </div>
                  </div>

                  <div>
                    <h1 className="font-heading text-3xl font-bold text-gradient-silver sm:text-4xl">
                      Order Confirmed!
                    </h1>
                    <p className="mt-2 text-white/70">
                      Thank you for your purchase
                    </p>
                  </div>

                  <div className="page-panel p-6 text-left">
                    <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-sm text-white/60">Order ID</span>
                      <span className="font-mono text-sm text-white/90">{order.id}</span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-white/65">
                        A confirmation email will be sent to:
                      </p>
                      <p className="mt-1 font-semibold text-primary">{order.customer.email}</p>
                    </div>

                    <div className="space-y-3 border-t border-white/10 pt-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                        Order Summary
                      </h3>
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-white/90">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-white/60">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t border-white/10 pt-3 font-bold">
                        <span className="text-white/95">Total</span>
                        <span className="text-gradient-gold">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Link to="/pricing">
                    <Button className="button-gloss-primary w-full py-3 text-sm font-bold" size="lg">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              )}

              {/* PENDING STATE */}
              {status === 'pending' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <Loader2 className="h-20 w-20 text-primary animate-spin" />
                  </div>

                  <div>
                    <h1 className="font-heading text-3xl font-bold text-gradient-silver sm:text-4xl">
                      Processing Your Payment
                    </h1>
                    <p className="mt-2 text-white/70">
                      This may take a moment for crypto payments
                    </p>
                  </div>

                  {order && (
                    <div className="page-panel p-4">
                      <p className="text-sm text-white/70">
                        Order ID: <span className="font-mono text-white/92">{order.id}</span>
                      </p>
                    </div>
                  )}

                  {pollCount >= maxPollAttempts && (
                    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                      <p className="text-sm text-yellow-400">
                        Your payment is still being processed. Please check your email for
                        confirmation or contact support if this persists.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* FAILED STATE */}
              {status === 'failed' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <XCircle className="h-20 w-20 text-destructive" />
                  </div>

                  <div>
                    <h1 className="font-heading text-3xl font-bold text-gradient-silver sm:text-4xl">
                      Payment Failed
                    </h1>
                    <p className="mt-2 text-white/70">
                      Your payment could not be processed
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link to="/checkout">
                      <Button className="button-gloss-primary w-full py-3 text-sm font-bold" size="lg">
                        Try Again
                      </Button>
                    </Link>
                    <Link to="/pricing">
                      <Button className="button-gloss-ghost w-full py-3 text-sm font-bold text-white/90" size="lg">
                        Return to Store
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* NOT FOUND / ERROR STATE */}
              {status === 'not_found' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <XCircle className="h-20 w-20 text-white/55" />
                  </div>

                  <div>
                    <h1 className="font-heading text-3xl font-bold text-gradient-silver sm:text-4xl">
                      Something Went Wrong
                    </h1>
                    <p className="mt-2 text-white/70">
                      We couldn't find your order
                    </p>
                  </div>

                  <div className="page-panel p-4 text-sm text-white/68">
                    <p>If you completed payment, your order will be confirmed shortly.</p>
                    <p className="mt-2">
                      Contact support if this issue persists.
                    </p>
                  </div>

                  <Link to="/pricing">
                    <Button className="button-gloss-ghost w-full py-3 text-sm font-bold text-white/90" size="lg">
                      Return to Store
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CheckoutSuccess;
