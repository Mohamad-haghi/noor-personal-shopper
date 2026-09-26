import type {
  ProductVariant,
  Recommendation,
  RecommendationContext,
  ShopperProfileId,
} from "../../domain";

export interface RecommendationsProvider {
  getRecommendations(shopperId: ShopperProfileId): Promise<readonly Recommendation[]>;
  generateRecommendations(
    shopperId: ShopperProfileId,
    context: RecommendationContext,
    candidates: readonly ProductVariant[],
  ): Promise<readonly Recommendation[]>;
}
