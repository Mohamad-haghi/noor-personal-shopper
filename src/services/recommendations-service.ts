import type { RecommendationsProvider } from "../providers/interfaces/recommendations-provider";
import type { Recommendation, RecommendationContext, ShopperProfileId } from "../domain";

export class RecommendationsService {
  constructor(private readonly provider: RecommendationsProvider) {}

  getRecommendations(shopperId: ShopperProfileId): Promise<readonly Recommendation[]> {
    return this.provider.getRecommendations(shopperId);
  }

  generateRecommendations(shopperId: ShopperProfileId, context: RecommendationContext): Promise<readonly Recommendation[]> {
    return this.provider.generateRecommendations(shopperId, context);
  }
}
