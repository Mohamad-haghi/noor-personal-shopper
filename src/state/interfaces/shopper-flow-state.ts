import type { SelectionProfile, ShopperProfile } from "../../domain";

export interface ShopperJourneyProfile {
  readonly productType: string | null;
  readonly useCase: string | null;
  readonly style: string | null;
  readonly faceShape: string | null;
}

export interface ShopperFlowState {
  readonly profile: ShopperProfile | null;
  readonly selections: SelectionProfile | null;
  readonly journey: ShopperJourneyProfile;
  readonly currentStep: string | null;
  readonly completed: boolean;
}
