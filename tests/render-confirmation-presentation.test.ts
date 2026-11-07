import { describe, expect, it } from "vitest";
import type { Confirmation, Order } from "../src/domain";
import { renderConfirmation } from "../src/ui/render-confirmation";

function makeOrder(): Order {
  return {
    identity: { id: "demo-order-1" },
    pricing: { subtotal: 1200, discount: 0, tax: 0, shipping: 350, total: 1550, currency: "IRR" },
  } as unknown as Order;
}

function makeConfirmation(): Confirmation {
  return {
    identity: { id: "confirmation-1" },
    orderId: { id: "demo-order-1" },
    requestIdentity: { requestToken: "demo-request-1", ipAddress: null, userAgent: null, fingerprint: null },
    status: "confirmed",
    sentAt: new Date("2026-01-01T00:00:00Z"),
    confirmedAt: new Date("2026-01-01T00:01:00Z"),
  } as unknown as Confirmation;
}

describe("Lab-aligned order confirmation presentation", () => {
  it("renders confirmed order identifiers, demo total and next-step routes", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderConfirmation(root, makeConfirmation(), makeOrder());

    expect(root.innerHTML).toContain("سفارش شما با موفقیت تأیید شد");
    expect(root.innerHTML).toContain("demo-order-1");
    expect(root.innerHTML).toContain("demo-request-1");
    expect(root.innerHTML).toContain("مبلغ نهایی Demo");
    expect(root.innerHTML).toContain("مربوط به Demo هستند");
    expect(root.innerHTML).toContain('href="/choices"');
    expect(root.innerHTML).toContain('href="/recommendations"');
  });

  it("renders a clear missing-confirmation state", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderConfirmation(root, null, null);

    expect(root.innerHTML).toContain("تأیید سفارش پیدا نشد");
    expect(root.innerHTML).toContain('href="/recommendations"');
    expect(root.innerHTML).not.toContain("demo-order-1");
  });

  it("escapes order and request identifiers", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const order = { ...makeOrder(), identity: { id: '<script>alert("x")</script>' } } as unknown as Order;
    const confirmation = {
      ...makeConfirmation(),
      requestIdentity: { requestToken: '<img src=x onerror="alert(1)">', ipAddress: null, userAgent: null, fingerprint: null },
    } as unknown as Confirmation;
    renderConfirmation(root, confirmation, order);

    expect(root.innerHTML).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(root.innerHTML).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(root.innerHTML).not.toContain("<script>");
  });
});
