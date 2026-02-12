import CONFIG from '@/config/app-config';
export const TEST_PRODUCT_SLUG = "24-hour-test-pass";

export type AntistockProduct = {
  id?: string | number;
  slug?: string;
  stock?: number | string;
  quantity?: number | string;
  inventory?: number | string;
  inventoryCount?: number | string;
  availableStock?: number | string;
};

type AntistockProductsPayload = {
  data?: unknown;
  products?: unknown;
  items?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseProducts = (payload: unknown): AntistockProduct[] => {
  if (Array.isArray(payload)) return payload as AntistockProduct[];
  if (!isRecord(payload)) return [];

  const source = payload as AntistockProductsPayload;
  const candidates = [source.data, source.products, source.items];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as AntistockProduct[];
  }

  return [];
};

const parseStockValue = (product: AntistockProduct | null): number | null => {
  if (!product) return null;

  const candidate = [
    product.stock,
    product.quantity,
    product.inventory,
    product.inventoryCount,
    product.availableStock,
  ].find((value) => typeof value === "number" || typeof value === "string");

  if (typeof candidate === "number") return candidate;
  if (typeof candidate === "string") {
    const parsed = Number(candidate);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const getAntistockConfig = () => {
  const apiBase = CONFIG.API_CONFIG.ANTI_STOCK_API_BASE.replace(/\/$/, "");
  const apiKey = CONFIG.API_CONFIG.ANTI_STOCK_API_KEY;
  const shopId = CONFIG.API_CONFIG.ANTI_STOCK_SHOP_ID;

  if (!apiKey || !shopId) {
    throw new Error("Missing Antistock config. Check VITE_ANTISTOCK_API_KEY and VITE_ANTISTOCK_SHOP_ID.");
  }

  return { apiBase, apiKey, shopId };
};

export const fetchTestProduct = async (
  signal?: AbortSignal,
): Promise<AntistockProduct | null> => {
  const { apiBase, apiKey, shopId } = getAntistockConfig();
  
  // Create abort controller with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_CONFIG.REQUEST_TIMEOUT);
  
  // Combine provided signal with timeout signal
  const combinedSignal = signal ? 
    AbortSignal.any([controller.signal, signal]) : 
    controller.signal;

  try {
    const response = await fetch(
      `${apiBase}/v1/dash/shops/${encodeURIComponent(shopId)}/products`,
      {
        method: "GET",
        signal: combinedSignal,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
          "x-api-key": apiKey,
        },
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Antistock products request failed (${response.status})`);
    }

    const payload = (await response.json()) as unknown;
    const products = parseProducts(payload);
    return (
      products.find(
        (product) =>
          typeof product.slug === "string" &&
          product.slug.toLowerCase() === TEST_PRODUCT_SLUG,
      ) || null
    );
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle timeout specifically
    if ((error as Error).name === 'AbortError') {
      throw new Error('Request timeout exceeded');
    }
    
    throw error;
  }
};

export const fetchTestProductStock = async (
  signal?: AbortSignal,
): Promise<number | null> => {
  const product = await fetchTestProduct(signal);
  return parseStockValue(product);
};

// Generic API request function with retry logic
export const makeApiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  retries = CONFIG.API_CONFIG.MAX_RETRIES
): Promise<Response> => {
  const { apiBase, apiKey, shopId } = getAntistockConfig();
  const url = `${apiBase}${endpoint}`;
  
  const defaultHeaders = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'x-api-key': apiKey,
    'Content-Type': 'application/json',
  };
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_CONFIG.REQUEST_TIMEOUT);
      
      const signal = options.signal ? 
        AbortSignal.any([controller.signal, options.signal]) : 
        controller.signal;
        
      const response = await fetch(url, {
        ...config,
        signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      // Don't retry on certain status codes
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }
      
      // If this was the last attempt, throw the error
      if (attempt === retries) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    } catch (error) {
      lastError = error as Error;
      
      // If this was the last attempt, throw the error
      if (attempt === retries) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  // This shouldn't happen, but TypeScript wants a return
  throw lastError || new Error('Unknown error occurred during API request');
};
