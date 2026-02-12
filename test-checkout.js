import https from "node:https";

const API_KEY = process.env.BILLGANG_SECRET_KEY?.trim();
const SHOP_ID = process.env.BILLGANG_SHOP_ID?.trim();
const PRODUCT_ID = 254758606;

function request(path, method, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "pg-api.billgang.com",
        path,
        method,
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      },
    );

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testCheckout() {
  console.log("Testing Billgang Checkout API...");
  console.log("Product ID:", PRODUCT_ID);
  console.log("Shop ID:", SHOP_ID);

  const payload = {
    product_id: PRODUCT_ID,
    gateway: "stripe",
  };
  if (SHOP_ID) payload.shop_id = SHOP_ID;

  console.log("\nPayload:", JSON.stringify(payload, null, 2));

  // Try different endpoints
  const endpoints = [
    "/v1/checkout",
    "/v1/checkouts",
    "/v1/payments/checkout",
    "/checkout",
    "/checkouts",
  ];

  for (const endpoint of endpoints) {
    console.log(`\n\n=== Testing: ${endpoint} ===`);
    const response = await request(endpoint, "POST", payload);
    console.log("Response Status:", response.status);
    console.log("Response Body:", response.body.substring(0, 500));
  }
}

testCheckout().catch(console.error);
