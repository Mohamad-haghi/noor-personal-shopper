import type { VisitId, BranchId } from "../../domain";

export interface VisitState {
  readonly visitId: VisitId | null;
  readonly selectedBranchId: BranchId | null;
  readonly isLoading: boolean;
}

export class VisitFeature {
  getState(): VisitState {
    return {
      visitId: null,
      selectedBranchId: null,
      isLoading: false,
    };
  }
}
