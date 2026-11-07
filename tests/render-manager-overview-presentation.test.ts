import { describe, expect, it } from "vitest";
import type { CommerceOffer, Product, ProductVariant } from "../src/domain";
import { renderManagerOverview } from "../src/ui/render-manager-overview";

function makeProduct(id: string, complete: boolean): Product {
  return {
    identity: { id, source: "demo" },
    slug: id,
    name: id,
    description: "Demo frame",
    attributes: {
      category: "sunglasses",
      subcategory: null,
      tags: [],
      customAttributes: complete
        ? { frameShapes: ["aviator"], frameMaterial: "metal", frameColor: "gold" }
        : { frameShapes: [], frameMaterial: null, frameColor: null },
    },
    merchandising: { isFeatured: false, isNewArrival: false, isBestSeller: false, displayPriority: 0, promotionalLabels: [] },
    media: { primaryImage: null, gallery: [], videoUrl: null },
    externalIds: { sku: id, barcode: null, providerProductId: null, externalSystemIds: {} },
  } as unknown as Product;
}

function makeVariant(id: string, available: boolean): ProductVariant {
  return {
    identity: { id },
    availability: { source: "demo", isAvailable: available, quantity: null },
  } as unknown as ProductVariant;
}

function makeOffer(): CommerceOffer {
  return {
    identity: { id: "offer-1" },
    pricing: { source: "demo", amount: 1000, currency: "IRR" },
    availability: { source: "demo", isAvailable: true },
  } as unknown as CommerceOffer;
}

describe("Lab-aligned manager evidence coverage", () => {
  it("renders field coverage from catalog facts and keeps demo metrics", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderManagerOverview(root, {
      products: [makeProduct("frame-1", true), makeProduct("frame-2", false)],
      variants: [makeVariant("variant-1", true), makeVariant("variant-2", false)],
      offers: [makeOffer()],
    });

    expect(root.innerHTML).toContain("پوشش ویژگی‌های محصول");
    expect(root.innerHTML).toContain("aria-label=\"پوشش نوع\"");
    expect(root.innerHTML).toContain("aria-valuenow=\"100\"");
    expect(root.innerHTML).toContain("aria-label=\"پوشش فرم\"");
    expect(root.innerHTML).toContain("aria-valuenow=\"50\"");
    expect(root.innerHTML).toContain("محصولات نمونه");
    expect(root.innerHTML).toContain("تنوع‌های فرضیِ قابل انتخاب");
    expect(root.innerHTML).toContain("قیمت‌های نمایشی");
    expect(root.innerHTML).toContain("فروش و تبدیل واقعی");
    expect(root.innerHTML).toContain('href="/shopper"');
  });

  it("handles an empty catalog without dividing by zero", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderManagerOverview(root, { products: [], variants: [], offers: [] });

    expect(root.innerHTML).toContain("پوشش ویژگی‌های محصول");
    expect(root.innerHTML).toContain('aria-valuenow="0"');
    expect(root.innerHTML).toContain("داده‌های نمایشی");
  });
});
