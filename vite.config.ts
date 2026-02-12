import type { IncomingMessage, ServerResponse } from "http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { paymentApiPlugin } from "./src/lib/vite-payment-plugin";

const BILLGANG_CHECKOUT_ENDPOINT = "https://pg-api.billgang.com/v1/checkout";
const BILLGANG_SECRET_KEY_PATTERN = /^sk_(live|test)_/;
const JWT_LIKE_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

const isSupportedBillgangSecret = (value: string): boolean =>
  BILLGANG_SECRET_KEY_PATTERN.test(value) || JWT_LIKE_PATTERN.test(value);

const readJsonBody = async (req: IncomingMessage): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  return JSON.parse(raw) as Record<string, unknown>;
};

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

const billgangCheckoutPlugin = (env: Record<string, string>): Plugin => ({
  name: "billgang-checkout-api",
  configureServer(server) {
    const handler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (req.url !== "/api/checkout") {
        next();
        return;
      }
      if (req.method !== "POST") {
        sendJson(res, 405, { error: "Method not allowed." });
        return;
      }

      const secretKey = env.BILLGANG_SECRET_KEY?.trim();
      const shopId = env.BILLGANG_SHOP_ID;
      console.log("Using Key:", secretKey?.slice(0, 10) + "...");

      if (!secretKey) {
        sendJson(res, 500, { error: "Missing BILLGANG_SECRET_KEY on server." });
        return;
      }
      if (!isSupportedBillgangSecret(secretKey)) {
        sendJson(res, 500, {
          error: "Invalid BILLGANG_SECRET_KEY format. Expected sk_live_/sk_test_ or a JWT-style token.",
        });
        return;
      }

      let productId: number;
      try {
        const body = await readJsonBody(req);
        const resolved = body.product_id ?? body.productId;
        const parsedProductId =
          typeof resolved === "number"
            ? resolved
            : typeof resolved === "string"
              ? Number.parseInt(resolved, 10)
              : Number.NaN;
        if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
          sendJson(res, 400, { error: "product_id is required." });
          return;
        }
        productId = parsedProductId;
        console.log("Sending Product ID:", productId);
      } catch {
        sendJson(res, 400, { error: "Invalid JSON body." });
        return;
      }

      const payload = {
        product_id: productId,
        gateway: "stripe",
      };
      if (shopId) payload.shop_id = shopId;

      try {
        const response = await fetch(BILLGANG_CHECKOUT_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10_000),
        });

        const responseText = await response.text();
        const data = (() => {
          try {
            return JSON.parse(responseText) as Record<string, unknown>;
          } catch {
            return { raw: responseText };
          }
        })();

        if (!response.ok) {
          console.log("Billgang error response:", responseText);
          sendJson(res, response.status || 502, {
            error: `Billgang checkout request failed${response.status ? ` (${response.status})` : ""}.`,
            details: data,
          });
          return;
        }

        const checkoutUrl = data.url ?? data.checkout_url;
        if (typeof checkoutUrl !== "string" || !checkoutUrl) {
          console.log("Billgang malformed success response:", responseText);
          sendJson(res, 502, {
            error: "Billgang checkout response missing checkout URL.",
            details: data,
          });
          return;
        }

        sendJson(res, 200, { url: checkoutUrl });
      } catch (error) {
        sendJson(res, 502, {
          error: "Failed to reach Billgang checkout API.",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    server.middlewares.use(handler);
  },
  configurePreviewServer(server) {
    const handler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (req.url !== "/api/checkout") {
        next();
        return;
      }
      if (req.method !== "POST") {
        sendJson(res, 405, { error: "Method not allowed." });
        return;
      }

      const secretKey = env.BILLGANG_SECRET_KEY?.trim();
      const shopId = env.BILLGANG_SHOP_ID;
      console.log("Using Key:", secretKey?.slice(0, 10) + "...");

      if (!secretKey) {
        sendJson(res, 500, { error: "Missing BILLGANG_SECRET_KEY on server." });
        return;
      }
      if (!isSupportedBillgangSecret(secretKey)) {
        sendJson(res, 500, {
          error: "Invalid BILLGANG_SECRET_KEY format. Expected sk_live_/sk_test_ or a JWT-style token.",
        });
        return;
      }

      let productId: number;
      try {
        const body = await readJsonBody(req);
        const resolved = body.product_id ?? body.productId;
        const parsedProductId =
          typeof resolved === "number"
            ? resolved
            : typeof resolved === "string"
              ? Number.parseInt(resolved, 10)
              : Number.NaN;
        if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
          sendJson(res, 400, { error: "product_id is required." });
          return;
        }
        productId = parsedProductId;
        console.log("Sending Product ID:", productId);
      } catch {
        sendJson(res, 400, { error: "Invalid JSON body." });
        return;
      }

      const payload = {
        product_id: productId,
        gateway: "stripe",
      };
      if (shopId) payload.shop_id = shopId;

      try {
        const response = await fetch(BILLGANG_CHECKOUT_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10_000),
        });

        const responseText = await response.text();
        const data = (() => {
          try {
            return JSON.parse(responseText) as Record<string, unknown>;
          } catch {
            return { raw: responseText };
          }
        })();

        if (!response.ok) {
          console.log("Billgang error response:", responseText);
          sendJson(res, response.status || 502, {
            error: `Billgang checkout request failed${response.status ? ` (${response.status})` : ""}.`,
            details: data,
          });
          return;
        }

        const checkoutUrl = data.url ?? data.checkout_url;
        if (typeof checkoutUrl !== "string" || !checkoutUrl) {
          console.log("Billgang malformed success response:", responseText);
          sendJson(res, 502, {
            error: "Billgang checkout response missing checkout URL.",
            details: data,
          });
          return;
        }

        sendJson(res, 200, { url: checkoutUrl });
      } catch (error) {
        sendJson(res, 502, {
          error: "Failed to reach Billgang checkout API.",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    server.middlewares.use(handler);
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      billgangCheckoutPlugin(env),
      paymentApiPlugin(env),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
