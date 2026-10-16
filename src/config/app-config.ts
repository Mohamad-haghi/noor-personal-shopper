import type { AppMode } from "../domain/app-mode";

export interface AppConfig {
  readonly mode: AppMode;
  /** Public service origin only; never put a COR secret in a Vite variable. */
  readonly corBaseUrl: string | null;
}

const supportedModes: readonly AppMode[] = ["demo", "integrated"];

export function readAppConfig(): AppConfig {
  const configuredMode: string = import.meta.env.VITE_NOOR_MODE ?? "demo";
  const rawCorBaseUrl: string = import.meta.env.VITE_COR_SHOPPER_BASE_URL ?? "";
  const corBaseUrl = rawCorBaseUrl.trim() || null;

  if (!supportedModes.includes(configuredMode as AppMode)) {
    throw new Error(
      `Unsupported VITE_NOOR_MODE "${configuredMode}". Use "demo" or "integrated".`,
    );
  }

  return Object.freeze({ mode: configuredMode as AppMode, corBaseUrl });
}
