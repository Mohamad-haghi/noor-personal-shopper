import type {
  Recommendation,
  RecommendationCandidate,
  RecommendationContext,
  ShopperProfileId,
} from "../domain";
import type { RecommendationsProvider } from "../providers/interfaces/recommendations-provider";
import { CatalogService } from "./catalog-service";

export class RecommendationsService {
  constructor(
    private readonly provider: RecommendationsProvider,
    private readonly catalogService: CatalogService,
  ) {}

  async getProductForVariant(variantId: import("../domain").ProductVariantId) {
    return this.catalogService.getProduct(variantId);
  }

  getRecommendations(shopperId: ShopperProfileId): Promise<readonly Recommendation[]> {
    return this.provider.getRecommendations(shopperId);
  }

  async generateRecommendations(
    shopperId: ShopperProfileId,
    context: RecommendationContext,
  ): Promise<readonly Recommendation[]> {
    const availableVariants = await this.catalogService.listAvailableVariants();
    const candidates: RecommendationCandidate[] = [];

    for (const variant of availableVariants) {
      const product = await this.catalogService.getProduct(variant.identity.productId);
      if (product) candidates.push({ product, variant });
    }

    return this.provider.generateRecommendations(shopperId, context, candidates);
  }
}
