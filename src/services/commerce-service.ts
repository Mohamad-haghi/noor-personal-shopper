import type { CommerceOffer, ProductVariantId } from "../domain";
import type { CommerceProvider } from "../providers/interfaces/commerce-provider";

export class CommerceService {
  constructor(private readonly provider: CommerceProvider) {}

  getOffer(variantId: ProductVariantId): Promise<CommerceOffer | null> {
    return this.provider.getOffer(variantId);
  }

  listOffers(): Promise<readonly CommerceOffer[]> {
    return this.provider.listOffers();
  }
}
