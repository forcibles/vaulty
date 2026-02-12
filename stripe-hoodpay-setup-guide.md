# Mystery Box Store — Stripe + HoodPay Setup Guide

## What You're Building

```
Your Site (checkout form, cart, order summary)
    │
    ├── 💳 Pay with Card ──────→ Stripe Payment Link (also shows Apple Pay / Google Pay)
    │
    └── ₿  Pay with Crypto ────→ HoodPay Payment Link
    │
    └── ✅ Success ←───────────── Return URL back to your site
```

Everything happens on your site until the user clicks Pay. Then a single `window.location.href` redirect.

---

## PHASE 0: MANUAL SETUP (Do Before Code)

### Stripe Setup

1. **Create a Payment Link** (you can do this while under review)
   - Stripe Dashboard → Payment Links → + New
   - Add a product or use "customer chooses amount" if your cart total varies
   - Under "After payment" → set Confirmation page to: `https://yourdomain.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`
   - Save and copy the URL (e.g. `https://buy.stripe.com/abc123`)

2. **Enable Apple Pay + Google Pay**
   - Dashboard → Settings → Payment Methods
   - Make sure "Apple Pay" and "Google Pay" are toggled ON
   - They auto-appear on Payment Links when customer is on a compatible device

3. **Set up Webhooks**
   - Dashboard → Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for: `checkout.session.completed`
   - Copy the Signing Secret (`whsec_...`)

4. **Get your API keys**
   - Dashboard → Developers → API keys
   - Copy the Secret Key (`sk_live_...` or `sk_test_...` for testing)

> **IMPORTANT: Payment Links vs Checkout Sessions**
> Payment Links are static URLs — great for quick setup but the amount is fixed.
> For a dynamic cart total, you'll want Stripe Checkout Sessions (API creates a unique URL per order with the exact cart amount). The prompts below use Checkout Sessions so the price matches your cart.

### HoodPay Setup

1. **Get your payment link or API credentials**
   - Log into HoodPay dashboard
   - Create a payment link or note your merchant API endpoint
   - Check if they support: a `reference` or `metadata` param (for passing order ID)
   - Check if they support: a `redirect_url` or `success_url` param
   - Set success URL to: `https://yourdomain.com/checkout/success`

2. **Set up Webhooks**
   - Find webhook/IPN settings in HoodPay dashboard
   - Webhook URL: `https://yourdomain.com/api/webhooks/hoodpay`
   - Copy webhook secret if available

### Environment Variables

Add to `.env.local`:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# HoodPay
HOODPAY_PAYMENT_LINK=https://hoodpay.io/pay/YOUR_LINK
HOODPAY_WEBHOOK_SECRET=xxxxx

# Shopify (existing)
SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com
SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxx
```

### Install Dependencies

```bash
npm install stripe nanoid
```

---

## PHASE 1: CLAUDE CODE PROMPTS (Run In Order)

### Prompt 1: Order Storage

```
Create a utility at src/lib/orders.ts for managing orders.

Use an in-memory Map for now (we'll upgrade to a DB later).

Types:
- OrderItem: { productId: string, name: string, quantity: number, price: number, image?: string }
- Customer: { name: string, email: string, address: string, city: string, state: string, zip: string }
- Order: { id: string, items: OrderItem[], customer: Customer, total: number, paymentMethod: 'card' | 'crypto', paymentStatus: 'pending' | 'paid' | 'failed', stripeSessionId?: string, createdAt: Date }

Functions:
- createOrder(items, customer, paymentMethod) → Order (use nanoid(12) for ID)
- getOrder(id) → Order | null
- getOrderByStripeSession(sessionId) → Order | null
- markOrderPaid(id) → void
- markOrderFailed(id) → void

Export all types and functions.
```

### Prompt 2: Stripe Checkout Session API Route

```
Create an API route at src/app/api/checkout/create-stripe-session/route.ts

This route creates a Stripe Checkout Session with the exact cart items and redirects the customer to Stripe's hosted checkout page.

Requirements:
- POST endpoint accepting: { items: OrderItem[], customer: Customer }
- Import stripe from 'stripe' and initialize with STRIPE_SECRET_KEY
- Import createOrder from src/lib/orders.ts
- Create an order in our system with paymentMethod: 'card'
- Create a Stripe Checkout Session using stripe.checkout.sessions.create():
  - mode: 'payment'
  - line_items: map cart items to Stripe format with price_data (currency: 'usd', product_data: { name }, unit_amount: price in cents)
  - client_reference_id: our orderId
  - customer_email: customer.email
  - success_url: `${NEXT_PUBLIC_SITE_URL}/checkout/success?orderId={orderId}&session_id={CHECKOUT_SESSION_ID}`
  - cancel_url: `${NEXT_PUBLIC_SITE_URL}/checkout?canceled=true`
  - metadata: { orderId }
- Save the stripe session ID to the order: order.stripeSessionId = session.id
- Return JSON: { orderId, checkoutUrl: session.url }

Do NOT use static Payment Links. We need dynamic Checkout Sessions so the amount matches the cart.

CRITICAL: No Stripe Elements, no embedded forms, no iframes. Just create the session and return the URL for a redirect.
```

### Prompt 3: HoodPay Checkout API Route

```
Create an API route at src/app/api/checkout/create-hoodpay-session/route.ts

This route creates an order and returns a HoodPay redirect URL.

Requirements:
- POST endpoint accepting: { items: OrderItem[], customer: Customer }
- Import createOrder from src/lib/orders.ts
- Create an order with paymentMethod: 'crypto'
- Construct the HoodPay redirect URL:
  - Base URL from HOODPAY_PAYMENT_LINK env var
  - Append query params: ?amount={total}&reference={orderId}&redirect_url={encodeURIComponent(successUrl)}
  - Success URL: `${NEXT_PUBLIC_SITE_URL}/checkout/success?orderId={orderId}`
- Return JSON: { orderId, checkoutUrl }

Note: HoodPay's exact URL parameter format may vary. Build this flexibly — use a helper function buildHoodPayUrl(total, orderId, successUrl) so we can easily adjust the param names later after checking their docs. Add a comment noting which params to verify against HoodPay's actual documentation.
```

### Prompt 4: Checkout Page

```
Create the checkout page at src/app/checkout/page.tsx

This is a client component ('use client') that collects customer info and lets them choose a payment method.

Layout:
- Left column (desktop) / Top (mobile): ORDER SUMMARY
  - List each cart item with: image thumbnail (if available), name, quantity, price
  - Subtotal, Shipping (free or calculated), Total
  - Pull items from your cart context/state (check if one exists in the project already, if not create a simple one)

- Right column (desktop) / Bottom (mobile): CHECKOUT FORM + PAYMENT
  - Form fields: Full Name, Email, Address, City, State, ZIP
  - All fields required with basic validation

  - Section heading: "Choose Payment Method"
  - Two payment option cards, styled as selectable cards (not radio buttons):

    Card 1: "💳 Card / Apple Pay / Google Pay"
      - Subtitle: "Visa, Mastercard, Amex, Apple Pay, Google Pay"
      - Powered by Stripe badge or text

    Card 2: "₿ Crypto"
      - Subtitle: "Bitcoin, Ethereum, USDT & more"
      - Powered by HoodPay badge or text

  - "Complete Purchase" button (one button, not per payment method)

Behavior on submit:
1. Validate all form fields
2. Show loading spinner on the button, disable it
3. Based on selected payment method:
   - 'card': POST to /api/checkout/create-stripe-session with { items, customer }
   - 'crypto': POST to /api/checkout/create-hoodpay-session with { items, customer }
4. On success response: window.location.href = response.checkoutUrl
5. On error: show error toast/message, re-enable button

Styling:
- Match the existing site's design system (dark theme if applicable)
- The selected payment card should have a visible highlight (border color, subtle glow, or check mark)
- Mobile responsive — single column on small screens
- The "Complete Purchase" button should be prominent and full-width on mobile

URL params:
- If ?canceled=true is present, show a subtle banner: "Payment was canceled. You can try again."

CRITICAL CONSTRAINTS:
- NO Stripe.js, no Stripe Elements, no PaymentElement, no embedded checkout
- NO HoodPay SDK or widget
- The ONLY external interaction is the redirect via window.location.href
- Everything on this page is 100% your own UI
```

### Prompt 5: Success Page

```
Create the success/confirmation page at src/app/checkout/success/page.tsx

Requirements:
- Read orderId from URL search params
- Also create the status check API route at src/app/api/checkout/order-status/route.ts:
  - GET endpoint with ?orderId=xxx query param
  - Returns { order: { id, paymentStatus, total, items, customer } } or { error: 'not found' }

- On page load, call GET /api/checkout/order-status?orderId=xxx

- Show different states:
  1. PAID: 
     - Large green checkmark (CSS animation, no external library)
     - "Order Confirmed!"
     - Order ID displayed
     - "A confirmation email will be sent to {email}"
     - Order summary (items, total)
     - "Continue Shopping" button → links to store/products page
     - Clear the cart

  2. PENDING:
     - Subtle loading spinner
     - "Processing your payment..."
     - "This may take a moment for crypto payments"
     - Poll GET /api/checkout/order-status every 3 seconds
     - Max 20 attempts (60 seconds), then show "still processing" message with support contact
     - If status changes to 'paid', transition to the PAID state with a smooth animation

  3. ERROR / NOT FOUND:
     - "Something went wrong"
     - "If you completed payment, your order will be confirmed shortly"
     - "Contact support if this persists"
     - "Return to Store" button

- Match site's existing design
- Mobile responsive
```

### Prompt 6: Stripe Webhook

```
Create the Stripe webhook handler at src/app/api/webhooks/stripe/route.ts

Requirements:
- Import Stripe and initialize with STRIPE_SECRET_KEY
- Handle POST requests only
- Read the raw body as text using request.text() — NOT request.json() (critical for signature verification)
- Get the stripe-signature header from the request
- Verify the webhook using stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
- Handle the 'checkout.session.completed' event:
  - Extract client_reference_id (this is our orderId)
  - Also extract session.id, session.payment_status, session.customer_details.email
  - Call markOrderPaid(orderId) from src/lib/orders.ts
  - Log: console.log('[Stripe Webhook] Order paid:', orderId)
- Return NextResponse with status 200 and JSON { received: true }
- On signature verification failure: return 400 with error message
- On any other error: return 500 with error message

- Add to the top of the file: export const dynamic = 'force-dynamic'
- Also add: export const runtime = 'nodejs' (needed for raw body handling)

This is the critical path — this is how we know a card/Apple Pay/Google Pay payment succeeded.
Test with: stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Prompt 7: HoodPay Webhook

```
Create the HoodPay webhook handler at src/app/api/webhooks/hoodpay/route.ts

Requirements:
- Handle POST requests
- Read the body as JSON
- Log the ENTIRE raw payload: console.log('[HoodPay Webhook] Full payload:', JSON.stringify(body, null, 2))
  (We need this to see the exact field names HoodPay sends)
- If HOODPAY_WEBHOOK_SECRET is set, verify the signature:
  - Check common header names: x-hoodpay-signature, x-webhook-signature, x-signature
  - Use HMAC SHA256 verification if they use that pattern
  - If no signature header found, log a warning but still process (some providers don't sign)
- Extract the order reference from the payload:
  - Try common field names: body.reference, body.orderId, body.metadata?.orderId, body.order_id, body.custom_id
  - Log which field was found
- Extract payment status:
  - Try: body.status, body.payment_status, body.state
  - Only mark as paid if status indicates completion (e.g. 'completed', 'paid', 'confirmed', 'COMPLETED')
- Call markOrderPaid(orderId) if payment is confirmed
- Return 200 with { received: true }

- Add: export const dynamic = 'force-dynamic'

NOTE: This is intentionally built flexibly because HoodPay's exact webhook format needs to be verified. The console.log of the full payload during first test will tell us exactly what to parse. We can tighten this up after the first real webhook comes through.
```

### Prompt 8: Cart Context (if needed)

```
Check if a cart context/provider already exists in the project (look in src/context/, src/providers/, src/store/, or src/lib/).

If one exists:
- Make sure it has these fields on each item: productId, name, price, quantity, image (optional)
- Make sure it has: addToCart, removeFromCart, updateQuantity, clearCart, getTotal/cartTotal
- Make sure it persists to localStorage
- If it's missing anything, add it

If one does NOT exist, create src/context/CartContext.tsx:
- CartProvider component that wraps the app (add it to the root layout)
- State: items array of { productId: string, name: string, price: number, quantity: number, image?: string }
- Functions: addToCart(item), removeFromCart(productId), updateQuantity(productId, quantity), clearCart(), getCartTotal() → number
- Persist to localStorage on every change, hydrate on mount
- Export useCart() hook
- Handle SSR: don't read localStorage during server render, only on client mount

If the cart is empty when someone navigates to /checkout, redirect them back to the store with a message.
```

---

## BUILD ORDER

```
Step 1: Prompt 8 → Cart Context (check/create)
Step 2: Prompt 1 → Order Storage utility
Step 3: Prompt 2 → Stripe Checkout Session API
Step 4: Prompt 3 → HoodPay Checkout API
Step 5: Prompt 4 → Checkout Page (the big one)
Step 6: Prompt 5 → Success Page
Step 7: Prompt 6 → Stripe Webhook
Step 8: Prompt 7 → HoodPay Webhook
```

---

## TESTING CHECKLIST

### Stripe (use test mode first)
- [ ] Switch to test API keys in .env.local (sk_test_...)
- [ ] Add item to cart → go to checkout → fill form → select Card → click Complete Purchase
- [ ] Verify redirect goes to Stripe Checkout with correct items and amount
- [ ] Use test card: 4242 4242 4242 4242, any future exp, any CVC
- [ ] Verify redirect back to success page with orderId
- [ ] Install Stripe CLI: `brew install stripe/stripe-cli/stripe` (Mac) or download from stripe.com
- [ ] Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Verify webhook fires and order status changes to 'paid'
- [ ] Verify success page shows confirmed state

### HoodPay
- [ ] Select Crypto payment → verify redirect goes to HoodPay with correct amount
- [ ] Check that orderId is passed in the URL
- [ ] Complete a test payment if HoodPay has a testnet/sandbox mode
- [ ] Check your server logs for the webhook payload
- [ ] Verify the order gets marked as paid after webhook

### General
- [ ] Empty cart → try to go to /checkout → should redirect to store
- [ ] Incomplete form → should show validation errors
- [ ] Cancel on Stripe → should return to checkout with "canceled" banner
- [ ] Success page with invalid orderId → should show error state
- [ ] Mobile responsive: test checkout page on phone-width viewport

---

## ADDING MORE PAYMENT METHODS LATER (ZEN, Revolut, etc.)

When you get approved for additional providers, the pattern is identical each time:

1. Create `/api/checkout/create-{provider}-session/route.ts` (creates order + returns redirect URL)
2. Create `/api/webhooks/{provider}/route.ts` (listens for payment confirmation)
3. Add the payment method option to the checkout page's payment selector
4. Add env vars

The checkout page's payment selection and the order storage layer are already built to be extensible — adding a new method is ~30 min of work.

---

## FILE STRUCTURE (What You'll Have After All Prompts)

```
src/
├── app/
│   ├── checkout/
│   │   ├── page.tsx                              ← Checkout page
│   │   └── success/
│   │       └── page.tsx                          ← Order confirmation
│   └── api/
│       ├── checkout/
│       │   ├── create-stripe-session/route.ts    ← Creates Stripe Checkout Session
│       │   ├── create-hoodpay-session/route.ts   ← Creates HoodPay redirect
│       │   └── order-status/route.ts             ← Polls order status
│       └── webhooks/
│           ├── stripe/route.ts                   ← Stripe payment confirmation
│           └── hoodpay/route.ts                  ← HoodPay payment confirmation
├── context/
│   └── CartContext.tsx                            ← Cart state (if created)
└── lib/
    └── orders.ts                                 ← Order management
```
