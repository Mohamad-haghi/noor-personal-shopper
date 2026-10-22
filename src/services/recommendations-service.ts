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
    } catch (error) {
      // Preserve only a bounded, machine-safe diagnostic code for troubleshooting.
      // Never expose response bodies, credentials, or arbitrary provider messages.
      const candidate = error && typeof error === "object" && "code" in error &&
        typeof (error as { code?: unknown }).code === "string"
          ? (error as { code: string }).code
          : error instanceof Error ? error.message : "";
      const safeCode = /^cor_[a-z0-9_]{1,80}$/.test(candidate)
        ? candidate
        : "cor_recommendation_unavailable";
      throw new Error(safeCode);
    }
  }
}
