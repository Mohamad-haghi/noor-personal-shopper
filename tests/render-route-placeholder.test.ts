import { describe, expect, it } from "vitest";
import type { RouteMatch } from "../src/app/routing/routes";
import { renderRoutePlaceholder } from "../src/ui/render-route-placeholder";

describe("standalone demo payment route presentation", () => {
  it("explains that payment is reached through checkout without implying a real gateway", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const match = {
      route: { path: "/payment", title: "پرداخت", navigationLabel: "پرداخت" },
      params: {},
    } as RouteMatch;

    renderRoutePlaceholder(root, match);

    expect(root.innerHTML).toContain('class="route-placeholder lab-payment-page"');
    expect(root.innerHTML).toContain("پرداخت نمایشی");
    expect(root.innerHTML).toContain("پس از ثبت سفارش");
    expect(root.innerHTML).toContain("هیچ اطلاعات کارت بانکی دریافت نمی‌شود");
    expect(root.innerHTML).toContain('href="/checkout" data-app-link');
    expect(root.innerHTML).not.toContain('name="cardNumber"');
  });
});
