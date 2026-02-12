const isAllowedStripeHost = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase();
  return (
    normalized === "checkout.stripe.com" ||
    normalized === "buy.stripe.com" ||
    normalized === "billing.stripe.com" ||
    normalized.endsWith(".stripe.com")
  );
};

const ensureStripeUrl = (rawUrl: string): string => {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Checkout URL is invalid.");
  }

  if (!isAllowedStripeHost(parsed.hostname)) {
    throw new Error(`Blocked non-Stripe checkout URL (${parsed.hostname}).`);
  }

  return parsed.toString();
};

export const redirectToStripePaymentLink = (rawUrl: string): void => {
  const stripeUrl = ensureStripeUrl(rawUrl);
  window.location.assign(stripeUrl);
};

export const createStripeCheckoutSessionRedirect = async (productId: number): Promise<void> => {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ product_id: productId }),
  });

  const payload = await response
    .json()
    .catch(() => ({ error: "Failed to parse checkout response." })) as Record<string, unknown>;

  if (!response.ok) {
    const message = typeof payload.error === "string" ? payload.error : "Checkout request failed.";
    throw new Error(message);
  }

  const checkoutUrl = typeof payload.url === "string" ? payload.url : "";
  if (!checkoutUrl) {
    throw new Error("Checkout response missing URL.");
  }

  const stripeUrl = ensureStripeUrl(checkoutUrl);
  window.location.assign(stripeUrl);
};
