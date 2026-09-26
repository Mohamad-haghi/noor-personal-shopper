import type {
  Product,
  ProductVariant,
  Recommendation,
  RecommendationContext,
  ShopperProfileId,
} from "../../domain";

export interface RecommendationCandidate {
  readonly product: Product;
  readonly variant: ProductVariant;
}

export interface RecommendationsProvider {
  getRecommendations(shopperId: ShopperProfileId): Promise<readonly Recommendation[]>;
  generateRecommendations(
    shopperId: ShopperProfileId,
    context: RecommendationContext,
    candidates: readonly RecommendationCandidate[],
  ): Promise<readonly Recommendation[]>;
}
