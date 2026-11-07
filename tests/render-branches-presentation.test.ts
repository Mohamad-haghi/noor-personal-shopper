import { describe, expect, it } from "vitest";
import type { Branch } from "../src/domain";
import { renderBranches } from "../src/ui/render-branches";

function makeBranch(overrides: Record<string, unknown> = {}): Branch {
  return {
    identity: { id: "branch-1" },
    code: "NOOR-TEH-01",
    name: "شعبه مرکزی نور",
    location: {
      city: "تهران",
      region: "مرکز",
      address: "خیابان نمونه، پلاک ۱۲",
      latitude: null,
      longitude: null,
    },
    services: ["fitting", "consultation", "pickup"],
    ...overrides,
  } as unknown as Branch;
}

describe("Lab-aligned demo branches presentation", () => {
  it("renders branch facts, service labels and the existing visit route", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderBranches(root, [makeBranch()]);

    expect(root.innerHTML).toContain("NOOR-TEH-01");
    expect(root.innerHTML).toContain("شعبه مرکزی نور");
    expect(root.innerHTML).toContain("تهران — مرکز");
    expect(root.innerHTML).toContain("خیابان نمونه، پلاک ۱۲");
    expect(root.innerHTML).toContain("فیتینگ");
    expect(root.innerHTML).toContain("مشاوره");
    expect(root.innerHTML).toContain("تحویل سفارش");
    expect(root.innerHTML).toContain('href="/visit?branch=branch-1"');
  });

  it("renders an empty state with an online consultation route", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderBranches(root, []);

    expect(root.innerHTML).toContain("در حال حاضر شعبه‌ای برای نمایش ثبت نشده است");
    expect(root.innerHTML).toContain('href="/shopper"');
    expect(root.innerHTML).not.toContain("/visit?branch=");
  });

  it("escapes branch-provided text before rendering", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderBranches(root, [makeBranch({ name: '<script>alert("x")</script>', code: '<b>BRANCH</b>' })]);

    expect(root.innerHTML).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(root.innerHTML).toContain("&lt;b&gt;BRANCH&lt;/b&gt;");
    expect(root.innerHTML).not.toContain("<script>");
  });
});
