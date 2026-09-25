import type { AppMode } from "./app-mode";

export interface FoundationStatus {
  readonly mode: AppMode;
  readonly connectedToNoorServices: boolean;
}