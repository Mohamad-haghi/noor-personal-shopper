import type { CatalogProvider } from "../interfaces/catalog-provider";
import type {
  CommerceOffer,
  ProductVariant,
  ProductVariantId,
} from "../../domain";
import type { CommerceProvider } from "../interfaces/commerce-provider";

export interface DemoCommercePricingPolicy {
  readonly basePrice: number;
  readonly step: number;
  readonly currency: string;
}

const DEFAULT_PRICING_POLICY: DemoCommercePricingPolicy = Object.freeze({
  basePrice: 6_900_000,
  step: 250_000,
  currency: "IRR",
});

export class DemoCommerceProvider implements CommerceProvider {
  constructor(
    private readonly catalogProvider: CatalogProvider,
    private readonly pricingPolicy: DemoCommercePricingPolicy = DEFAULT_PRICING_POLICY,
  ) {}

  async getOffer(variantId: ProductVariantId): Promise<CommerceOffer | null> {
    const variants = await this.catalogProvider.listVariants(variantId.productId);
    const index = variants.findIndex((variant) => variant.identity.id === variantId.id);
    if (index < 0) return null;

    const product = await this.catalogProvider.getProduct(variantId.productId);
    if (!product) return null;

    return this.createOffer(variants[index], index, product.merchandising.displayPriority);
  }

  async listOffers(): Promise<readonly CommerceOffer[]> {
    const products = await this.catalogProvider.listProducts();
    const offers: CommerceOffer[] = [];

    for (const product of products) {
      const variants = await this.catalogProvider.listVariants(product.identity);
      for (let index = 0; index < variants.length; index += 1) {
        offers.push(
          this.createOffer(variants[index], index, product.merchandising.displayPriority),
        );
      }
    }

    return offers;
  }

  private createOffer(
    variant: ProductVariant,
    variantIndex: number,
    displayPriority: number,
  ): CommerceOffer {
    const amount =
      this.pricingPolicy.basePrice +
      Math.max(0, displayPriority - 1) * this.pricingPolicy.step +
      variantIndex * this.pricingPolicy.step;

    return {
      identity: {
        id: "demo-offer-" + variant.identity.productId.id + "-" + variant.identity.id,
      },
      variantId: variant.identity,
      pricing: {
        amount,
        currency: this.pricingPolicy.currency,
        source: "demo",
        label: "قیمت نمایشی Demo",
      },
      purchasable: variant.availability.isAvailable,
      availability: {
        source: "demo",
        isAvailable: variant.availability.isAvailable,
      },
    };
  }
}
