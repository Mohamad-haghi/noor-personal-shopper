import type { RouteMatch } from "../app/routing/routes";

function createPlaceholder(title: string, message: string): HTMLElement {
  const main = document.createElement("main");
  main.className = "route-placeholder";
  main.setAttribute("aria-labelledby", "route-title");

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "ساختار برنامه";

  const heading = document.createElement("h1");
  heading.id = "route-title";
  heading.textContent = title;

  const description = document.createElement("p");
  description.className = "summary";
  description.textContent = message;

  main.append(eyebrow, heading, description);
  return main;
}

export function renderRoutePlaceholder(
  root: HTMLElement,
  match: RouteMatch | null,
): void {
  const view = match
    ? createPlaceholder(
        match.route.title,
        "این مسیر آماده است؛ قابلیت‌های این بخش در این مرحله پیاده‌سازی نشده‌اند.",
      )
    : createPlaceholder(
        "صفحه پیدا نشد",
        "این مسیر در نقشهٔ فعلی برنامه ثبت نشده است.",
      );

  root.replaceChildren(view);
}