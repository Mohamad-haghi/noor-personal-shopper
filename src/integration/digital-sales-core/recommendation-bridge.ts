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

function categoryFor(productType: string | null): string | undefined {
  if (productType === "عینک طبی") return "optical";
  if (productType === "عینک آفتابی") return "sunglasses";
  return undefined;
}

function faceFor(value: string | null): string | undefined {
  const map: Record<string, string> = {
    "گرد": "round",
    "بیضی": "oval",
    "مربع": "rectangle",
    "قلبی": "heart",
    "کشیده": "rectangle",
  };
  return value ? map[value] : undefined;
}

function shapeForStyle(value: string | null): string | undefined {
  const map: Record<string, string> = {
    "مینیمال و ظریف": "round",
    "کلاسیک و ماندگار": "aviator",
    "مدرن و شاخص": "square",
    "جسور و متفاوت": "butterfly",
  };
  return value ? map[value] : undefined;
}

function toIntent(
  shopperId: ShopperProfileId,
  context: RecommendationContext,
): CustomerIntent {
  const journey = context.journey;
  const faceShape = faceFor(journey?.faceShape ?? null);
  const frameShape = shapeForStyle(journey?.style ?? null);
  const category = categoryFor(journey?.productType ?? null);

  return {
    id: `noor-intent-${shopperId.id}`,
    sessionId: `noor-session-${shopperId.id}`,
    ...(category ? { category } : {}),
    ...(context.occasion ? { useCase: context.occasion } : {}),
    preferences: {
      ...(faceShape ? { faceCompatibility: faceShape } : {}),
      ...(frameShape ? { frameShapes: frameShape } : {}),
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

function findNoorProduct(
  products: readonly Product[],
  coreProductId: string,
  catalogProducts: readonly { product: Product; noor: Product }[],
): Product | null {
  const core = products.find((item) => item.id === coreProductId);
  return core ?? null;
}

export class NoorDigitalSalesRecommendationBridge {
  private readonly provider: NoorDigitalSalesProductProvider;
  private readonly engine: DigitalSalesEngine;

  constructor(private readonly catalogService: CatalogService) {
    this.provider = new NoorDigitalSalesProductProvider(catalogService);
    this.engine = new DigitalSalesEngine({
      productProvider: this.provider,
      domainPack: EYEWEAR_DOMAIN_PACK_V1,
    });
  }

  async generateRecommendations(
    shopperId: ShopperProfileId,
    context: RecommendationContext,
  ): Promise<readonly Recommendation[]> {
    const intent = toIntent(shopperId, context);
    const coreRecommendations = await this.engine.recommend(intent, 3);
    const noorProducts = await this.catalogService.listProducts();
    const results: Recommendation[] = [];

    for (const [index, coreRecommendation] of coreRecommendations.entries()) {
      const noorProduct = noorProducts.find(
        (product) =>
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
