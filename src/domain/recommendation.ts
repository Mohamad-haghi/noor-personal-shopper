import type { ProductVariantId } from "./product-variant";
import type { ShopperProfileId } from "./shopper-profile";

export interface RecommendationId {
  readonly id: string;
}

export interface Recommendation {
  readonly identity: RecommendationId;
  readonly shopperId: ShopperProfileId;
  readonly variantId: ProductVariantId;
  readonly score: RecommendationScore;
  readonly reason: RecommendationReason;
  readonly context: RecommendationContext;
  readonly createdAt: Date;
  readonly expiresAt: Date | null;
}

export interface RecommendationScore {
  readonly overall: number;
  readonly styleMatch: number | null;
  readonly budgetMatch: number | null;
  readonly occasionMatch: number | null;
  readonly popularityScore: number | null;
}

export interface RecommendationReason {
  readonly primaryReason: RecommendationPrimaryReason;
  readonly secondaryReasons: readonly RecommendationSecondaryReason[];
  readonly explanation: string | null;
}

export type RecommendationPrimaryReason = 
  | "style_match" 
  | "occasion_appropriate" 
  | "budget_friendly" 
  | "trending" 
  | "complementary" 
  | "new_arrival"
  | "best_seller"
  | "similar_to_previous"
  | "shopper_request";

export type RecommendationSecondaryReason = 
  | "color_match"
  | "size_available"
  | "brand_preference"
  | "price_point"
  | "seasonal";

export interface RecommendationContext {
  readonly occasion: string | null;
  readonly season: Season | null;
  readonly requestSource: RecommendationSource;
  /** Shopper answers used by the provider-facing rule engine. */
  readonly journey?: {
    readonly productType: string | null;
    readonly useCase: string | null;
    readonly style: string | null;
    readonly faceShape: string | null;
  };
}

export type Season = "spring" | "summer" | "fall" | "winter" | "all_season";

export type RecommendationSource = "automatic" | "shopper_request" | "occasion_based" | "collection_update";
