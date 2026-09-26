import { readAppConfig } from "../config/app-config";
import { FoundationFeature } from "../features/foundation/foundation-feature";
import { ShopperFeature } from "../features/shopper/shopper-feature";
import { DemoFoundationProvider } from "../providers/demo/demo-foundation-provider";
import { DemoHeroProvider } from "../providers/demo/demo-hero-provider";
import { DemoCatalogProvider } from "../providers/demo/demo-catalog-provider";
import { DemoChoicesProvider } from "../providers/demo/demo-choices-provider";
import { DemoCompareProvider } from "../providers/demo/demo-compare-provider";
import { DemoAccountProvider } from "../providers/demo/demo-account-provider";
import { DemoCartProvider } from "../providers/demo/demo-cart-provider";
import { DemoCommerceProvider } from "../providers/demo/demo-commerce-provider";
import { FoundationService } from "../services/foundation-service";
import { HeroService } from "../services/hero-service";
import { CatalogService } from "../services/catalog-service";
import { RecommendationsService } from "../services/recommendations-service";
import { ChoicesService } from "../services/choices-service";
import { CompareService } from "../services/compare-service";
import { AccountService } from "../services/account-service";
import { CartService } from "../services/cart-service";
import { CommerceService } from "../services/commerce-service";
import { DemoHeroDestinationResolver } from "../integration/demo/demo-hero-destination-resolver";
import { createRouter } from "./routing/create-router";
import { renderApplicationShell } from "../ui/render-application-shell";

export async function startApplication(root: HTMLElement): Promise<void> {
  const config = readAppConfig();

  if (config.mode !== "demo") {
    throw new Error(
      'Integrated mode is not available in this foundation. Set VITE_NOOR_MODE="demo".',
    );
  }

  root.innerHTML = `
    <main class="app-loading" aria-live="polite">
      <p>در حال آماده‌سازی تجربهٔ نور…</p>
    </main>
  `;

  try {
    const foundationProvider = new DemoFoundationProvider();
    const foundationService = new FoundationService(foundationProvider);
    const foundationFeature = new FoundationFeature(foundationService);
    const status = foundationFeature.getStatus();

    const heroService = new HeroService(new DemoHeroProvider());
    const heroResolver = new DemoHeroDestinationResolver();
    const hero = await heroService.getHeroContent();
    const heroDestination = hero?.cta ? heroResolver.resolve(hero.cta.destination) : null;

    const shopperFeature = new ShopperFeature();
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const recommendationsService = new RecommendationsService(catalogService);
    const choicesService = new ChoicesService(new DemoChoicesProvider());
    const compareService = new CompareService(new DemoCompareProvider());
    const accountService = new AccountService(new DemoAccountProvider());
    const cartProvider = new DemoCartProvider();
    const cartService = new CartService(cartProvider);
    const commerceService = new CommerceService(new DemoCommerceProvider(new DemoCatalogProvider()));

    createRouter(root, (match) => {
      void renderApplicationShell(
        root,
        match,
        status,
        hero,
        heroDestination,
        shopperFeature,
        recommendationsService,
        catalogService,
        choicesService,
        compareService,
        accountService,
      );
    });
  } catch {
    root.innerHTML = `
      <main class="app-error" aria-labelledby="app-error-title">
        <p class="eyebrow">NOOR Personal Shopper</p>
        <h1 id="app-error-title">تجربهٔ نور آماده نشد</h1>
        <p>لطفاً دوباره تلاش کنید.</p>
        <button class="button button-primary" type="button" onclick="window.location.reload()">تلاش دوباره</button>
      </main>
    `;
  }
}
