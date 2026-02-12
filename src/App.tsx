import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnalyticsWrapper from "./components/AnalyticsWrapper";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load route components for improved performance
const Index = lazy(() => import("./pages/Index"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Faq = lazy(() => import("./pages/Faq"));
const Status = lazy(() => import("./pages/Status"));
const Success = lazy(() => import("./pages/Success"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Branded loading spinner
const BrandedSpinner = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const dims = size === "sm" ? "h-10 w-10" : "h-14 w-14";
  const ringDims = size === "sm" ? "h-12 w-12" : "h-16 w-16";
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`absolute ${ringDims} rounded-full border-2 border-transparent border-t-primary border-r-primary/40`}
        style={{ animation: "spinner-ring 1s linear infinite" }}
      />
      <div
        className={`${dims} flex items-center justify-center`}
        style={{ animation: "spinner-pulse 1.8s ease-in-out infinite" }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-primary">
          <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
          <path d="M12 8v4m0 0v4m0-4h4m-4 0H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

// Loading component for lazy-loaded routes
const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <BrandedSpinner size="sm" />
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  // Simulate initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <BrandedSpinner />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Loading Vault</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/status" element={<Status />} />
                <Route path="/success" element={<Success />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
