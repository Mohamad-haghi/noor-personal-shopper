import { describe, expect, it } from "vitest";
import type { Comparison, Product, SavedChoice } from "../src/domain";
import { renderCompare } from "../src/ui/render-compare";

function makeProduct(id: string, name: string, overrides: Record<string, unknown> = {}): Product {
  return {
    identity: { id, source: "demo" },
    slug: id,
    name,
    description: "Demo frame",
    attributes: {
      category: "sunglasses",
      subcategory: null,
      tags: [],
      customAttributes: {
        frameShapes: ["aviator"],
        frameMaterial: "metal",
        frameColor: "gold",
        lensWidthMm: 58,
        bridgeWidthMm: 14,
        templeLengthMm: 135,
      },
    },
    merchandising: { isFeatured: false, isNewArrival: false, isBestSeller: false, displayPriority: 0, promotionalLabels: [] },
    media: { primaryImage: { url: `/assets/${id}.jpg`, altText: name, width: 800, height: 600 }, gallery: [], videoUrl: null },
    externalIds: { sku: `SKU-${id}`, barcode: null, providerProductId: null, externalSystemIds: {} },
    ...overrides,
  } as unknown as Product;
}

function makeComparison(): Comparison {
  return {
    identity: { id: "comparison-1" },
    name: "مقایسه انتخاب‌ها",
    items: [
      { variantId: { id: "variant-1", productId: { id: "frame-1", source: "demo" } } },
      { variantId: { id: "variant-2", productId: { id: "frame-2", source: "demo" } } },
    ],
    criteria: [],
    createdAt: new Date("2026-01-01T00:00:00Z"),
  } as unknown as Comparison;
}

describe("Lab-aligned comparison presentation", () => {
  it("renders product images, verified attributes, detail links and existing purchase actions", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const products = [
      makeProduct("frame-1", "Ray-Ban RB3025"),
      makeProduct("frame-2", "Persol PO0649", {
        attributes: {
          category: "eyeglasses",
          subcategory: null,
          tags: [],
          customAttributes: {
            frameShapes: ["rectangle"],
            frameMaterial: "acetate",
            frameColor: "black",
            lensWidthMm: 54,
            bridgeWidthMm: 18,
            templeLengthMm: 145,
          },
        },
      }),
    ];
    renderCompare(root, makeComparison(), products);

    expect(root.innerHTML).toContain('src="/assets/frame-1.jpg"');
    expect(root.innerHTML).toContain('src="/assets/frame-2.jpg"');
    expect(root.innerHTML).toContain("Ray-Ban RB3025");
    expect(root.innerHTML).toContain("Persol PO0649");
    expect(root.innerHTML).toContain("فرم فریم");
    expect(root.innerHTML).toContain("58 / 14 / 135 mm");
    expect(root.innerHTML).toContain('href="/products/frame-1" data-app-link');
    expect(root.innerHTML).toContain('data-add-to-cart="variant-1"');
    expect(root.innerHTML).toContain('data-add-to-cart="variant-2"');
    expect(root.innerHTML).toContain("قیمت، موجودی واقعی و امتیاز کاربران");
  });

  it("uses a neutral placeholder and explicit unknown values for incomplete product data", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const product = makeProduct("frame-1", "Frame One", {
      media: { primaryImage: null, gallery: [], videoUrl: null },
      attributes: { category: "unknown", subcategory: null, tags: [], customAttributes: {} },
    });
    const comparison = {
      items: [
        { variantId: { id: "variant-1", productId: { id: "frame-1" } } },
        { variantId: { id: "variant-2", productId: { id: "frame-2" } } },
      ],
    } as unknown as Comparison;
    renderCompare(root, comparison, [product, makeProduct("frame-2", "Frame Two")]);

    expect(root.innerHTML).toContain("lab-compare-image-placeholder");
    expect(root.innerHTML).toContain("اطلاعات ثبت نشده");
    expect(root.innerHTML).not.toContain("در Demo موجود");
  });

  it("renders an empty state when fewer than two frames are selected", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderCompare(root, null, []);

    expect(root.innerHTML).toContain("فهرست مقایسه خالی است");
    expect(root.innerHTML).toContain('href="/products"');
    expect(root.innerHTML).not.toContain("data-add-to-cart");
  });


  it("offers saved favorites below the empty state and makes each one addable to comparison", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const product = makeProduct("frame-1", "Ray-Ban RB3025");
    const favorite = {
      identity: { id: "favorite-frame-1" },
      variantId: { id: "variant-1", productId: { id: "frame-1", source: "demo" } },
      status: "saved",
      notes: null,
      tags: ["favorite"],
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    } as unknown as SavedChoice;

    renderCompare(root, null, [product], [favorite]);

    expect(root.innerHTML).toContain("فهرست مقایسه خالی است");
    expect(root.innerHTML).toContain("افزودن از علاقه‌مندی‌های شما:");
    expect(root.innerHTML).toContain('data-add-favorite-to-compare="favorite-frame-1"');
    expect(root.innerHTML).toContain("Ray-Ban RB3025");
  });

  it("escapes product-provided text in comparison headings and image alt text", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const malicious = makeProduct("frame-1", '<script>alert("x")</script>');
    const second = makeProduct("frame-2", "Frame Two");
    renderCompare(root, makeComparison(), [malicious, second]);

    expect(root.innerHTML).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(root.innerHTML).not.toContain("<script>");
  });
});
