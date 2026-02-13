const PURCHASE_COUNTS_KEY = "cheatvault-purchase-counts";

export type PurchaseCountMap = Record<string, number>;

type OrderLikeItem = {
  productId: string;
  quantity: number;
};

const parseToolSlug = (productId: string) => {
  // Supported productId formats:
  // - "tool-${slug}" (GameCard)
  // - "${slug}-${planId}" (ProductDetail)
  const knownPlanSuffixes = ["1day", "1week", "1month", "lifetime", "one-time"];

  if (productId.startsWith("tool-")) {
    const slug = productId.slice(5).trim();
    return slug.length > 0 ? slug : null;
  }

  for (const suffix of knownPlanSuffixes) {
    const marker = `-${suffix}`;
    if (productId.endsWith(marker)) {
      const slug = productId.slice(0, -marker.length).trim();
      return slug.length > 0 ? slug : null;
    }
  }

  return null;
};

export const readPurchaseCounts = (): PurchaseCountMap => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PURCHASE_COUNTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PurchaseCountMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const incrementPurchaseCounts = (items: OrderLikeItem[]): PurchaseCountMap => {
  if (typeof window === "undefined" || items.length === 0) {
    return {};
  }

  const next = readPurchaseCounts();

  for (const item of items) {
    const slug = parseToolSlug(item.productId);
    if (!slug) continue;
    next[slug] = (next[slug] || 0) + Math.max(1, item.quantity || 1);
  }

  try {
    window.localStorage.setItem(PURCHASE_COUNTS_KEY, JSON.stringify(next));
  } catch {
    return next;
  }

  window.dispatchEvent(new CustomEvent("purchase-stats:updated"));
  return next;
};
