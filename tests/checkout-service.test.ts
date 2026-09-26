import { describe, expect, it } from "vitest";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { DemoCommerceProvider } from "../src/providers/demo/demo-commerce-provider";
import { DemoCartProvider } from "../src/providers/demo/demo-cart-provider";
import { DemoCheckoutProvider } from "../src/providers/demo/demo-checkout-provider";
import { CartService } from "../src/services/cart-service";
import { CheckoutService } from "../src/services/checkout-service";

const cartId = { id: "demo-checkout-cart" };
const accountId = { id: "demo-account-checkout" };

async function createCart() {
  const catalog = new DemoCatalogProvider();
  const commerce = new DemoCommerceProvider(catalog);
  const cart = new CartService(new DemoCartProvider());
  const products = await catalog.listProducts();
  const variants = await catalog.listVariants(products[0].identity);
  const offer = await commerce.getOffer(variants[0].identity);
  return cart.addCommerceOffer(cartId, offer!);
}

describe("D7-C checkout", () => {
  it("creates a priced delivery order from the cart", async () => {
    const cart = await createCart();
    const checkout = new CheckoutService(new DemoCheckoutProvider(new DemoCartProvider()));
    const provider = new DemoCartProvider();
    await provider.addItem(cartId, cart.items[0]);

    const order = await checkout.createOrderFromCart({
      cartId,
      accountId,
      shopper: { recipientName: "کاربر Demo", phone: "09120000000" },
      fulfillment: {
        method: "delivery",
        address: {
          recipientName: "کاربر Demo",
          addressLine1: "خیابان نمونه",
          addressLine2: null,
          city: "تهران",
          state: "تهران",
          postalCode: "1234567890",
          country: "IR",
          phone: "09120000000",
        },
      },
    });
    expect(order.status).toBe("draft");
    expect(order.pricing.subtotal).toBe(cart.subtotal);
    expect(order.pricing.discount).toBe(0);
    expect(order.pricing.tax).toBe(0);
    expect(order.pricing.shipping).toBe(350_000);
    expect(order.pricing.total).toBe(cart.subtotal + 350_000);
    expect(order.shipping?.method).toBe("delivery");
  });

  it("creates a pickup order with zero delivery shipping", async () => {
    const provider = new DemoCartProvider();
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog);
    const cart = new CartService(provider);
    const products = await catalog.listProducts();
    const variants = await catalog.listVariants(products[0].identity);
    const offer = await commerce.getOffer(variants[0].identity);
    const stored = await cart.addCommerceOffer(cartId, offer!);

    const checkout = new CheckoutService(new DemoCheckoutProvider(provider));
    const order = await checkout.createOrderFromCart({
      cartId,
      accountId,
      shopper: { recipientName: "کاربر Demo", phone: null },
      fulfillment: { method: "pickup", branchId: "demo-branch-1" },
    });

    expect(order.pricing.subtotal).toBe(stored.subtotal);
    expect(order.pricing.shipping).toBe(0);
    expect(order.pricing.total).toBe(stored.subtotal);
    expect(order.shipping?.method).toBe("pickup");
    expect(order.shipping?.branchId).toBe("demo-branch-1");
  });

  it("rejects checkout for an empty cart", async () => {
    const provider = new DemoCartProvider();
    const checkout = new CheckoutService(new DemoCheckoutProvider(provider));
    await expect(checkout.createOrderFromCart({
      cartId,
      accountId,
      shopper: { recipientName: "کاربر Demo", phone: null },
      fulfillment: { method: "pickup", branchId: "demo-branch-1" },
    })).rejects.toThrow("سبد خرید خالی است");
  });
});
