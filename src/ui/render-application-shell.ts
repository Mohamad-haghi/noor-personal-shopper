import type { FoundationStatus } from "../domain/foundation-status";
import { APP_ROUTES, type RouteMatch } from "../app/routing/routes";
import { renderFoundationStatus } from "./render-foundation";
import { renderRoutePlaceholder } from "./render-route-placeholder";

function isNavigationRouteCurrent(
  navigationPath: string,
  match: RouteMatch | null,
): boolean {
  if (!match) {
    return false;
  }

  return (
    match.route.path === navigationPath ||
    (navigationPath !== "/" && match.route.path.startsWith(`${navigationPath}/`))
  );
}

export function renderApplicationShell(
  root: HTMLElement,
  match: RouteMatch | null,
  status: FoundationStatus,
): void {
  const navigation = APP_ROUTES.filter(
    (route) => route.navigationLabel !== null,
  )
    .map((route) => {
      const current = isNavigationRouteCurrent(route.path, match);
      const currentAttribute = current ? ' aria-current="page"' : "";

      return `<li><a href="${route.path}" data-app-link${currentAttribute}>${route.navigationLabel}</a></li>`;
    })
    .join("");

  root.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <a class="app-brand" href="/" data-app-link>نور</a>
        <span class="app-mode">دموی مستقل</span>
      </header>
      <nav class="primary-nav" aria-label="ناوبری اصلی">
        <ul>${navigation}</ul>
      </nav>
      <div id="route-view"></div>
    </div>
  `;

  const routeView = root.querySelector<HTMLElement>("#route-view");
  if (!routeView) {
    throw new Error("Application route view was not created.");
  }

  if (match?.route.path === "/") {
    renderFoundationStatus(routeView, status);
  } else {
    renderRoutePlaceholder(routeView, match);
  }
}
