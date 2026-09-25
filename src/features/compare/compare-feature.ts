import type { ComparisonId } from "../../domain";

export interface CompareState {
  readonly comparisonId: ComparisonId | null;
  readonly isLoading: boolean;
}

export class CompareFeature {
  getState(): CompareState {
    return {
      comparisonId: null,
      isLoading: false,
    };
  }
}
