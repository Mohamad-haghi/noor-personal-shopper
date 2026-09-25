import type { BranchId } from "../../domain";

export interface BranchesState {
  readonly branchIds: readonly BranchId[];
  readonly selectedBranchId: BranchId | null;
  readonly isLoading: boolean;
}

export class BranchesFeature {
  getState(): BranchesState {
    return {
      branchIds: [],
      selectedBranchId: null,
      isLoading: false,
    };
  }
}
