import type { AppMode } from "../../domain/app-mode";

/**
 * Returns an error when the selected mode cannot be backed by a real provider.
 * Keep this check ahead of all provider construction so integrated mode can
 * never silently compose demo dependencies.
 */
export function getCompositionModeError(mode: AppMode): string | null {
  if (mode === "demo") return null;

  return "Integrated mode is unavailable until verified real providers are configured.";
}
