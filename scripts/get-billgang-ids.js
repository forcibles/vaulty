import https from "node:https";

const API_KEY = process.env.BILLGANG_SECRET_KEY?.trim();
const HOST = "pg-api.billgang.com";

function request(path) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: HOST,
        path,
        method: "GET",
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
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error(`Invalid JSON response (${res.statusCode}): ${data.slice(0, 300)}`));
          }
        });
      },
    );

    req.on("error", reject);
    req.end();
  });
}

async function findIds() {
  if (!API_KEY) {
    console.error("Missing BILLGANG_SECRET_KEY in environment.");
    process.exit(1);
  }

  console.log("Scanning Billgang Account...");

  const user = await request("/v1/dash/user");
  if (!user?.data?.shops?.length) {
    console.error("Could not fetch shops. Check Secret Key.");
    console.error("Response:", JSON.stringify(user));
    return;
  }

  const shop = user.data.shops[0];
  console.log(`\nShop Found: ${shop.name}`);
  console.log(`ID (UUID): ${shop.id}`);
  console.log(`Domain: ${shop.domain}`);

  const products = await request(`/v1/dash/shops/${shop.id}/products`);
  console.log("\nProducts Found:");

  const list = Array.isArray(products?.data) ? products.data : [];
  for (const p of list) {
    console.log(`- ${p.name}`);
    console.log(`  ID (Int): ${p.id}`);
    console.log(`  Slug: ${p.uniquePath}`);
  }
}

findIds().catch((error) => {
  console.error("Billgang request failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
