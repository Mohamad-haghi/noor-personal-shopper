import { describe, expect, it } from "vitest";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { CatalogService } from "../src/services/catalog-service";

describe("G5 catalog routes data", () => {
  it("exposes the complete demo catalog through CatalogService", async () => {
    const service = new CatalogService(new DemoCatalogProvider());
    const products = await service.listProducts();

    expect(products.length).toBeGreaterThanOrEqual(15);

    for (const product of products) {
      const variants = await service.listVariants(product.identity);
      expect(variants.length).toBeGreaterThan(0);
      expect(variants.every((variant) => variant.identity.productId.id === product.identity.id)).toBe(true);
    }
  });

  it("resolves product detail data by the existing ProductId contract", async () => {
    const service = new CatalogService(new DemoCatalogProvider());
    const products = await service.listProducts();
    const first = products[0];

    expect(first).toBeDefined();
    const product = await service.getProduct(first!.identity);

    expect(product?.identity).toEqual(first!.identity);
    expect(product?.slug).toBeTruthy();
  });
});
