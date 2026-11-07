import { describe, expect, it } from "vitest";
import type { Cart, Product } from "../src/domain";
import { renderCart } from "../src/ui/render-cart";

function makeProduct(): Product {
  return {
    identity: { id: "frame-1", source: "demo" },
    slug: "frame-one",
    name: "Ray-Ban RB3025",
    description: "Demo frame",
    attributes: { category: "sunglasses", subcategory: null, tags: [], customAttributes: {} },
    merchandising: { isFeatured: false, isNewArrival: false, isBestSeller: false, displayPriority: 0, promotionalLabels: [] },
    media: { primaryImage: { url: "/assets/rb3025.jpg", altText: "Ray-Ban RB3025", width: 800, height: 600 }, gallery: [], videoUrl: null },
    externalIds: { sku: "SKU-001", barcode: null, providerProductId: null, externalSystemIds: {} },
  } as unknown as Product;
}

function makeCart(): Cart {
  return {
    identity: { id: "demo-cart" },
    items: [{
      id: "cart-item-1",
      offerId: "demo-offer-1",
      variantId: { id: "variant-1", productId: { id: "frame-1", source: "demo" } },
      quantity: 2,
      unitPrice: 1200,
      currency: "IRR",
      priceSource: "demo",
      priceLabel: "قیمت نمایشی Demo",
      addedAt: new Date("2026-01-01T00:00:00Z"),
      notes: null,
    }],
    itemCount: 2,
    subtotal: 2400,
    currency: "IRR",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  } as unknown as Cart;
}

describe("Lab-aligned demo cart presentation", () => {
  it("renders source-backed product imagery, demo price, quantity and existing actions", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderCart(root, makeCart(), [makeProduct()]);

    expect(root.innerHTML).toContain('src="/assets/rb3025.jpg"');
    expect(root.innerHTML).toContain("Ray-Ban RB3025");
    expect(root.innerHTML).toContain("قیمت نمایشی Demo");
    expect(root.innerHTML).toContain("تعداد: 2");
    expect(root.innerHTML).toContain('data-cart-remove="cart-item-1"');
    expect(root.innerHTML).toContain('href="/products/frame-1"');
    expect(root.innerHTML).toContain('href="/checkout"');
    expect(root.innerHTML).toContain("مبلغ قابل پرداخت نیست");
  });

  it("renders a neutral placeholder when the product image is unavailable", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const product = { ...makeProduct(), media: { primaryImage: null, gallery: [], videoUrl: null } } as unknown as Product;
    renderCart(root, makeCart(), [product]);

    expect(root.innerHTML).toContain("lab-cart-image-placeholder");
    expect(root.innerHTML).not.toContain("<img");
  });

  it("renders an empty cart state with working routes", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderCart(root, null, []);

    expect(root.innerHTML).toContain("سبد خرید شما خالی است");
    expect(root.innerHTML).toContain('href="/recommendations"');
    expect(root.innerHTML).toContain('href="/products"');
    expect(root.innerHTML).not.toContain("data-cart-remove");
  });

  it("escapes product and price labels before rendering", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const cart = {
      ...makeCart(),
      items: [{ ...makeCart().items[0], priceLabel: '<script>alert("x")</script>' }],
    } as unknown as Cart;
    const product = { ...makeProduct(), name: '<img src=x onerror="alert(1)">' } as unknown as Product;
    renderCart(root, cart, [product]);

    expect(root.innerHTML).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(root.innerHTML).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(root.innerHTML).not.toContain("<script>");
  });
});
