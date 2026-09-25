import type { RecommendationId } from "../../domain";

export interface RecommendationsState {
  readonly recommendationIds: readonly RecommendationId[];
  readonly isLoading: boolean;
}

export class RecommendationsFeature {
  getState(): RecommendationsState {
    return {
      recommendationIds: [],
      isLoading: false,
    };
  }
}
