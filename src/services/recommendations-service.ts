import type {
  Recommendation,
  RecommendationContext,
  ShopperProfileId,
  Product,
} from "../domain";
import type { CatalogService } from "./catalog-service";
import { RecommendationEngine, type RecommendationCandidate } from "./recommendation-engine";

export class RecommendationsService {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly engine: RecommendationEngine = new RecommendationEngine(),
  ) {}

  async getProductForVariant(
    variantId: import("../domain").ProductVariantId,
  ): Promise<Product | null> {
    return this.catalogService.getProduct(variantId.productId);
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

    return this.engine.generate(shopperId, context, candidates);
  }
}
