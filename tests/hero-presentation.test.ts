import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DemoHeroProvider } from "../src/providers/demo/demo-hero-provider";
import { renderHero } from "../src/ui/render-hero";
import type { Product, ProductVariant } from "../src/domain";

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
    expect(root.innerHTML).toContain("عینکی که با <span class=\"hero-accent\">شناخت شما</span> انتخاب می‌شود.");
    expect(root.innerHTML).toContain("سلیقه و نیازتان را در یک گفت‌وگوی کوتاه بیان کنید");
    expect(root.innerHTML).not.toContain("Ray-Ban RB3025 181/71");
  });

  it("renders the three curated homepage models from the canonical NOOR demo catalog IDs", async () => {
    const hero = await new DemoHeroProvider().getHeroContent();
    const ids = [
      "noor-demo-012-prada-pr51yv-04q1o1",
      "noor-demo-001-ray-ban-rb3025-181-71",
      "noor-demo-003-oakley-oo9318-02-34",
      "noor-demo-002-persol-po0649-95-31",
    ];
    const products = ids.map((id) => ({
      identity: { id },
      name: id,
      media: { primaryImage: { url: `/${id}.jpg`, altText: id } },
    })) as unknown as Product[];
    const root = { innerHTML: "" } as HTMLElement;

    renderHero(root, hero!, "/shopper", products);

    const persol = root.innerHTML.indexOf("noor-demo-002-persol-po0649-95-31.jpg");
    const oakley = root.innerHTML.indexOf("noor-demo-003-oakley-oo9318-02-34.jpg");
    const prada = root.innerHTML.indexOf("noor-demo-012-prada-pr51yv-04q1o1.jpg");
    expect(persol).toBeGreaterThan(-1);
    expect(oakley).toBeGreaterThan(persol);
    expect(prada).toBeGreaterThan(oakley);
    expect(root.innerHTML).not.toContain("noor-demo-001-ray-ban-rb3025-181-71.jpg");
    expect(root.innerHTML).not.toContain("محصولی برای نمایش ثبت نشده است");
  });

  it("renders the Lab-style favorite control over each curated image and restores saved state", async () => {
    const hero = await new DemoHeroProvider().getHeroContent();
    const productId = "noor-demo-002-persol-po0649-95-31";
    const products = [{
      identity: { id: productId },
      name: "Persol PO0649",
      media: { primaryImage: { url: "/persol.jpg", altText: "Persol PO0649" } },
    }] as unknown as Product[];
    const variantsByProduct = new Map<string, readonly ProductVariant[]>([[productId, [{
      identity: { id: "persol-variant-1" },
      availability: { isAvailable: true, source: "demo" },
    } as unknown as ProductVariant]]]);
    const root = { innerHTML: "" } as HTMLElement;

    renderHero(root, hero!, "/shopper", products, variantsByProduct, new Set(["persol-variant-1"]));

    expect(root.innerHTML).toContain('class="lab-curated-favorite is-saved"');
    expect(root.innerHTML).toContain('data-home-favorite-toggle');
    expect(root.innerHTML).toContain('data-variant-id="persol-variant-1"');
    expect(root.innerHTML).toContain('aria-pressed="true"');
  });

  it("matches the Lab's single-surface image overlay on desktop and bottom-anchored mobile composition", () => {
    const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
    const heroCss = readFileSync(new URL("../src/ui/hero.css", import.meta.url), "utf8");

    expect(css).toContain(".lab-home .hero-noor .hero-stage {");
    expect(css).toContain("position: relative;");
    expect(css).toContain("isolation: isolate;");
    expect(css).toContain(".lab-home .hero-noor .hero-image {");
    expect(css).toContain("object-fit: contain;");
    expect(css).toContain(".lab-home .hero-noor .hero-content {");
    expect(css).toContain("position: absolute;");
    expect(css).toContain("inset: 0 auto 0 0;");
    expect(css).toContain("width: min(47%, 39rem);");
    expect(css).toContain("--h-ivory: oklch(0.945 0.012 82);");
    expect(css).toContain('font-family: "Vazirmatn", Tahoma, sans-serif;');
    expect(css).toContain("@media (max-width: 767px)");
    expect(css).toContain("inset: auto 0 0;");
    expect(css).toContain(".lab-home .hero-noor .hero-cta-primary,");
    expect(css).toContain(".lab-home .hero-noor .hero-cta-secondary { width: 100%; }");
    expect(heroCss).not.toContain(".hero-noor .hero-stage");
    expect(heroCss).not.toContain(".hero-noor .hero-content");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});


describe("NOOR homepage header, curated collection and favorite refinements", () => {
  it("matches the Lab wordmark and hamburger scale", () => {
    const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
    expect(css).toContain(".app-shell-header .app-brand-lab .app-brand-name {\n  font-size: 1.5rem;\n  line-height: 1;\n  letter-spacing: .3em;");
    expect(css).toContain(".app-shell-header .mobile-nav-toggle {\n  width: 2.75rem;\n  height: 2.75rem;");
    expect(css).toContain(".app-shell-header .mobile-nav-toggle span {\n  width: 1.25rem;\n  height: 2px;");
  });

  it("rebuilds the curated collection with the Lab's three-column desktop grid, responsive image ratio and equal cards", () => {
    const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
    expect(css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr));");
    expect(css).toContain("@media (min-width: 640px)");
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr));");
    expect(css).toContain("@media (min-width: 1024px)");
    expect(css).toContain("aspect-ratio: 4 / 3;");
    expect(css).toContain("object-fit: contain;\n  transform: none;");
    expect(css).toContain("transform: scale(1.03);");
    expect(css).not.toContain("width: 100vw;");
    expect(css).not.toContain("aspect-ratio: 16 / 9;");
  });

  it("renders concise verified product details beneath each curated image", async () => {
    const hero = await new DemoHeroProvider().getHeroContent();
    const productId = "noor-demo-002-persol-po0649-95-31";
    const products = [{
      identity: { id: productId },
      name: "عینک آفتابی پرسول PO0649 95/31",
      attributes: { category: "sunglasses", customAttributes: { model: "PO0649 95/31", frameMaterial: "acetate", frameColor: "black" } },
      media: { primaryImage: { url: "/persol.jpg", altText: "Persol PO0649" } },
    }] as unknown as Product[];
    const root = { innerHTML: "" } as HTMLElement;

    renderHero(root, hero!, "/shopper", products);

    expect(root.innerHTML).toContain('class="lab-curated-model" dir="ltr">PO0649 95/31</p>');
    expect(root.innerHTML).toContain('class="lab-curated-kind">آفتابی</span>');
    expect(root.innerHTML).toContain('class="lab-curated-specs">استات · مشکی</p>');
  });

  it("restores the Lab's colored circular favorite control and matching three-step card surface", () => {
    const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
    expect(css).toContain("border: 1px solid color-mix(in srgb, oklch(0.84 0.022 76) 75%, transparent);\n  border-radius: 50%;");
    expect(css).toContain("background: color-mix(in srgb, oklch(0.945 0.012 82) 92%, transparent);");
    expect(css).toContain(".lab-home .lab-curated-favorite:hover {\n  border-color: var(--accent);");
    expect(css).toContain(".lab-home .lab-curated-favorite[aria-pressed=\"true\"] {\n  border-color: var(--accent);");
    expect(css).toContain(".lab-home .lab-step-grid li {\n  background: oklch(0.945 0.012 82);");
  });
});
