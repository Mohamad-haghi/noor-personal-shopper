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

function toIntent(
  shopperId: ShopperProfileId,
  context: RecommendationContext,
): CustomerIntent {
  const journey = context.journey;
  // Category is a supported canonical filter. NOOR's style labels and face
  // shape answers do not have an approved mapping to the active COR criteria.
  // Do not infer a frame shape from an aesthetic label or send unsupported
  // fields; enable those preferences only after the NOOR Domain Pack approves
  // their semantics and matching rules.
  const category = categoryFor(journey?.productType ?? null);

  return {
    id: `noor-intent-${shopperId.id}`,
    sessionId: `noor-session-${shopperId.id}`,
    ...(category ? { category } : {}),
    ...(context.occasion ? { useCase: context.occasion } : {}),
    preferences: {},
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
    const noorProducts = await this.catalogService.listProducts();
    const results: Recommendation[] = [];

    for (const [index, coreRecommendation] of coreRecommendations.entries()) {
      const noorProduct = noorProducts.find(
        (product) =>
          product.identity.id === coreRecommendation.productId ||
          product.externalIds.providerProductId === coreRecommendation.productId ||
          product.externalIds.externalSystemIds.noorReference === coreRecommendation.productId,
      );
      if (!noorProduct) continue;

      const variants = await this.catalogService.listAvailableVariants(noorProduct.identity);
      const variant = variants[0] ?? (await this.catalogService.listVariants(noorProduct.identity))[0];
      if (!variant) continue;

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
          primaryReason: coreRecommendation.matchedCriteria.length
            ? "style_match"
            : "shopper_request",
          secondaryReasons: [],
          explanation: coreRecommendation.reasons
            .filter((reason) => reason.result === "matched")
            .map((reason) => reason.explanationKey ?? reason.criterion)
            .slice(0, 3)
            .join(" · ") || null,
        },
        context,
        createdAt: new Date(),
        expiresAt: null,
      });
    }

    return results;
  }

  getProductProvider(): NoorDigitalSalesProductProvider {
    return this.provider;
  }
}
