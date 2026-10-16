import type { AppMode } from "../../domain/app-mode";

/**
 * Integrated mode is deliberately enabled only when a public COR service origin
 * is configured. Credentials are fetched just-in-time and are never build-time secrets.
 */
export function getCompositionModeError(
  mode: AppMode,
  corBaseUrl?: string | null,
): string | null {
  if (mode === "demo") return null;
  if (!corBaseUrl) return "Integrated mode requires VITE_COR_SHOPPER_BASE_URL.";

  try {
    const url = new URL(corBaseUrl);
    const localHttp = url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]");
    if ((!localHttp && url.protocol !== "https:") || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash) {
      return "Integrated mode requires a valid HTTPS COR service origin.";
    }
  } catch {
    return "Integrated mode requires a valid HTTPS COR service origin.";
  }
  return null;
}
