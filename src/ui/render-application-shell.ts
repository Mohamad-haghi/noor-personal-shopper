import type { HeroContent, Recommendation, Product } from "../domain";
import type { RecommendationsService } from "../services/recommendations-service";
import type { FoundationStatus } from "../domain/foundation-status";
import type { ShopperFeature } from "../features/shopper/shopper-feature";
import { APP_ROUTES, type RouteMatch } from "../app/routing/routes";
import { renderFoundationStatus } from "./render-foundation";
import { renderHero } from "./render-hero";
import { renderRoutePlaceholder } from "./render-route-placeholder";
import { renderShopper } from "./render-shopper";
import { renderRecommendations } from "./render-recommendations";

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

export async function renderApplicationShell(
  root: HTMLElement,
  match: RouteMatch | null,
  status: FoundationStatus,
  hero: HeroContent | null,
  heroDestination: string | null,
  shopperFeature: ShopperFeature,
  recommendationsService: RecommendationsService,
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
    routeView.innerHTML = `<main class="app-loading" id="main-content" aria-live="polite"><p>در حال ساخت پیشنهادهای شما…</p></main>`;
    const flow = shopperFeature.getFlowState();
    const recommendations = await recommendationsService.generateRecommendations(
      { id: "demo-shopper" },
      { occasion: flow.journey.useCase, season: null, requestSource: "shopper_request", journey: flow.journey },
    );
    const products: Product[] = [];
    for (const recommendation of recommendations) {
      const product = await recommendationsService.getProductForVariant(recommendation.variantId.productId);
      if (product) products.push(product);
    }
    renderRecommendations(routeView, recommendations, products);
  } else {
    renderRoutePlaceholder(routeView, match);
  }
}
