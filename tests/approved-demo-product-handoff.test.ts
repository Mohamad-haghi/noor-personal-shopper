import { describe, expect, it } from "vitest";
import { approvedDemoProductHandoffUrl } from "../src/integration/digital-sales-core/approved-demo-product-handoff";

describe("COR demo product handoff destination", () => {
  const baseUrl = "/noor-personal-shopper/";
  const origin = "https://mohamad-haghi.github.io";
  const productId = "noor-demo-004-tom-ford-ft0778-01a-60";
  const expected = "https://mohamad-haghi.github.io/noor-personal-shopper/products/noor-demo-004-tom-ford-ft0778-01a-60";

  it("accepts the exact HTTPS product route on the current Pages origin", () => {
    expect(approvedDemoProductHandoffUrl(expected, productId, baseUrl, origin)).toBe(expected);
  });

  it("rejects a different origin even when it uses HTTPS", () => {
    expect(approvedDemoProductHandoffUrl(expected.replace(origin, "https://attacker.example"), productId, baseUrl, origin)).toBeNull();
  });

  it("rejects an incorrect product route", () => {
    expect(approvedDemoProductHandoffUrl(expected.replace(productId, "another-product"), productId, baseUrl, origin)).toBeNull();
  });

  it("rejects HTTP and URL credentials", () => {
    expect(approvedDemoProductHandoffUrl(expected.replace("https:", "http:"), productId, baseUrl, origin)).toBeNull();
    expect(approvedDemoProductHandoffUrl(expected.replace("https://", "https://user:pass@"), productId, baseUrl, origin)).toBeNull();
  });

  it("preserves the root-hosted local base path without accepting an unrelated route", () => {
    const rootDestination = `${origin}/products/${productId}`;
    expect(approvedDemoProductHandoffUrl(rootDestination, productId, "/", origin)).toBe(rootDestination);
    expect(approvedDemoProductHandoffUrl(`${origin}/noor-personal-shopper/products/${productId}`, productId, "/", origin)).toBeNull();
  });
});
