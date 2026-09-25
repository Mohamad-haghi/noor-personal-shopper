import type { RouteMatch } from "../app/routing/routes";

function createPlaceholder(title: string, message: string, showHomeLink: boolean): HTMLElement {
  const main = document.createElement("main");
  main.className = "route-placeholder";
  main.id = "main-content";
  main.setAttribute("aria-labelledby", "route-title");

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "دموی نور";

  const heading = document.createElement("h1");
  heading.id = "route-title";
  heading.textContent = title;

  const description = document.createElement("p");
  description.className = "summary";
  description.textContent = message;

  main.append(eyebrow, heading, description);

  if (showHomeLink) {
    const actions = document.createElement("div");
    actions.className = "route-actions";
    actions.innerHTML = '<a class="button button-secondary" href="/" data-app-link>بازگشت به خانه</a>';
    main.append(actions);
  }

  return main;
}

export function renderRoutePlaceholder(root: HTMLElement, match: RouteMatch | null): void {
  const view = match
    ? createPlaceholder(match.route.title, "این مسیر در ساختار دمو ثبت شده و در فاز مربوط به خود تکمیل می‌شود.", true)
    : createPlaceholder("صفحه پیدا نشد", "این مسیر در نقشهٔ فعلی برنامه ثبت نشده است.", true);
  root.replaceChildren(view);
}
