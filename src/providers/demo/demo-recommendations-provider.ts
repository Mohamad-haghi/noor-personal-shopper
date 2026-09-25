import type { Recommendation, RecommendationContext, ShopperProfileId } from "../../domain";

export class DemoRecommendationsProvider implements RecommendationsProvider {
  async getRecommendations(shopperId: ShopperProfileId): Promise<readonly Recommendation[]> { return []; }

  async generateRecommendations(shopperId: ShopperProfileId, context: RecommendationContext): Promise<readonly Recommendation[]> { return []; }
}
