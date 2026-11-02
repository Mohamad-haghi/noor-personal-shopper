import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const feedPath = resolve(root, "public/catalog-feed.json");
const vite = await createServer({
  configFile: resolve(root, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom"
});

let seed;
let evidenceByReference;
let verifiedScalar;
let verifiedValue;
try {
  const seedModule = await vite.ssrLoadModule("/src/providers/demo/demo-catalog-seed.ts");
  const evidenceModule = await vite.ssrLoadModule("/src/providers/demo/demo-catalog-evidence.ts");
  seed = seedModule.DEMO_CATALOG_SEED;
  evidenceByReference = evidenceModule.DEMO_CATALOG_ATTRIBUTE_EVIDENCE;
  verifiedScalar = evidenceModule.verifiedCatalogScalar;
  verifiedValue = evidenceModule.verifiedCatalogValue;
} finally {
  await vite.close();
}

const feed = JSON.parse(await readFile(feedPath, "utf8"));
assert.equal(feed.contractVersion, "1.0.0");
assert.equal(feed.source, "noor-demo");
assert.equal(feed.demoOnly, true, "feed must be explicitly demo-only");
assert.equal(feed.catalogSize, 15);
assert.equal(feed.products.length, 15);

const feedById = new Map(feed.products.map((product) => [product.id, product]));
assert.equal(feedById.size, 15, "feed product IDs must be unique");

const fieldMap = [
  ["gender", "gender", verifiedScalar],
  ["frame", "frameMaterial", verifiedValue, "frameMaterialComponents"],
  ["frameColor", "frameColor", verifiedValue, "frameColorComponents"],
  ["shape", "frameShapes", verifiedValue, "frameShapesSource"],
  ["faceCompatibility", "faceCompatibility", verifiedValue],
  ["lensColor", "lensColor", verifiedScalar],
  ["uvProtection", "uvProtection", verifiedScalar],
  ["lensWidthMm", "lensWidthMm", verifiedScalar]
];

for (const seedProduct of seed.products) {
  const id = seedProduct.identity.id;
  const custom = seedProduct.attributes.customAttributes ?? {};
  const reference = custom.noorReference;
  const evidence = evidenceByReference[reference];
  const feedProduct = feedById.get(id);

  assert.ok(feedProduct, `missing feed product ${id}`);
  assert.equal(feedProduct.noorReference, reference, `reference mismatch for ${id}`);
  assert.equal(feedProduct.price, null, `demo feed must not assert a real price for ${id}`);
  assert.equal(feedProduct.availability, true);
  assert.equal(feedProduct.availabilityStatus, "available_demo");
  assert.equal(feedProduct.availabilitySource, "demo");
  assert.equal("catalogEvidence" in feedProduct, false, "internal provenance ledger must not leak into the public feed");

  for (const [feedField, evidenceField, project, aliasField] of fieldMap) {
    const rawValue = aliasField
      ? (custom[aliasField] ?? custom[evidenceField])
      : custom[evidenceField];
    const expected = project(evidence, evidenceField, rawValue);
    assert.deepEqual(
      feedProduct[feedField],
      expected,
      `${id}.${feedField} must equal the evidence-gated ${evidenceField} projection`
    );
  }
}

// Pin exact, source-audited composite records so future changes cannot silently
// flatten or drop their arrays from the public feed.
const byReference = new Map(feed.products.map((product) => [product.noorReference, product]));
assert.deepEqual(byReference.get("1000058221")?.shape, ["angular", "oval"]);
assert.deepEqual(byReference.get("1000058221")?.frame, ["acetate", "metal"]);
assert.deepEqual(byReference.get("1000127106")?.frame, ["acetate", "metal"]);
assert.deepEqual(byReference.get("1000127106")?.frameColor, ["black", "gold"]);
assert.equal(byReference.get("1000127057")?.frame, null, "conflicting Prada PR03YS construction must remain withheld");
assert.equal(byReference.get("1000127057")?.frameColor, "havana brown");

console.log("Verified 15-product demo feed: evidence-gated scalar/array fields, unique IDs, no real prices, synthetic demo availability.");
