import type { FoundationStatus } from "../../domain/foundation-status";

export interface FoundationProvider {
  getStatus(): FoundationStatus;
}
