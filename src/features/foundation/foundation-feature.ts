import type { FoundationStatus } from "../../domain/foundation-status";
import { FoundationService } from "../../services/foundation-service";

export class FoundationFeature {
  constructor(private readonly service: FoundationService) {}

  getStatus(): FoundationStatus {
    return this.service.getStatus();
  }
}
