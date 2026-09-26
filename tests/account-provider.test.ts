import { describe, expect, it } from "vitest";
import { DemoAccountProvider } from "../src/providers/demo/demo-account-provider";
import type { Account } from "../src/domain";

const account: Account = {
  identity: { id: "demo-account-test" },
  email: "shopper@example.com",
  phone: null,
  profile: {
    firstName: "آزمایشی",
    lastName: "نور",
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
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("DemoAccountProvider", () => {
  it("registers and exposes the current independent demo account", async () => {
    const provider = new DemoAccountProvider();

    const registered = await provider.register(account, "secret123");

    expect(registered.email).toBe("shopper@example.com");
    expect((await provider.getCurrentAccount())?.identity.id).toBe("demo-account-test");
  });

  it("supports login after logout without external auth", async () => {
    const provider = new DemoAccountProvider();

    await provider.register(account, "secret123");
    await provider.logout();

    expect(await provider.getCurrentAccount()).toBeNull();
    expect((await provider.login("SHOPPER@EXAMPLE.COM", "secret123"))?.email).toBe("shopper@example.com");
    expect(await provider.login("shopper@example.com", "wrong-password")).toBeNull();
  });
});
