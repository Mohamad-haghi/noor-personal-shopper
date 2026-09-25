export interface AppRoute {
  readonly path: string;
  readonly title: string;
  readonly navigationLabel: string | null;
}

export interface RouteMatch {
  readonly route: AppRoute;
  readonly params: Readonly<Record<string, string>>;
}

export const APP_ROUTES: readonly AppRoute[] = [
  { path: "/", title: "خانه", navigationLabel: "خانه" },
  { path: "/products", title: "محصولات", navigationLabel: "محصولات" },
  { path: "/products/:id", title: "جزئیات محصول", navigationLabel: null },
  { path: "/shopper", title: "دستیار خرید", navigationLabel: "دستیار خرید" },
  {
    path: "/recommendations",
    title: "پیشنهادها",
    navigationLabel: "پیشنهادها",
  },
  { path: "/choices", title: "انتخاب‌ها", navigationLabel: "انتخاب‌ها" },
  { path: "/compare", title: "مقایسه", navigationLabel: "مقایسه" },
  { path: "/account", title: "حساب کاربری", navigationLabel: "حساب کاربری" },
  { path: "/cart", title: "سبد خرید", navigationLabel: "سبد خرید" },
  { path: "/checkout", title: "تکمیل سفارش", navigationLabel: "تکمیل سفارش" },
  { path: "/payment", title: "پرداخت", navigationLabel: "پرداخت" },
  {
    path: "/confirmation/:id",
    title: "تأیید سفارش",
    navigationLabel: null,
  },
  { path: "/branches", title: "شعب", navigationLabel: "شعب" },
  { path: "/visit", title: "بازدید از شعبه", navigationLabel: "بازدید از شعبه" },
];

function pathSegments(path: string): string[] {
  const normalized = path.replace(/\/+$/, "") || "/";
  return normalized === "/" ? [] : normalized.slice(1).split("/");
}

export function resolveRoute(pathname: string): RouteMatch | null {
  const requestedSegments = pathSegments(pathname.split(/[?#]/, 1)[0] || "/");

  for (const route of APP_ROUTES) {
    const patternSegments = pathSegments(route.path);
    if (patternSegments.length !== requestedSegments.length) {
      continue;
    }

    const params: Record<string, string> = {};
    let matches = true;

    for (let index = 0; index < patternSegments.length; index += 1) {
      const patternSegment = patternSegments[index];
      const requestedSegment = requestedSegments[index];

      if (patternSegment.startsWith(":")) {
        if (!requestedSegment) {
          matches = false;
          break;
        }

        try {
          params[patternSegment.slice(1)] = decodeURIComponent(requestedSegment);
        } catch {
          matches = false;
          break;
        }
      } else if (patternSegment !== requestedSegment) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return { route, params };
    }
  }

  return null;
}
