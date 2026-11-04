import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DemoHeroProvider } from "../src/providers/demo/demo-hero-provider";
import { renderHero } from "../src/ui/render-hero";

describe("product-led hero presentation", () => {
  it("uses the exact local demo product image, both routes and truthful disclosure", async () => {
    const hero = await new DemoHeroProvider().getHeroContent();
    expect(hero).not.toBeNull();
    const root = { innerHTML: "" } as HTMLElement;

    renderHero(root, hero!, "/shopper");

    expect(root.innerHTML).toContain('class="hero"');
    expect(root.innerHTML).toContain("media/products/ray-ban-rb3025-181-71/primary.jpeg");
    expect(root.innerHTML).toContain('href="/shopper"');
    expect(root.innerHTML).toContain('href="/catalog"');
    expect(root.innerHTML).toContain("عینکی که با شناخت شما انتخاب می‌شود.");
    expect(root.innerHTML).toContain("نمونهٔ نمایشی مستقل · بدون فروش واقعی");
    expect(root.innerHTML).toContain("Ray-Ban RB3025 181/71");
  });

  it("keeps the responsive, reduced-motion and contained-image rules in the dedicated Hero stylesheet", () => {
    const css = readFileSync(new URL("../src/ui/hero.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.hero\s*\{[^}]*display:\s*grid/s);
    expect(css).toContain("@media (max-width: 760px)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toMatch(/\.hero-media\s*\{[^}]*object-fit:\s*contain/s);
  });
});
