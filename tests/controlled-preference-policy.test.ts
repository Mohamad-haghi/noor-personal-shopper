import { describe, expect, it } from "vitest";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { CatalogService } from "../src/services/catalog-service";

describe("controlled soft-vs-hard preference policy comparison", () => {
  it("measures catalog coverage before proposing hard frame-material and shape constraints", async () => {
    const catalog = await new CatalogService(new DemoCatalogProvider()).listProducts();
    const sunglasses = catalog.filter((product) => product.attributes.category === "sunglasses");

    const custom = (product: (typeof catalog)[number]) => product.attributes.customAttributes;
    const matchesMaterial = (product: (typeof catalog)[number]) => custom(product).frameMaterial === "titanium";
    const matchesShape = (product: (typeof catalog)[number]) =>
      Array.isArray(custom(product).frameShapes) && (custom(product).frameShapes as unknown[]).includes("round");

    const materialMatches = sunglasses.filter(matchesMaterial);
    const shapeMatches = sunglasses.filter(matchesShape);
    const bothMatches = sunglasses.filter((product) => matchesMaterial(product) && matchesShape(product));

    // These assertions intentionally describe catalog coverage, not a production ranking policy.
    expect(catalog).toHaveLength(15);
    expect(sunglasses).toHaveLength(8);
    expect(materialMatches.map((product) => product.identity.id)).toEqual([]);
    expect(shapeMatches.map((product) => product.identity.id)).toEqual([]);
    expect(bothMatches.map((product) => product.identity.id)).toEqual([]);
  });
});
