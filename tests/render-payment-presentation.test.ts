import { describe, expect, it } from "vitest";
import type { Order, Payment } from "../src/domain";
import { renderPaymentState } from "../src/ui/render-checkout";

function makeOrder(status: "draft" | "confirmed" = "draft"): Order {
  return {
    identity: { id: "demo-order-1" },
    accountId: { id: "account-1" },
    cartId: { id: "demo-cart" },
    status,
    items: [],
    pricing: { subtotal: 1200, discount: 0, tax: 0, shipping: 350, total: 1550, currency: "IRR" },
    shipping: null,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  } as unknown as Order;
}

function makePayment(status: "captured" | "failed"): Payment {
  return {
    identity: { id: "payment-1" },
    orderId: { id: "demo-order-1" },
    amount: 1550,
    currency: "IRR",
    method: "digital_wallet",
    status,
    transaction: {
      providerTransactionId: "demo-transaction-1",
      authorizationCode: null,
      capturedAt: status === "captured" ? new Date("2026-01-01T00:01:00Z") : null,
      failureReason: status === "failed" ? "demo_failure" : null,
    },
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:01:00Z"),
  } as unknown as Payment;
}

function makeRoot(): HTMLElement {
  return { innerHTML: "", querySelector: () => null } as unknown as HTMLElement;
}

describe("Lab-aligned demo payment presentation", () => {
  it("renders the demo payment action and failure simulation toggle", () => {
    const root = makeRoot();
    renderPaymentState(root, makeOrder(), null, async () => {});

    expect(root.innerHTML).toContain("پرداخت سفارش");
    expect(root.innerHTML).toContain('data-simulate-failure');
    expect(root.innerHTML).toContain('data-demo-pay');
    expect(root.innerHTML).toContain("هیچ اطلاعات کارت بانکی دریافت یا ارسال نمی‌شود");
    expect(root.innerHTML).toContain("demo-order-1");
    expect(root.innerHTML).not.toContain("name=\"cardNumber\"");
  });

  it("renders a failed payment with the existing retry action", () => {
    const root = makeRoot();
    renderPaymentState(root, makeOrder("draft"), makePayment("failed"), async () => {});

    expect(root.innerHTML).toContain("پرداخت انجام نشد");
    expect(root.innerHTML).toContain("ناموفق");
    expect(root.innerHTML).toContain('data-demo-retry');
    expect(root.innerHTML).toContain("بازگشت به تکمیل سفارش");
  });

  it("renders a successful demo payment without exposing a real payment gateway", () => {
    const root = makeRoot();
    renderPaymentState(root, makeOrder("confirmed"), makePayment("captured"), async () => {});

    expect(root.innerHTML).toContain("پرداخت Demo موفق بود");
    expect(root.innerHTML).toContain("تأیید و ذخیره‌شده در Demo");
    expect(root.innerHTML).toContain("demo-transaction-1");
    expect(root.innerHTML).toContain("هیچ درگاه بانکی واقعی");
    expect(root.innerHTML).not.toContain("data-demo-retry");
  });

  it("escapes order and transaction identifiers", () => {
    const root = makeRoot();
    const order = { ...makeOrder(), identity: { id: '<script>alert("x")</script>' } } as unknown as Order;
    const payment = {
      ...makePayment("failed"),
      transaction: { ...makePayment("failed").transaction!, providerTransactionId: '<img src=x onerror="alert(1)">' },
    } as unknown as Payment;
    renderPaymentState(root, order, payment, async () => {});

    expect(root.innerHTML).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(root.innerHTML).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(root.innerHTML).not.toContain("<script>");
  });
});
