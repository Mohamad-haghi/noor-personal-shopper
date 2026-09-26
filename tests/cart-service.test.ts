import { describe, expect, it } from "vitest";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { DemoCommerceProvider } from "../src/providers/demo/demo-commerce-provider";
import { DemoCartProvider } from "../src/providers/demo/demo-cart-provider";
import { CartService } from "../src/services/cart-service";

const cartId = { id: "demo-cart" };

describe("D7-B cart behavior", () => {
  it("adds a priced CommerceOffer and calculates quantity and subtotal", async () => {
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog);
    const cart = new CartService(new DemoCartProvider());
    const offer = await commerce.getOffer((await catalog.listVariants((await catalog.listProducts())[0].identity))[0].identity);
    expect(offer).not.toBeNull();

    const first = await cart.addCommerceOffer(cartId, offer!);
    expect(first.items).toHaveLength(1);
    expect(first.itemCount).toBe(1);
    expect(first.subtotal).toBe(offer!.pricing.amount);
    expect(first.items[0].priceSource).toBe("demo");
    expect(first.items[0].priceLabel).toBe("قیمت نمایشی Demo");
  });

  it("merges repeated additions of the same offer without losing the price snapshot", async () => {
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog);
    const cart = new CartService(new DemoCartProvider());
    const variants = await catalog.listVariants((await catalog.listProducts())[0].identity);
    const offer = await commerce.getOffer(variants[0].identity);

    await cart.addCommerceOffer(cartId, offer!, 2);
    const updated = await cart.addCommerceOffer(cartId, offer!, 1);

    expect(updated.items).toHaveLength(1);
    expect(updated.items[0].quantity).toBe(3);
    expect(updated.itemCount).toBe(3);
    expect(updated.subtotal).toBe(offer!.pricing.amount * 3);
  });

  it("removes items and recalculates an empty cart", async () => {
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog);
    const provider = new DemoCartProvider();
    const cart = new CartService(provider);
    const variants = await catalog.listVariants((await catalog.listProducts())[0].identity);
    const offer = await commerce.getOffer(variants[0].identity);

    const populated = await cart.addCommerceOffer(cartId, offer!);
    const empty = await cart.removeItem(cartId, populated.items[0].id);

    expect(empty.items).toHaveLength(0);
    expect(empty.itemCount).toBe(0);
    expect(empty.subtotal).toBe(0);
  });

  it("rejects non-purchasable offers", async () => {
    const cart = new CartService(new DemoCartProvider());
    const offer = {
      identity: { id: "blocked-offer" },
      variantId: { id: "variant", productId: { id: "product" } },
      pricing: { amount: 100, currency: "IRR", source: "demo" as const, label: "قیمت نمایشی Demo" },
      purchasable: false,
      availability: { source: "demo" as const, isAvailable: false },
    };

    await expect(cart.addCommerceOffer(cartId, offer)).rejects.toThrow();
  });
});
