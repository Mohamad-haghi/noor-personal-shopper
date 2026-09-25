import type { ShopperProfileId } from "../../domain";

export interface ShopperState {
  readonly profileId: ShopperProfileId | null;
  readonly isLoading: boolean;
}

export class ShopperFeature {
  getState(): ShopperState {
    return {
      profileId: null,
      isLoading: false,
    };
  }
}
