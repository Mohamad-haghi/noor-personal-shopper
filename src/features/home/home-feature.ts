import type { FoundationStatus } from "../../domain/foundation-status";

export interface HomeState {
  readonly heroContent: unknown | null;
  readonly featuredProducts: unknown | null;
  readonly foundationStatus: FoundationStatus | null;
}

export class HomeFeature {
  getState(): HomeState {
    return {
      heroContent: null,
      featuredProducts: null,
      foundationStatus: null,
    };
  }
}
