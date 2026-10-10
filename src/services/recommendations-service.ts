import type {
  Recommendation,
  RecommendationContext,
  ShopperProfileId,
  Product,
} from "../domain";
import type { CatalogService } from "./catalog-service";

/**
 * Boundary between the Personal Shopper presentation and the decision provider.
 * A future integrated composition can implement this with the remote COR API;
 * this service must never rank products locally as a fallback.
 */
export interface RecommendationDecisionProvider {
  generateRecommendations(
    shopperId: ShopperProfileId,
    context: RecommendationContext,
  ): Promise<readonly Recommendation[]>;
}

export class RecommendationsService {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly decisionProvider: RecommendationDecisionProvider,
  ) {
    if (!decisionProvider) {
      throw new Error("cor_decision_provider_required");
    }
  }

  async getProductForVariant(
    variantId: import("../domain").ProductVariantId,
  ): Promise<Product | null> {
    return this.catalogService.getProduct(variantId.productId);
  }

  async generateRecommendations(
    shopperId: ShopperProfileId,
    context: RecommendationContext,
  ): Promise<readonly Recommendation[]> {
    try {
      return await this.decisionProvider.generateRecommendations(shopperId, context);
    } catch {
      // Never replace a failed decision-provider response with local ranking
      // or demo results. The UI handles this stable error as an unavailable state.
      throw new Error("cor_recommendation_unavailable");
    }
  }
}
