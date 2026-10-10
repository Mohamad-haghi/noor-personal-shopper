import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("product image framing", () => {
  it("keeps full product images visible in catalog and detail frames without cropping", () => {
    const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.product-card-media img\s*\{[^}]*object-fit:\s*contain/s);
    expect(css).toMatch(/\.product-detail-media img\s*\{[^}]*object-fit:\s*contain/s);
    expect(css).not.toMatch(/\.product-card-media img,\.product-detail-media img\s*\{[^}]*object-fit:\s*cover/s);
  });
});
