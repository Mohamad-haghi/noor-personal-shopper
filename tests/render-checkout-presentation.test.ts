import { describe, expect, it } from "vitest";
import type { Account, Cart, Order } from "../src/domain";
import { renderCheckout } from "../src/ui/render-checkout";

function makeCart(): Cart {
  return {
    identity: { id: "demo-cart" },
    items: [{
      id: "cart-item-1",
      offerId: "demo-offer-1",
      variantId: { id: "variant-1", productId: { id: "frame-1", source: "demo" } },
      quantity: 1,
      unitPrice: 1200,
      currency: "IRR",
      priceSource: "demo",
      priceLabel: "قیمت نمایشی Demo",
      addedAt: new Date("2026-01-01T00:00:00Z"),
      notes: null,
    }],
    itemCount: 1,
    subtotal: 1200,
    currency: "IRR",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  } as unknown as Cart;
}

function makeAccount(): Account {
  return {
    identity: { id: "account-1" },
    email: "demo@example.com",
    phone: "09120000000",
    profile: { firstName: "Noor", lastName: "Demo", displayName: null, avatarUrl: null, language: "fa", region: null },
    verificationStatus: { emailVerified: false, phoneVerified: false, identityVerified: false, verifiedAt: null },
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  } as unknown as Account;
}

function makeOrder(): Order {
  return {
    identity: { id: "demo-order-1" },
    pricing: { subtotal: 1200, shipping: 350, total: 1550, currency: "IRR" },
  } as unknown as Order;
}

describe("Lab-aligned demo checkout presentation", () => {
  it("preserves the checkout form fields and fulfillment behavior hooks", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderCheckout(root, makeCart(), makeAccount());

    expect(root.innerHTML).toContain('data-checkout-form');
    expect(root.innerHTML).toContain('data-delivery-fields');
    expect(root.innerHTML).toContain('data-pickup-fields');
    expect(root.innerHTML).toContain('data-branch-id');
    expect(root.innerHTML).toContain('name="fulfillment" value="delivery"');
    expect(root.innerHTML).toContain('name="fulfillment" value="pickup"');
    expect(root.innerHTML).toContain('name="recipientName"');
    expect(root.innerHTML).toContain('name="addressLine1"');
    expect(root.innerHTML).toContain('name="postalCode"');
    expect(root.innerHTML).toContain("قیمت نمایشی Demo");
    expect(root.innerHTML).toContain("هیچ سفارش واقعی یا پرداخت بانکی");
  });

  it("renders a clear empty-cart state without creating a checkout form", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderCheckout(root, null, makeAccount());

    expect(root.innerHTML).toContain("سبد خرید شما خالی است");
    expect(root.innerHTML).toContain('href="/recommendations"');
    expect(root.innerHTML).not.toContain("data-checkout-form");
  });

  it("requires the independent Personal Shopper account before checkout", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderCheckout(root, makeCart(), null);

    expect(root.innerHTML).toContain("ورود به حساب کاربری");
    expect(root.innerHTML).toContain('href="/account"');
    expect(root.innerHTML).not.toContain("data-checkout-form");
  });

  it("renders the created demo order summary with explicit demo boundaries", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderCheckout(root, makeCart(), makeAccount(), makeOrder());

    expect(root.innerHTML).toContain("سفارش آمادهٔ پرداخت است");
    expect(root.innerHTML).toContain("demo-order-1");
    expect(root.innerHTML).toContain("مبلغ نهایی Demo");
    expect(root.innerHTML).toContain("درگاه بانکی فروشگاه نور متصل نیست");
    expect(root.innerHTML).not.toContain("data-checkout-form");
  });

  it("escapes checkout errors before rendering", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderCheckout(root, makeCart(), makeAccount(), null, '<script>alert("x")</script>');

    expect(root.innerHTML).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(root.innerHTML).not.toContain("<script>");
    expect(root.innerHTML).toContain('role="alert"');
  });
});
