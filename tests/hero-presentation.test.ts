import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DemoHeroProvider } from "../src/providers/demo/demo-hero-provider";
import { renderHero } from "../src/ui/render-hero";
import type { Product } from "../src/domain";

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


  it("uses the same three curated homepage models as the Lab instead of the first feed entries", async () => {
    const hero = await new DemoHeroProvider().getHeroContent();
    const ids = ["prada-pr51yv-04q1o1", "ray-ban-rb3025-181-71", "oakley-oo9318-02-34", "persol-po0649-95-31"];
    const products = ids.map((id) => ({
      identity: { id },
      name: id,
      media: { primaryImage: { url: `/${id}.jpg`, altText: id } },
    })) as unknown as Product[];
    const root = { innerHTML: "" } as HTMLElement;

    renderHero(root, hero!, "/shopper", products);

    const persol = root.innerHTML.indexOf("persol-po0649-95-31.jpg");
    const oakley = root.innerHTML.indexOf("oakley-oo9318-02-34.jpg");
    const prada = root.innerHTML.indexOf("prada-pr51yv-04q1o1.jpg");
    expect(persol).toBeGreaterThan(-1);
    expect(oakley).toBeGreaterThan(persol);
    expect(prada).toBeGreaterThan(oakley);
    expect(root.innerHTML).not.toContain("ray-ban-rb3025-181-71.jpg");
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
