import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoBackground from '@/components/VideoBackground';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Bitcoin, ShieldCheck, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

type PaymentMethod = 'card' | 'crypto';

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, getCartTotal, clearCart, removeFromCart, updateQuantity } = useCart();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const canceled = searchParams.get('canceled') === 'true';

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/pricing');
    }
  }, [items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { name, email, address, city, state, zip } = formData;

    if (!name || !email || !address || !city || !state || !zip) {
      toast.error('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const endpoint =
        selectedPaymentMethod === 'card'
          ? '/api/checkout/create-stripe-session'
          : '/api/checkout/create-hoodpay-session';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          customer: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to payment provider
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process checkout');
      setIsProcessing(false);
    }
  };

  const total = getCartTotal();

  return (
    <>
      <SEOHead
        title="Checkout - CheatVault"
        description="Secure checkout for CheatVault tools with card or crypto payment."
        keywords={['checkout', 'secure payment', 'card payment', 'crypto payment', 'cheatvault']}
        breadcrumbs={[
          { position: 1, name: 'Home', url: '/' },
          { position: 2, name: 'Checkout' },
        ]}
      />
      <div className="grain-overlay flex min-h-screen flex-col">
        <VideoBackground />
        <Navbar />

        <main className="page-main flex-1">
          <div className="page-wrap max-w-6xl">
            <span className="page-kicker">Secure Checkout</span>
            <h1 className="page-title">Complete Your Purchase</h1>
            <p className="page-subtitle">
              Finalize your order with secure card processing or crypto payment.
            </p>

            {canceled && (
              <div className="page-panel mb-6 mt-6 border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">
                Payment was canceled. You can try again below.
              </div>
            )}

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {/* Order Summary */}
              <div className="order-2 lg:order-1">
                <div className="page-panel p-6">
                  <h2 className="mb-4 font-heading text-2xl font-bold text-gradient-silver">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-start gap-4 border-b border-white/10 pb-4"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white/95">{item.name}</h3>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.productId, item.quantity - 1);
                                }
                              }}
                              disabled={item.quantity <= 1}
                              className="rounded-md border border-white/20 bg-white/5 p-1 text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-white/90">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="rounded-md border border-white/20 bg-white/5 p-1 text-white/85 transition hover:bg-white/10"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => {
                              removeFromCart(item.productId);
                              toast.success(`${item.name} removed from cart`);
                            }}
                            className="text-destructive hover:text-destructive/80 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Subtotal</span>
                      <span className="text-white/90">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Shipping</span>
                      <span className="text-green-400">Free</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-bold">
                      <span className="text-white/95">Total</span>
                      <span className="text-gradient-gold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="order-1 lg:order-2">
                <div className="page-panel p-6">
                  <h2 className="mb-6 font-heading text-2xl font-bold text-gradient-silver">
                    Checkout
                  </h2>

                  {/* Customer Information */}
                  <div className="mb-8 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name" className="text-white/70">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="mt-2 border-white/20 bg-black/45 text-white placeholder:text-white/35 focus-visible:ring-primary/40"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white/70">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="mt-2 border-white/20 bg-black/45 text-white placeholder:text-white/35 focus-visible:ring-primary/40"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-white/70">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main St"
                        className="mt-2 border-white/20 bg-black/45 text-white placeholder:text-white/35 focus-visible:ring-primary/40"
                        required
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label htmlFor="city" className="text-white/70">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                          className="mt-2 border-white/20 bg-black/45 text-white placeholder:text-white/35 focus-visible:ring-primary/40"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-white/70">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="NY"
                          className="mt-2 border-white/20 bg-black/45 text-white placeholder:text-white/35 focus-visible:ring-primary/40"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip" className="text-white/70">ZIP Code</Label>
                        <Input
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          placeholder="10001"
                          className="mt-2 border-white/20 bg-black/45 text-white placeholder:text-white/35 focus-visible:ring-primary/40"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
                      Choose Payment Method
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Card Payment */}
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('card')}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          selectedPaymentMethod === 'card'
                            ? 'border-sky-300/70 bg-sky-300/10 shadow-[0_0_28px_-18px_rgba(132,196,255,0.7)]'
                            : 'border-white/15 bg-white/5 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-6 w-6 text-primary" />
                          <div className="flex-1">
                            <p className="font-semibold text-white/92">Card / Digital Wallets</p>
                            <p className="text-xs text-white/55">
                              Visa, Mastercard, Apple Pay, Google Pay
                            </p>
                          </div>
                          {selectedPaymentMethod === 'card' && (
                            <ShieldCheck className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <p className="mt-2 text-xs text-white/55">Powered by Stripe</p>
                      </button>

                      {/* Crypto Payment */}
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('crypto')}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          selectedPaymentMethod === 'crypto'
                            ? 'border-sky-300/70 bg-sky-300/10 shadow-[0_0_28px_-18px_rgba(132,196,255,0.7)]'
                            : 'border-white/15 bg-white/5 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Bitcoin className="h-6 w-6 text-primary" />
                          <div className="flex-1">
                            <p className="font-semibold text-white/92">Crypto</p>
                            <p className="text-xs text-white/55">
                              Bitcoin, Ethereum, USDT & more
                            </p>
                          </div>
                          {selectedPaymentMethod === 'crypto' && (
                            <ShieldCheck className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <p className="mt-2 text-xs text-white/55">Powered by NOWPayments</p>
                      </button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="button-gloss-primary w-full py-3 text-sm font-bold"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Complete Purchase - $${total.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Checkout;
