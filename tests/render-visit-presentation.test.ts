import { describe, expect, it } from "vitest";
import type { Branch, Visit } from "../src/domain";
import { createDemoVisitSlots, renderVisit } from "../src/ui/render-visit";

function makeBranch(): Branch {
  return {
    identity: { id: "branch-1" },
    code: "NOOR-01",
    name: "شعبه مرکزی نور",
    location: { city: "تهران", region: "مرکز", address: "خیابان نمونه", latitude: null, longitude: null },
    services: ["consultation", "fitting"],
  } as unknown as Branch;
}

function makeVisit(): Visit {
  return {
    identity: { id: "demo-visit-1" },
    branchId: { id: "branch-1" },
    accountId: { id: "account-1" },
    scheduledAt: new Date("2026-01-03T11:00:00"),
    duration: { estimatedMinutes: 45, actualMinutes: null },
    purpose: "consultation",
    status: "requested",
    notes: null,
    createdAt: new Date("2026-01-01T00:00:00Z"),
  } as unknown as Visit;
}

describe("Lab-aligned in-person visit presentation", () => {
  it("creates fifteen future demo slots across five days", () => {
    const now = new Date(2026, 0, 1, 9, 0, 0);
    const slots = createDemoVisitSlots(now);

    expect(slots).toHaveLength(15);
    expect(slots[0].getDate()).toBe(2);
    expect(slots[0].getHours()).toBe(11);
    expect(slots[14].getDate()).toBe(6);
    expect(slots[14].getHours()).toBe(17);
    expect(slots.every((slot) => slot.getTime() > now.getTime())).toBe(true);
  });

  it("renders branch, time, purpose and notes fields with existing form hooks", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderVisit(root, [makeBranch()], "demo@example.com", "branch-1", null);

    expect(root.innerHTML).toContain('data-visit-form');
    expect(root.innerHTML).toContain('name="branchId"');
    expect(root.innerHTML).toContain('name="scheduledAt"');
    expect(root.innerHTML).toContain('name="purpose"');
    expect(root.innerHTML).toContain('name="notes"');
    expect(root.innerHTML).toContain('value="branch-1" selected');
    expect(root.innerHTML.match(/<option value="2026-/g)).toHaveLength(15);
    expect(root.innerHTML).toContain("زمان‌های نمایش‌داده‌شده نمونه هستند");
  });

  it("disables visit submission when the independent account is absent", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderVisit(root, [makeBranch()], null, "branch-1", null);

    expect(root.innerHTML).toContain("ابتدا وارد حساب مستقل Personal Shopper شوید");
    expect(root.innerHTML).toContain("ثبت درخواست مراجعه</button>");
    expect(root.innerHTML).toContain('disabled');
  });

  it("provides a direct account route when visit submission is disabled", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderVisit(root, [makeBranch()], null, "branch-1", null);

    expect(root.innerHTML).toContain('href="/account"');
    expect(root.innerHTML).toContain("ورود یا ساخت حساب");
  });

  it("renders a visit confirmation with the selected branch and request id", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderVisit(root, [makeBranch()], "demo@example.com", "branch-1", makeVisit());

    expect(root.innerHTML).toContain("درخواست مراجعه ثبت شد");
    expect(root.innerHTML).toContain("demo-visit-1");
    expect(root.innerHTML).toContain("شعبه مرکزی نور");
    expect(root.innerHTML).toContain('href="/shopper"');
    expect(root.innerHTML).toContain('href="/branches"');
    expect(root.innerHTML).not.toContain("data-visit-form");
  });

  it("escapes validation errors before rendering", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderVisit(root, [makeBranch()], "demo@example.com", "branch-1", null, '<script>alert("x")</script>');

    expect(root.innerHTML).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(root.innerHTML).not.toContain("<script>");
  });
});
