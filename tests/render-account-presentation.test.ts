import { describe, expect, it } from "vitest";
import type { Account } from "../src/domain";
import { renderAccount } from "../src/ui/render-account";

function makeAccount(overrides: Record<string, unknown> = {}): Account {
  return {
    identity: { id: "account-1" },
    email: "demo@example.com",
    phone: null,
    profile: {
      firstName: "Noor",
      lastName: "Demo",
      displayName: null,
      avatarUrl: null,
      language: "fa",
      region: null,
    },
    verificationStatus: {
      emailVerified: false,
      phoneVerified: false,
      identityVerified: false,
      verifiedAt: null,
    },
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  } as unknown as Account;
}

describe("Lab-aligned account presentation", () => {
  it("renders separate registration and login forms with existing action hooks", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderAccount(root, null);

    expect(root.innerHTML).toContain("ساخت حساب جدید");
    expect(root.innerHTML).toContain("ورود به حساب Demo");
    expect(root.innerHTML).toContain('data-account-register');
    expect(root.innerHTML).toContain('data-account-login');
    expect(root.innerHTML).toContain('name="firstName"');
    expect(root.innerHTML).toContain('name="lastName"');
    expect(root.innerHTML).toContain('name="email"');
    expect(root.innerHTML).toContain('name="password"');
    expect(root.innerHTML).toContain("به حساب فعلی سایت نور متصل نیست");
  });

  it("renders the active account and source-backed email verification state", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const account = makeAccount();
    renderAccount(root, account);

    expect(root.innerHTML).toContain("Noor Demo");
    expect(root.innerHTML).toContain("demo@example.com");
    expect(root.innerHTML).toContain("تأییدنشده در Demo");
    expect(root.innerHTML).toContain('data-account-logout');
    expect(root.innerHTML).toContain('href="/choices"');
    expect(root.innerHTML).not.toContain("data-account-login");
  });

  it("reflects a verified email without changing the account flow", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const account = makeAccount({
      verificationStatus: {
        emailVerified: true,
        phoneVerified: false,
        identityVerified: false,
        verifiedAt: new Date("2026-01-02T00:00:00Z"),
      },
    });
    renderAccount(root, account);

    expect(root.innerHTML).toContain("تأیید شده");
  });

  it("shows and safely escapes account errors", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderAccount(root, null, '<script>alert("x")</script>');

    expect(root.innerHTML).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(root.innerHTML).not.toContain("<script>");
    expect(root.innerHTML).toContain('role="alert"');
  });
});
