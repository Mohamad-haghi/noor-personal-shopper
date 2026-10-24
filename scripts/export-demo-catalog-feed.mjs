import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "public/catalog-feed.json");
const vite = await createServer({
  configFile: resolve(root, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom"
});
let seed;
try {
  const loaded = await vite.ssrLoadModule("/src/providers/demo/demo-catalog-seed.ts");
  seed = loaded.DEMO_CATALOG_SEED;
} finally {
  await vite.close();
}

if (!seed || !Array.isArray(seed.products) || seed.products.length !== 15) {
  throw new Error("demo_catalog_feed_requires_exactly_15_seed_products");
}
const ids = new Set();
const products = seed.products.map((product) => {
  const id = product?.identity?.id;
  if (typeof id !== "string" || !id.trim() || ids.has(id)) {
    throw new Error("demo_catalog_feed_product_identity_invalid");
  }
  ids.add(id);
  const custom = product.attributes?.customAttributes ?? {};
  const image = product.media?.primaryImage?.url ?? null;
  return {
    id,
    sku: product.externalIds?.sku ?? id,
    name: product.name,
    type: product.attributes?.category ?? null,
    subcategory: product.attributes?.subcategory ?? null,
    description: product.description ?? null,
    model: typeof custom.model === "string" ? custom.model : null,
    noorReference: typeof custom.noorReference === "string" ? custom.noorReference : null,
    gender: typeof custom.gender === "string" ? custom.gender : null,
    frame: typeof custom.frameMaterial === "string" ? custom.frameMaterial : null,
    frameColor: typeof custom.frameColor === "string" ? custom.frameColor : null,
    shape: Array.isArray(custom.frameShapes) ? custom.frameShapes.join(", ") : null,
    faceCompatibility: Array.isArray(custom.faceCompatibility) ? custom.faceCompatibility : null,
    lensColor: typeof custom.lensColor === "string" ? custom.lensColor : null,
    lensFeature: typeof custom.lensFeature === "string" ? custom.lensFeature : null,
    prescriptionCapable: typeof custom.prescriptionCapable === "boolean" ? custom.prescriptionCapable : null,
    uvProtection: typeof custom.uvProtection === "string" ? custom.uvProtection : null,
    lensWidthMm: typeof custom.lensWidthMm === "number" ? custom.lensWidthMm : null,
    image,
    images: image ? [image] : [],
    price: null,
    // Synthetic inventory is intentionally usable by COR in demo mode only.
    // It is not a claim about NOOR's live inventory.
    availability: true,
    availabilityStatus: "available_demo",
    availabilitySource: "demo"
  };
});
const feed = {
  contractVersion: "1.0.0",
  source: "noor-demo",
  demoOnly: true,
  catalogSize: products.length,
  products
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(feed, null, 2) + "\n", "utf8");
console.log(`Generated demo-only catalog feed with ${products.length} products; availability is synthetic and demo-only.`);
