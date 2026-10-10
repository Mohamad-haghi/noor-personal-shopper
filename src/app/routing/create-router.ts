import { resolveRoute, type RouteMatch } from "./routes";

export type RouteChangeHandler = (match: RouteMatch | null) => void;

/** Convert a hosted URL path (for example /repo/products) to an app route (/products). */
export function stripBasePath(pathname: string, baseUrl: string): string {
  const basePath = baseUrl.replace(/\/+$/, "");
  if (!basePath || basePath === "/") return pathname;
  if (pathname === basePath || pathname === `${basePath}/`) return "/";
  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || "/";
  }
  return pathname;
}

/** Keep in-app navigation under a deployment prefix such as GitHub Pages' /repo/. */
export function withBasePath(pathname: string, baseUrl: string): string {
  const basePath = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  if (basePath === "/") return pathname;
  if (pathname === basePath.slice(0, -1) || pathname.startsWith(basePath)) return pathname;
  const routePath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return `${basePath}${routePath}`;
}

export function createRouter(
  root: HTMLElement,
  onRouteChange: RouteChangeHandler,
): () => void {
  const baseUrl = import.meta.env.BASE_URL;

  const renderCurrentRoute = (): void => {
    onRouteChange(resolveRoute(stripBasePath(window.location.pathname, baseUrl)));
  };

  const handleClick = (event: MouseEvent): void => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target;
    const link =
      target instanceof Element
        ? target.closest<HTMLAnchorElement>("a[data-app-link]")
        : null;

    if (!link || link.target || link.hasAttribute("download")) {
      return;
    }

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();
    const hostedPath = withBasePath(destination.pathname, baseUrl);
    window.history.pushState(
      null,
      "",
      `${hostedPath}${destination.search}${destination.hash}`,
    );
    renderCurrentRoute();
  };

  root.addEventListener("click", handleClick);
  window.addEventListener("popstate", renderCurrentRoute);
  renderCurrentRoute();

  return () => {
    root.removeEventListener("click", handleClick);
    window.removeEventListener("popstate", renderCurrentRoute);
  };
}
