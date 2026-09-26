import type {
  Recommendation,
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

  getRecommendations(shopperId: ShopperProfileId): Promise<readonly Recommendation[]> {
    return this.provider.getRecommendations(shopperId);
  }

  async generateRecommendations(
    shopperId: ShopperProfileId,
    context: RecommendationContext,
  ): Promise<readonly Recommendation[]> {
    const candidates = await this.catalogService.listAvailableVariants();
    return this.provider.generateRecommendations(shopperId, context, candidates);
  }
}
