import type { HeroContent, Product, Recommendation, SavedChoice, Comparison } from "../domain";
import type { RecommendationsService } from "../services/recommendations-service";
import type { CatalogService } from "../services/catalog-service";
import type { ChoicesService } from "../services/choices-service";
import type { CompareService } from "../services/compare-service";
import type { FoundationStatus } from "../domain/foundation-status";
import type { ShopperFeature } from "../features/shopper/shopper-feature";
import { APP_ROUTES, type RouteMatch } from "../app/routing/routes";
import { renderFoundationStatus } from "./render-foundation";
import { renderHero } from "./render-hero";
import { renderRoutePlaceholder } from "./render-route-placeholder";
import { renderShopper } from "./render-shopper";
import { renderRecommendations } from "./render-recommendations";
import { renderChoices } from "./render-choices";
import { renderCompare } from "./render-compare";

function isNavigationRouteCurrent(navigationPath: string, match: RouteMatch | null): boolean {
  if (!match) return false;
  return match.route.path === navigationPath ||
    (navigationPath !== "/" && match.route.path.startsWith(`${navigationPath}/`));
}

function renderNavigation(match: RouteMatch | null): string {
  return APP_ROUTES.filter((route) => route.navigationLabel !== null)
    .map((route) => {
      const current = isNavigationRouteCurrent(route.path, match);
      const currentAttribute = current ? ' aria-current="page"' : "";
      return `<li><a href="${route.path}" data-app-link${currentAttribute}>${route.navigationLabel}</a></li>`;
    })
    .join("");
}

function createSavedChoice(recommendation: Recommendation): SavedChoice {
  const now = new Date();
  return {
    identity: { id: `demo-choice-${recommendation.variantId.id}` },
    variantId: recommendation.variantId,
    status: "saved",
    notes: null,
    tags: ["recommendation"],
    createdAt: now,
    updatedAt: now,
  };
}

async function renderRecommendationRoute(
  routeView: HTMLElement,
  shopperFeature: ShopperFeature,
  recommendationsService: RecommendationsService,
  choicesService: ChoicesService,
): Promise<void> {
  routeView.innerHTML = `<main class="app-loading" id="main-content" aria-live="polite"><p>در حال ساخت پیشنهادهای شما…</p></main>`;
  const flow = shopperFeature.getFlowState();
  const recommendations = await recommendationsService.generateRecommendations(
    { id: "demo-shopper" },
    { occasion: flow.journey.useCase, season: null, requestSource: "shopper_request", journey: flow.journey },
  );
  const products: Product[] = [];
  for (const recommendation of recommendations) {
    const product = await recommendationsService.getProductForVariant(recommendation.variantId);
    if (product) products.push(product);
  }
  renderRecommendations(routeView, recommendations, products);

  routeView.querySelectorAll<HTMLButtonElement>("[data-save-choice]").forEach((button) => {
    button.addEventListener("click", async () => {
      const variantId = button.dataset.saveChoice;
      const recommendation = recommendations.find((item) => item.variantId.id === variantId);
      if (!recommendation) return;
      await choicesService.saveChoice(createSavedChoice(recommendation));
      button.textContent = "در انتخاب‌های من ذخیره شد";
      button.disabled = true;
    });
  });
}

async function renderChoicesRoute(
  routeView: HTMLElement,
  catalogService: CatalogService,
  choicesService: ChoicesService,
): Promise<void> {
  const choices = await choicesService.listChoices();
  const products = await catalogService.listProducts();
  renderChoices(routeView, choices, products);

  routeView.querySelectorAll<HTMLButtonElement>("[data-remove-choice]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.removeChoice;
      if (!id) return;
      await choicesService.removeChoice({ id });
      await renderChoicesRoute(routeView, catalogService, choicesService);
    });
  });
}

async function renderCompareRoute(
  routeView: HTMLElement,
  catalogService: CatalogService,
  choicesService: ChoicesService,
  compareService: CompareService,
): Promise<void> {
  const choices = await choicesService.listChoices();
  const items = choices.slice(0, 3).map((choice, index) => ({
    variantId: choice.variantId,
    addedAt: choice.createdAt,
    position: index + 1,
  }));

  const comparison: Comparison | null = items.length >= 2
    ? await compareService.saveComparison({
        identity: { id: "demo-current-comparison" },
        name: "مقایسهٔ انتخاب‌های من",
        items,
        criteria: ["style", "brand", "material", "color", "size", "availability"],
        createdAt: new Date(),
      })
    : null;

  const products = await catalogService.listProducts();
  renderCompare(routeView, comparison, products);
}

export async function renderApplicationShell(
  root: HTMLElement,
  match: RouteMatch | null,
  status: FoundationStatus,
  hero: HeroContent | null,
  heroDestination: string | null,
  shopperFeature: ShopperFeature,
  recommendationsService: RecommendationsService,
  catalogService: CatalogService,
  choicesService: ChoicesService,
  compareService: CompareService,
): Promise<void> {
  const navigation = renderNavigation(match);
  root.innerHTML = `
    <a class="skip-link" href="#main-content">پرش به محتوای اصلی</a>
    <div class="app-shell">
      <header class="app-header">
        <a class="app-brand" href="/" data-app-link aria-label="نور، صفحهٔ اصلی">
          <span class="app-brand-mark" aria-hidden="true">ن</span>
          <span class="app-brand-name">نور</span>
        </a>
        <div class="app-header-meta">
          <span class="app-mode">دموی مستقل</span>
          <details class="mobile-nav">
            <summary>منو</summary>
            <nav aria-label="ناوبری موبایل"><ul>${navigation}</ul></nav>
          </details>
        </div>
      </header>
      <nav class="primary-nav" aria-label="ناوبری اصلی"><ul>${navigation}</ul></nav>
      <div id="route-view" class="route-view" aria-live="polite"></div>
      <footer class="app-footer">
        <span>NOOR Personal Shopper</span>
        <span>دموی مستقل · بدون اتصال به سامانه‌های واقعی نور</span>
      </footer>
    </div>
  `;

  const routeView = root.querySelector<HTMLElement>("#route-view");
  if (!routeView) throw new Error("Application route view was not created.");

  if (match?.route.path === "/") {
    if (hero) renderHero(routeView, hero, heroDestination);
    else renderFoundationStatus(routeView, status);
  } else if (match?.route.path === "/shopper") {
    renderShopper(routeView, shopperFeature);
  } else if (match?.route.path === "/recommendations") {
    await renderRecommendationRoute(routeView, shopperFeature, recommendationsService, choicesService);
  } else if (match?.route.path === "/choices") {
    await renderChoicesRoute(routeView, catalogService, choicesService);
  } else if (match?.route.path === "/compare") {
    await renderCompareRoute(routeView, catalogService, choicesService, compareService);
  } else {
    renderRoutePlaceholder(routeView, match);
  }
}
