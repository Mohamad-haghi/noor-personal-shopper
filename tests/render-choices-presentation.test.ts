import { describe, expect, it } from "vitest";
import type { Product, SavedChoice } from "../src/domain";
import { renderChoices } from "../src/ui/render-choices";

function makeProduct(overrides: Record<string, unknown> = {}): Product {
  return {
    identity: { id: "frame-1", source: "demo" },
    slug: "frame-one",
    name: "Ray-Ban RB3025",
    description: "فریم آفتابی با فرم خلبانی",
    attributes: {
      category: "sunglasses",
      subcategory: null,
      tags: [],
      customAttributes: {
        frameShapes: ["aviator"],
        frameMaterial: "metal",
        frameColor: "gold",
      },
    },
    merchandising: { isFeatured: false, isNewArrival: false, isBestSeller: false, displayPriority: 0, promotionalLabels: [] },
    media: { primaryImage: { url: "/assets/rb3025.jpg", altText: "Ray-Ban RB3025", width: 800, height: 600 }, gallery: [], videoUrl: null },
    externalIds: { sku: "SKU-001", barcode: null, providerProductId: null, externalSystemIds: {} },
    ...overrides,
  } as unknown as Product;
}

function makeChoice(): SavedChoice {
  return {
    identity: { id: "saved-choice-1" },
    variantId: { id: "variant-1", productId: { id: "frame-1", source: "demo" } },
  } as unknown as SavedChoice;
}

describe("Lab-aligned saved choices presentation", () => {
  it("renders the source-backed product image, facts and existing shopper actions", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderChoices(root, [makeChoice()], [makeProduct()]);

    expect(root.innerHTML).toContain('src="/assets/rb3025.jpg"');
    expect(root.innerHTML).toContain("Ray-Ban RB3025");
    expect(root.innerHTML).toContain("فرم فریم");
    expect(root.innerHTML).toContain("aviator");
    expect(root.innerHTML).toContain('data-remove-choice="saved-choice-1"');
    expect(root.innerHTML).toContain('data-add-to-cart="variant-1"');
    expect(root.innerHTML).toContain('href="/compare"');
    expect(root.innerHTML).toContain('href="/products/frame-1"');
    expect(root.innerHTML).toContain("فقط در همین جلسهٔ Demo");
  });

  it("escapes product-provided text before inserting it into the page", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const product = makeProduct({ name: '<script>alert("x")</script>', description: "A & B" });
    renderChoices(root, [makeChoice()], [product]);

    expect(root.innerHTML).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(root.innerHTML).toContain("A &amp; B");
    expect(root.innerHTML).not.toContain("<script>");
  });

  it("uses a neutral white-image placeholder when no primary image exists", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const product = makeProduct({ media: { primaryImage: null, gallery: [], videoUrl: null } });
    renderChoices(root, [makeChoice()], [product]);

    expect(root.innerHTML).toContain("lab-choice-image-placeholder");
    expect(root.innerHTML).not.toContain("<img");
  });

  it("renders the Lab-style empty state and keeps routes available", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderChoices(root, [], []);

    expect(root.innerHTML).toContain("هنوز فریمی ذخیره نکرده‌اید");
    expect(root.innerHTML).toContain('href="/recommendations"');
    expect(root.innerHTML).toContain('href="/products"');
    expect(root.innerHTML).not.toContain("data-remove-choice");
  });
});
