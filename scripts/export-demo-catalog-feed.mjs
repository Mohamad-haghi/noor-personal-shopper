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
let verifiedScalar;
let verifiedValue;
try {
  const loaded = await vite.ssrLoadModule("/src/providers/demo/demo-catalog-seed.ts");
  const evidenceModule = await vite.ssrLoadModule("/src/providers/demo/demo-catalog-evidence.ts");
  seed = loaded.DEMO_CATALOG_SEED;
  verifiedScalar = evidenceModule.verifiedCatalogScalar;
  verifiedValue = evidenceModule.verifiedCatalogValue;
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
  const evidence = custom.catalogEvidence ?? null;
  return {
    id,
    sku: product.externalIds?.sku ?? id,
    name: product.name,
    type: product.attributes?.category ?? null,
    subcategory: product.attributes?.subcategory ?? null,
    description: product.description ?? null,
    model: typeof custom.model === "string" ? custom.model : null,
    noorReference: typeof custom.noorReference === "string" ? custom.noorReference : null,
    // Only exact-source-verified values are exported. Multi-valued shape/face facts
    // remain arrays and are consumed by the paired COR array-capable Mapping v1.2 path.
    gender: verifiedScalar(evidence, "gender", custom.gender),
    frame: verifiedScalar(evidence, "frameMaterial", custom.frameMaterial),
    frameColor: verifiedScalar(evidence, "frameColor", custom.frameColor),
    shape: verifiedValue(evidence, "frameShapes", custom.frameShapes),
    faceCompatibility: verifiedValue(evidence, "faceCompatibility", custom.faceCompatibility),
    lensColor: verifiedScalar(evidence, "lensColor", custom.lensColor),
    uvProtection: verifiedScalar(evidence, "uvProtection", custom.uvProtection),
    lensWidthMm: verifiedScalar(evidence, "lensWidthMm", custom.lensWidthMm),
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
