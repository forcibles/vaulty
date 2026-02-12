import { useState } from 'react';
import { Loader2, ArrowRight, Mail } from 'lucide-react';

export function PricingSection() {
  const [email, setEmail] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = () => {
    // 1. Validate Email (Required for delivery)
    if (!email || !email.includes('@')) {
      setError('Please enter your email to receive the key.');
      return;
    }
    
    setIsRedirecting(true);

    // 2. Construct the "Invisible" URL
    // We append query params to tell Billgang: "Here is the user, skip the store, go to payment."
    const baseUrl = "https://cheatvault.bgng.io/checkout/24-hour-test-pass";
    const params = new URLSearchParams({
      email: email,           // Pass the email you collected
      gateway: "hoodpay"      // Force HoodPay selection
    });

    // 3. The Hand-off
    // This briefly hits Billgang's server to register the order, then bounces to HoodPay.
    window.location.href = `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
      <div className="border border-white/10 bg-black/40 backdrop-blur p-6 rounded-xl hover:scale-[1.02] transition-all group">
        <h3 className="text-2xl font-bold text-white mb-2">24 Hour Access</h3>
        <p className="text-gray-400 mb-6">Instant delivery to your email.</p>
        
        <div className="space-y-3">
          {/* Email Input - Keeps the user on YOUR site longer */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full bg-black/50 border border-white/20 rounded pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button 
            onClick={handlePurchase}
            disabled={isRedirecting}
            className="w-full py-3 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold rounded flex items-center justify-center gap-2 transition-all"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Redirecting to Payment...</span>
              </>
            ) : (
              <>
                <span>BUY WITH CRYPTO</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
