import { describe, expect, it } from "vitest";
import type { Comparison, Product } from "../src/domain";
import { renderCompare } from "../src/ui/render-compare";

describe("comparison product detail navigation", () => {
  it("offers an in-app detail link for each compared product", () => {
    const comparison = {
      items: [
        { variantId: { id: "variant-1", productId: { id: "product-1" } } },
        { variantId: { id: "variant-2", productId: { id: "product-2" } } },
      ],
    } as unknown as Comparison;
    const products = [
      { identity: { id: "product-1" }, name: "Frame One", attributes: { category: "sunglasses", customAttributes: {} } },
      { identity: { id: "product-2" }, name: "Frame Two", attributes: { category: "eyeglasses", customAttributes: {} } },
    ] as unknown as Product[];

    const root = { innerHTML: "" } as HTMLElement;
    renderCompare(root, comparison, products);

    expect(root.innerHTML).toContain('href="/products/product-1" data-app-link');
    expect(root.innerHTML).toContain('href="/products/product-2" data-app-link');
    expect(root.innerHTML).toContain("جزئیات Frame One");
    expect(root.innerHTML).toContain("جزئیات Frame Two");
  });
});
