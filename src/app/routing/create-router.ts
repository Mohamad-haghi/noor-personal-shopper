import { resolveRoute, type RouteMatch } from "./routes";

export type RouteChangeHandler = (match: RouteMatch | null) => void;

export function createRouter(
  root: HTMLElement,
  onRouteChange: RouteChangeHandler,
): () => void {
  const renderCurrentRoute = (): void => {
    onRouteChange(resolveRoute(window.location.pathname));
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
    window.history.pushState(
      null,
      "",
      `${destination.pathname}${destination.search}${destination.hash}`,
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