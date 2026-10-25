import {
  DigitalSalesEngine,
  EYEWEAR_DOMAIN_PACK_V1,
  type CustomerIntent,
  type Recommendation as CoreRecommendation,
} from "digital-sales-core";
import type {
  Recommendation,
  RecommendationContext,
  Product,
  ProductVariant,
  ShopperProfileId,
} from "../../domain";
import type { CatalogService } from "../../services/catalog-service";
import { NoorDigitalSalesProductProvider } from "./catalog-provider";
import type { CorShopperRemoteClient } from "../cor-shopper-remote-client";

function categoryFor(productType: string | null): string | undefined {
  if (productType === "عینک طبی") return "optical";
  if (productType === "عینک آفتابی") return "sunglasses";
  return undefined;
}

function shapeForPreference(value: string | null): string | undefined {
  const map: Record<string, string> = { "خلبانی": "aviator", "مستطیلی": "rectangular", "گرد": "round", "مربعی": "square", "پروانه‌ای": "butterfly", "ویفِرر": "wayfarer" };
  return value ? map[value] : undefined;
}

function faceShapeForPreference(value: string | null): string | undefined {
  const map: Record<string, string> = {
    "گرد": "round",
    "بیضی": "oval",
    "مربع": "square",
    "مستطیل": "rectangle",
    "قلبی": "heart",
    "مثلثی": "triangle",
  };
  return value ? map[value] : undefined;
}

const SHAPE_CRITERIA = new Set(["frame-shape", "shape", "frame_shape", "frameShapes", "style"]);
const REASON_LABELS: Record<string, string> = {
  "eyewear.frame_shape_match": "تناسب با فرم فریم انتخابی شما",
  "eyewear.face_compatibility_match": "تناسب با فرم صورت انتخابی شما",
  "eyewear.frame_material_match": "تناسب با جنس فریم انتخابی شما",
  "eyewear.frame_color_match": "تناسب با رنگ فریم انتخابی شما",
  "eyewear.uv_protection_match": "دارای ویژگی محافظت در برابر فرابنفش",
  "eyewear.prescription_capable_match": "مناسب برای عدسی طبی",
  "eyewear.lens_feature_match": "تناسب با ویژگی عدسی انتخابی شما",
  "frame-shape": "تناسب با فرم فریم انتخابی شما",
  "face-compatibility": "تناسب با فرم صورت انتخابی شما",
  "frame-material": "تناسب با جنس فریم انتخابی شما",
  "frame-color": "تناسب با رنگ فریم انتخابی شما",
  "uv-protection": "دارای ویژگی محافظت در برابر فرابنفش",
  "prescription-capable": "مناسب برای عدسی طبی",
  "lens-feature": "تناسب با ویژگی عدسی انتخابی شما",
  category: "تناسب با نوع عینک انتخابی شما",
  category_match: "تناسب با نوع عینک انتخابی شما",
  shape: "تناسب با فرم فریم انتخابی شما",
  shape_match: "تناسب با فرم فریم انتخابی شما",
  frame_shape: "تناسب با فرم فریم انتخابی شما",
  frame_shape_match: "تناسب با فرم فریم انتخابی شما",
  availability: "در دسترس بودن محصول",
  availability_match: "در دسترس بودن محصول",
  uv_protection: "ویژگی محافظت در برابر فرابنفش",
  uv_protection_match: "ویژگی محافظت در برابر فرابنفش",
};

function localizedReason(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return REASON_LABELS[value] ?? REASON_LABELS[value.toLowerCase()];
}

function toIntent(
  shopperId: ShopperProfileId,
  context: RecommendationContext,
): CustomerIntent {
  const journey = context.journey;
  // The UI asks for a literal frame shape, not a vague aesthetic label.
  const frameShape = shapeForPreference(journey?.style ?? null);
  const faceShape = faceShapeForPreference(journey?.faceShape ?? null);
  const category = categoryFor(journey?.productType ?? null);

  return {
    id: `noor-intent-${shopperId.id}`,
    sessionId: `noor-session-${shopperId.id}`,
    ...(category ? { category } : {}),
    ...(context.occasion ? { useCase: context.occasion } : {}),
    preferences: {
      // Keep the legacy key understood by the currently active COR Domain Pack 1.1.0.
      // Newer packs consume frameShapes; sending both preserves forward compatibility.
      ...(frameShape ? { shape: frameShape, frameShapes: frameShape } : {}),
      ...(faceShape ? { faceCompatibility: faceShape } : {}),
    },
    constraints: {},
    priorities: [],
    desiredAttributes: [],
    excludedAttributes: [],
    context: {
      source: "noor-personal-shopper",
      requestSource: context.requestSource,
    },
  };
}

export class NoorDigitalSalesRecommendationBridge {
  private readonly provider: NoorDigitalSalesProductProvider;
  private readonly engine: DigitalSalesEngine;

  constructor(
    private readonly catalogService: CatalogService,
    private readonly remoteClient?: CorShopperRemoteClient,
  ) {
    this.provider = new NoorDigitalSalesProductProvider(catalogService);
    this.engine = new DigitalSalesEngine({
      // The offline-only fallback has its own explicit demo tenant scope.
      // Integrated recommendations use the server-derived COR tenant instead.
      tenantId: "tenant-noor-demo-local",
      productProvider: this.provider,
      domainPack: EYEWEAR_DOMAIN_PACK_V1,
    });
  }

  async generateRecommendations(
    shopperId: ShopperProfileId,
    context: RecommendationContext,
  ): Promise<readonly Recommendation[]> {
    const intent = toIntent(shopperId, context);
    let coreRecommendations: readonly CoreRecommendation[];
    if (this.remoteClient) {
      const requestId = "noor-request-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
      const response = await this.remoteClient.recommend<{
        contractVersion: string;
        requestId: string;
        result?: { source?: string; demoOnly?: boolean; recommendations?: CoreRecommendation[] };
      }>({
        contractVersion: "1.0.0",
        requestId,
        sessionId: intent.sessionId,
        intent: {
          ...(intent.category ? { category: intent.category } : {}),
          // NOOR's journey labels are Persian presentation copy, not canonical
          // COR useCase identifiers. Omit until an explicit mapping is defined;
          // sending UI labels can yield an unranked/empty decision result.
          preferences: intent.preferences,
          constraints: intent.constraints,
          priorities: intent.priorities,
          desiredAttributes: intent.desiredAttributes,
          excludedAttributes: intent.excludedAttributes,
        },
        limit: 3,
      });
      if (response.contractVersion !== "1.0.0" || response.requestId !== requestId ||
          response.result?.source !== "cor_canonical_engine" || response.result.demoOnly !== true ||
          !Array.isArray(response.result.recommendations)) {
        throw new Error("cor_recommendation_response_invalid");
      }
      coreRecommendations = response.result.recommendations;
    } else {
      coreRecommendations = await this.engine.recommend(intent, 3);
    }
    // A zero score means no preferred criterion matched. Do not present such
    // candidates as recommendations; an empty result is safer than false confidence.
    const positiveScoreRecommendations = coreRecommendations.filter(
      (recommendation) => Number.isFinite(recommendation.score) && recommendation.score > 0,
    );
    const noorProducts = await this.catalogService.listProducts();
    const results: Recommendation[] = [];
    let matchedProductCount = 0;
    let skippedMissingProductCount = 0;
    let skippedMissingVariantCount = 0;

    for (const [index, coreRecommendation] of positiveScoreRecommendations.entries()) {
      const noorProduct = noorProducts.find(
        (product) =>
          product.identity.id === coreRecommendation.productId ||
          product.externalIds.providerProductId === coreRecommendation.productId ||
          product.externalIds.externalSystemIds.noorReference === coreRecommendation.productId,
      );
      if (!noorProduct) {
        skippedMissingProductCount += 1;
        continue;
      }
      matchedProductCount += 1;

      const variants = await this.catalogService.listAvailableVariants(noorProduct.identity);
      const variant = variants[0] ?? (await this.catalogService.listVariants(noorProduct.identity))[0];
      if (!variant) {
        skippedMissingVariantCount += 1;
        continue;
      }

      results.push({
        identity: { id: `core-recommendation-${index + 1}-${variant.identity.id}` },
        shopperId,
        variantId: variant.identity,
        score: {
          overall: coreRecommendation.score,
          styleMatch: null,
          budgetMatch: null,
          occasionMatch: null,
          popularityScore: null,
        },
        reason: {
          // A category or availability match is not evidence of a style match.
          primaryReason: coreRecommendation.matchedCriteria.some((criterion) =>
            SHAPE_CRITERIA.has(criterion) || SHAPE_CRITERIA.has(criterion.toLowerCase()),
          ) ? "style_match" : "shopper_request",
          secondaryReasons: [],
          // Never expose raw internal criterion/explanation keys in the Persian UI.
          explanation: coreRecommendation.reasons
            .filter((reason) => reason.result === "matched")
            .map((reason) => localizedReason(reason.explanationKey) ?? localizedReason(reason.criterion))
            .filter((reason): reason is string => Boolean(reason))
            .slice(0, 3)
            .join(" · ") || null,
        },
        context,
        createdAt: new Date(),
        expiresAt: null,
      });
    }

    if (coreRecommendations.length === 0 || results.length !== coreRecommendations.length) {
      // Counts only: never log shopper IDs, product IDs, credentials, or response bodies.
      const source = this.remoteClient ? "cor_remote" : "local_fallback";
      const outcome = coreRecommendations.length === 0
        ? source === "cor_remote"
          ? "cor_returned_empty_recommendations"
          : "local_fallback_returned_empty_recommendations"
        : positiveScoreRecommendations.length === 0
          ? "no_positive_score_recommendations"
          : matchedProductCount === 0
          ? source === "cor_remote"
            ? "no_cor_product_ids_matched_noor_catalog"
            : "no_fallback_product_ids_matched_noor_catalog"
          : skippedMissingVariantCount > 0 && results.length === 0
            ? "matched_products_have_no_variants"
            : "some_recommendations_were_dropped";

      console.warn("[NOOR][COR] recommendation reconciliation", {
        source,
        outcome,
        coreRecommendationCount: coreRecommendations.length,
        positiveScoreRecommendationCount: positiveScoreRecommendations.length,
        noorCatalogCount: noorProducts.length,
        matchedProductCount,
        skippedMissingProductCount,
        skippedMissingVariantCount,
        finalRecommendationCount: results.length,
      });
    }

    return results;
  }

  getProductProvider(): NoorDigitalSalesProductProvider {
    return this.provider;
  }
}
