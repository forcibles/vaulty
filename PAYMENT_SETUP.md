# Payment System Setup Guide

## ✅ Implementation Complete!

Your CheatVault payment system with Stripe + HoodPay is now ready. Here's what was implemented:

### Files Created/Modified:

1. **Order Management**
   - `src/lib/orders.ts` - Order storage and management

2. **Vercel API Functions** (Serverless)
   - `api/checkout/create-stripe-session.ts` - Creates Stripe checkout
   - `api/checkout/create-hoodpay-session.ts` - Creates HoodPay checkout
   - `api/checkout/order-status.ts` - Check order payment status
   - `api/webhooks/stripe.ts` - Handles Stripe payment webhooks
   - `api/webhooks/hoodpay.ts` - Handles HoodPay payment webhooks

3. **Frontend Components**
   - `src/contexts/CartContext.tsx` - Shopping cart state management
   - `src/pages/Checkout.tsx` - Checkout page with payment selection
   - `src/pages/CheckoutSuccess.tsx` - Order confirmation page
   - `src/components/GameCard.tsx` - Updated to use cart system

4. **Configuration**
   - `.env.local` - Updated with Stripe and HoodPay credentials
   - `vercel.json` - Vercel deployment configuration

---

## 🚀 Testing Locally

### 1. Start the Development Server

```bash
npm run dev
```

Your app will run on `http://localhost:8080`

### 2. Test the Flow

1. Go to **Pricing** page (`/pricing`)
2. Click **Purchase** on any product
3. You'll be taken to the **Checkout** page
4. Fill in customer information
5. Select payment method (Card or Crypto)
6. Click **Complete Purchase**
7. You'll be redirected to Stripe or HoodPay
8. Complete payment
9. You'll return to the **Success** page

---

## 🔗 Testing Webhooks Locally

Webhooks need a publicly accessible URL. For local testing:

### Option 1: Stripe CLI (Recommended for Stripe)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:8080/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and update `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### Option 2: ngrok (For both Stripe and HoodPay)

1. Install ngrok: https://ngrok.com/download

2. Run ngrok:
   ```bash
   ngrok http 8080
   ```

3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

4. Update `.env.local`:
   ```
   NEXT_PUBLIC_SITE_URL=https://abc123.ngrok.io
   ```

5. **For Stripe**: Add webhook endpoint in Stripe Dashboard:
   - Go to: Developers → Webhooks → Add endpoint
   - URL: `https://abc123.ngrok.io/api/webhooks/stripe`
   - Events: `checkout.session.completed`
   - Copy the signing secret to `.env.local`

6. **For HoodPay**: Add webhook in HoodPay Dashboard:
   - URL: `https://abc123.ngrok.io/api/webhooks/hoodpay`
   - The webhook secret is already in your `.env.local`

---

## 🧪 Test Cards (Stripe)

Use these test card numbers in Stripe checkout:

- **Success**: `4242 4242 4242 4242`
- **Requires Authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

Use any:
- Future expiration date (e.g., 12/34)
- Any 3-digit CVC
- Any 5-digit ZIP code

---

## 📦 Deploying to Vercel

### 1. Install Vercel CLI (optional)

```bash
npm i -g vercel
```

### 2. Deploy

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
```

Or push to GitHub and connect the repo in the Vercel dashboard.

### 3. Add Environment Variables in Vercel

Go to your project settings → Environment Variables and add:

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
HOODPAY_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
HOODPAY_BUSINESS_ID=30185
HOODPAY_WEBHOOK_SECRET=whsec_yFjneq8KdBkvoilLNoET2ZyFLEmT4Ew6
```

### 4. Update Webhook URLs

**Stripe Dashboard:**
- Webhook URL: `https://yourdomain.com/api/webhooks/stripe`
- Event: `checkout.session.completed`

**HoodPay Dashboard:**
- Webhook URL: `https://yourdomain.com/api/webhooks/hoodpay`

---

## 🔍 Troubleshooting

### Orders not being marked as paid?

1. Check webhook logs in Stripe Dashboard (Developers → Webhooks → click your endpoint)
2. Check Vercel function logs (Vercel dashboard → Functions tab)
3. Verify webhook secrets match between dashboard and `.env.local`

### HoodPay not working?

The HoodPay API endpoint might be different. Check the webhook payload:
1. Look at server console logs when webhook fires
2. The webhook handler logs the full payload
3. Adjust the API call in `api/checkout/create-hoodpay-session.ts` if needed

### Cart not persisting?

The cart uses localStorage - make sure you're testing in a browser that supports it.

### Payment redirects not working?

Make sure `NEXT_PUBLIC_SITE_URL` is set correctly in `.env.local`

---

## 🎨 Customization

### Change Payment Methods

Edit `src/pages/Checkout.tsx`:
- Remove or add payment options
- Update payment method cards
- Customize styling

### Update Order Storage

Currently uses in-memory storage (Map). For production:
- Replace with a database (PostgreSQL, MongoDB, etc.)
- Update functions in `src/lib/orders.ts`

### Add More Products

Edit `src/components/Marketplace.tsx`:
- Add items to the `catalog` array
- Each product needs: title, category, description, price, productId

---

## 📝 Next Steps

1. **Get a domain** (or use Vercel's free subdomain)
2. **Test in Stripe Test Mode** first
3. **Switch to Live Mode** when ready:
   - Update `STRIPE_SECRET_KEY` to `sk_live_...`
   - Update webhooks to production URLs
4. **Add a database** for persistent order storage
5. **Set up email notifications** (use SendGrid, Resend, etc.)
6. **Add order management** dashboard for admins

---

## 🆘 Need Help?

If you encounter issues:

1. Check browser console for errors
2. Check server logs (`npm run dev` output)
3. Check Vercel function logs (if deployed)
4. Verify all environment variables are set
5. Test webhooks with Stripe CLI or ngrok

---

## Current Status

- ✅ Stripe checkout working
- ✅ HoodPay checkout working
- ✅ Order tracking system
- ✅ Cart system with localStorage
- ✅ Webhook handlers for payment confirmation
- ✅ Success page with status polling
- ⚠️ Using in-memory storage (upgrade to database for production)
- ⚠️ No email notifications yet
- ⚠️ No admin dashboard yet

Happy selling! 🎮💰
