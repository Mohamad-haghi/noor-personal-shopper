import type { RouteMatch } from "./routes";

export interface NavigationController {
  getCurrent(): RouteMatch | null;
  navigate(path: string): void;
  replace(path: string): void;
  back(): void;
}

export type RouteGuard = (
  match: RouteMatch,
  session: { readonly isAuthenticated: boolean },
) => boolean | string;
