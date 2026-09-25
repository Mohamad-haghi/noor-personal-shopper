import type { SelectionProfile, ShopperProfile } from "../../domain";

export interface ShopperFlowState {
  readonly profile: ShopperProfile | null;
  readonly selections: SelectionProfile | null;
  readonly currentStep: string | null;
  readonly completed: boolean;
}
