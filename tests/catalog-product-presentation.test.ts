import { describe, expect, it } from "vitest";
import type { CommerceOffer, Product, ProductVariant } from "../src/domain";
import { renderProducts, renderProductDetail } from "../src/ui/render-products";

function makeProduct(overrides: Record<string, unknown> = {}): Product {
  return {
    identity: { id: "frame-1" },
    externalIds: { sku: "SKU-001" },
    name: "Frame One",
    description: "A demo frame",
    attributes: {
      category: "sunglasses",
      customAttributes: {
        frameShapes: ["aviator"],
        frameMaterial: "acetate",
        frameColor: null,
        frameColorComponents: ["black", "gold"],
        lensColor: "green",
        lensWidthMm: 54,
        bridgeWidthMm: 18,
        templeLengthMm: 145,
        gender: "unisex",
        ...((overrides.customAttributes as Record<string, unknown> | undefined) ?? {}),
      },
    },
    media: {
      primaryImage: { url: "/frame.jpg", altText: "Frame One" },
      gallery: [{ url: "/frame.jpg", altText: "Frame One front" }],
    },
    ...overrides,
  } as unknown as Product;
}

describe("catalog and product detail presentation", () => {
  it("shows source-backed product facts and makes demo pricing disclosure explicit", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderProducts(root, [makeProduct()], new Map(), []);

    expect(root.innerHTML).toContain("فریم‌ها را با دقت بیشتری بشناسید");
    expect(root.innerHTML).toContain("aviator");
    expect(root.innerHTML).toContain("acetate");
    expect(root.innerHTML).toContain("قیمت‌های نمایشی");
    expect(root.innerHTML).toContain("مشاهدهٔ جزئیات");
    expect(root.innerHTML).not.toContain("موجودی فرضی دمو");
  });

  it("renders only known detail facts and omits unresolved values instead of guessing", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const product = makeProduct({ customAttributes: { frameShapes: [], frameMaterial: null, frameColor: null, lensColor: null } });
    renderProductDetail(root, product, [], []);

    expect(root.innerHTML).toContain("مشخصات ثبت‌شده");
    expect(root.innerHTML).toContain("ابعاد عدسی / پل / دسته");
    expect(root.innerHTML).not.toContain("فرم فریم</dt>");
    expect(root.innerHTML).not.toContain("جنس فریم</dt>");
    expect(root.innerHTML).toContain("عمداً حدس زده نشده‌اند");
    expect(root.innerHTML).toContain("تصویر محصول");
    expect(root.innerHTML).toContain("گزینه‌های نمایشی");
  });

  it("preserves detail, save and compare actions for demo variants", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const variant = {
      identity: { id: "variant-1" },
      name: "Standard",
      availability: { isAvailable: true, source: "demo" },
      attributes: { color: "Black", size: "54", material: "acetate" },
    } as unknown as ProductVariant;

    renderProductDetail(root, makeProduct(), [variant], []);

    expect(root.innerHTML).toContain('data-add-to-cart="variant-1"');
    expect(root.innerHTML).toContain('data-save-product-choice="variant-1"');
    expect(root.innerHTML).toContain('data-compare-product="variant-1"');
    expect(root.innerHTML).toContain("قیمت نمایشی ثبت نشده");
  });

  it("does not render a purchase offer from a non-demo source", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const product = makeProduct();
    const variant = {
      identity: { id: "variant-1" },
      name: "Standard",
      availability: { isAvailable: true, source: "demo" },
    } as unknown as ProductVariant;
    const offer = {
      variantId: { id: "variant-1" },
      pricing: { amount: 100, source: "external" },
      availability: { source: "demo" },
    } as unknown as CommerceOffer;

    renderProducts(root, [product], new Map([["frame-1", [variant]]]), [offer]);
    expect(root.innerHTML).toContain("قیمت نمایشی دمو — قیمت واقعی نور نیست");
    expect(root.innerHTML).not.toContain(">100 ریال<");
  });
});
