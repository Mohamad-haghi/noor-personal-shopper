import { describe, expect, it } from "vitest";
import { resolveRoute } from "../src/app/routing/routes";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { DemoCommerceProvider } from "../src/providers/demo/demo-commerce-provider";
import { renderManagerOverview } from "../src/ui/render-manager-overview";
import { renderProducts, renderProductDetail } from "../src/ui/render-products";

function fakeRoot(): HTMLElement {
  return { innerHTML: "" } as HTMLElement;
}

describe("Level 1 demo truth and manager overview", () => {
  it("keeps all 15 sample products selectable with demo-only availability and pricing", async () => {
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog);
    const products = await catalog.listProducts();
    expect(products).toHaveLength(15);

    const variantsByProduct = new Map<string, Awaited<ReturnType<typeof catalog.listVariants>>>();
    const offers = [];
    for (const product of products) {
      const variants = await catalog.listVariants(product.identity);
      variantsByProduct.set(product.identity.id, variants);
      expect(variants.length).toBeGreaterThan(0);
      expect(variants.every((variant) => variant.availability.source === "demo" && variant.availability.isAvailable)).toBe(true);
      for (const variant of variants) {
        const offer = await commerce.getOffer(variant.identity);
        expect(offer?.pricing.source).toBe("demo");
        expect(offer?.availability.source).toBe("demo");
        expect(offer?.pricing.label).toContain("نمایشی");
        if (offer) offers.push(offer);
      }
    }

    const root = fakeRoot();
    renderProducts(root, products, variantsByProduct, offers);
    expect(root.innerHTML).toContain("قیمت نمایشی دمو — قیمت واقعی نور نیست");
    expect(root.innerHTML).toContain("موجودی فرضی دمو — موجودی واقعی نور نیست");
    expect(root.innerHTML).toContain('href="/shopper"');
  });

  it("labels product detail pricing and availability as hypothetical demo data", async () => {
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog);
    const product = (await catalog.listProducts())[0];
    const variants = await catalog.listVariants(product.identity);
    const offers = [];
    for (const variant of variants) {
      const offer = await commerce.getOffer(variant.identity);
      if (offer) offers.push(offer);
    }

    const root = fakeRoot();
    renderProductDetail(root, product, variants, offers);
    expect(root.innerHTML).toContain("قیمت نمایشی دمو — قیمت واقعی نور نیست");
    expect(root.innerHTML).toContain("موجودی فرضی دمو — موجودی واقعی نور نیست");
    expect(root.innerHTML).toContain('href="/shopper"');
  });

  it("provides a read-only manager overview without inventing business performance metrics", async () => {
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog);
    const products = await catalog.listProducts();
    const variants = (await Promise.all(products.map((product) => catalog.listVariants(product.identity)))).flat();
    const offers = [];
    for (const variant of variants) {
      const offer = await commerce.getOffer(variant.identity);
      if (offer) offers.push(offer);
    }

    const root = fakeRoot();
    renderManagerOverview(root, { products, variants, offers });
    expect(root.innerHTML).toContain("نمای کلی مدیر");
    expect(root.innerHTML).toContain("متصل نیست");
    expect(root.innerHTML).toContain("قابل گزارش نیست");
    expect(root.innerHTML).toContain("داده‌های نمایشی");
    expect(root.innerHTML).not.toContain("نرخ تبدیل واقعی");
    expect(resolveRoute("/manager")?.route.title).toBe("نمای کلی مدیر");
  });
});
