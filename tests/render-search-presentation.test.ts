import { describe, expect, it } from "vitest";
import type { Product, SearchResponse } from "../src/domain";
import { renderSearch } from "../src/ui/render-search";

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

function makeResponse(text = "عینک آفتابی"): SearchResponse {
  return {
    query: { text, limit: 12, offset: 0 },
    results: [{ productId: { id: "frame-1", source: "demo" }, score: 0.92, matchedAttributes: ["frameShapes"], reasons: ["فرم فریم با عبارت جست‌وجو هماهنگ است."] }],
    total: 1,
  } as unknown as SearchResponse;
}

describe("Lab-aligned search presentation", () => {
  it("renders search controls, source-backed product imagery and shopper handoff", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderSearch(root, makeResponse(), [makeProduct()]);

    expect(root.innerHTML).toContain('data-search-form');
    expect(root.innerHTML).toContain('name="q"');
    expect(root.innerHTML).toContain('value="عینک آفتابی"');
    expect(root.innerHTML).toContain('src="/assets/rb3025.jpg"');
    expect(root.innerHTML).toContain("Ray-Ban RB3025");
    expect(root.innerHTML).toContain("فرم فریم با عبارت جست‌وجو هماهنگ است");
    expect(root.innerHTML).toContain('href="/products/frame-1"');
    expect(root.innerHTML).toContain('href="/shopper?from=search&amp;query=عینک%20آفتابی"');
  });

  it("renders the no-results state and consultation route", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const response = { ...makeResponse("فریم ناموجود"), results: [], total: 0 } as unknown as SearchResponse;
    renderSearch(root, response, []);

    expect(root.innerHTML).toContain("نتیجه‌ای پیدا نشد");
    expect(root.innerHTML).toContain('href="/shopper?from=search"');
    expect(root.innerHTML).not.toContain("lab-search-product-card");
  });

  it("renders similar frames separately from direct search results", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const response = { ...makeResponse(""), results: [], total: 0 } as unknown as SearchResponse;
    renderSearch(root, response, [makeProduct()], [makeProduct()]);

    expect(root.innerHTML).toContain("فریم‌های مشابه");
    expect(root.innerHTML).toContain("فریم مشابه بر اساس DNA ساختاری");
    expect(root.innerHTML).toContain("lab-search-similar");
  });

  it("escapes query, product name and search reasons", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const response = {
      ...makeResponse('<script>alert("x")</script>'),
      results: [{
        productId: { id: "frame-1", source: "demo" },
        score: 0.9,
        matchedAttributes: [],
        reasons: ['<img src=x onerror="alert(1)">'],
      }],
    } as unknown as SearchResponse;
    const product = { ...makeProduct(), name: '<script>alert("product")</script>' } as unknown as Product;
    renderSearch(root, response, [product]);

    expect(root.innerHTML).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(root.innerHTML).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(root.innerHTML).not.toContain("<script>");
  });
});
