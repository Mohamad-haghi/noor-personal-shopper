import type { FoundationStatus } from "../domain/foundation-status";
import type { FoundationProvider } from "../providers/interfaces/foundation-provider";

export class FoundationService {
  constructor(private readonly provider: FoundationProvider) {}

  getStatus(): FoundationStatus {
    return this.provider.getStatus();
  }
}