import type { RecommendationsProvider } from "../interfaces/recommendations-provider";
import type {
  ProductVariant,
  Recommendation,
  RecommendationContext,
  ShopperProfileId,
} from "../../domain";

export class DemoRecommendationsProvider implements RecommendationsProvider {
  async getRecommendations(_shopperId: ShopperProfileId): Promise<readonly Recommendation[]> {
    return [];
  }

  async generateRecommendations(
    _shopperId: ShopperProfileId,
    _context: RecommendationContext,
    _candidates: readonly ProductVariant[],
  ): Promise<readonly Recommendation[]> {
    return [];
  }
}
