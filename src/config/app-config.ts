import type { AppMode } from "../domain/app-mode";

export interface AppConfig {
  readonly mode: AppMode;
}

const supportedModes: readonly AppMode[] = ["demo", "integrated"];

export function readAppConfig(): AppConfig {
  const configuredMode: string = import.meta.env.VITE_NOOR_MODE ?? "demo";

  if (!supportedModes.includes(configuredMode as AppMode)) {
    throw new Error(
      `Unsupported VITE_NOOR_MODE "${configuredMode}". Use "demo" or "integrated".`,
    );
  }

  return Object.freeze({ mode: configuredMode as AppMode });
}
