import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DemoHeroProvider } from "../src/providers/demo/demo-hero-provider";
import { renderHero } from "../src/ui/render-hero";

describe("approved Lab hero presentation in the NOOR application", () => {
  it("uses the local approved hero artwork while preserving NOOR content and route-aware actions", async () => {
    const hero = await new DemoHeroProvider().getHeroContent();
    expect(hero).not.toBeNull();
    const root = { innerHTML: "" } as HTMLElement;

    renderHero(root, hero!, "/shopper");

    expect(root.innerHTML).toContain('class="hero-noor"');
    expect(root.innerHTML).toContain('class="hero-image"');
    expect(root.innerHTML).toContain("media/hero/hero-1024-q65.webp");
    expect(root.innerHTML).toContain('href="/shopper"');
    expect(root.innerHTML).toContain('href="/catalog"');
    expect(root.innerHTML).toContain('data-app-link');
    expect(root.innerHTML).toContain('class="lab-home"');
    expect(root.innerHTML).toContain("سه گام تا انتخابی سنجیده");
    expect(root.innerHTML).toContain("گزیدهٔ مجموعه");
    expect(root.innerHTML).toContain("هوشمندی‌ای که دلیلش را می‌گوید.");
    expect(root.innerHTML).toContain('href="/how-it-works"');
    expect(root.innerHTML).toContain("عینکی که با شناخت شما انتخاب می‌شود.");
    expect(root.innerHTML).toContain("سلیقه و نیازتان را در یک گفت‌وگوی کوتاه بیان کنید");
    expect(root.innerHTML).not.toContain("Ray-Ban RB3025 181/71");
  });

  it("keeps responsive, reduced-motion and uncropped image rules in the dedicated Hero stylesheet", () => {
    const css = readFileSync(new URL("../src/ui/hero.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.hero-noor\s*\{[^}]*overflow:\s*hidden/s);
    expect(css).toContain("@media (max-width: 767px)");
    expect(css).toContain("order: 1");
    expect(css).toContain("order: 2");
    expect(css).toContain("position: relative");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toMatch(/\.hero-noor \.hero-image\s*\{[^}]*object-fit:\s*contain/s);
  });
});
