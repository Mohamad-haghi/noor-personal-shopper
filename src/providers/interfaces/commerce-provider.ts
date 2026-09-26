import type { CommerceOffer, ProductVariantId } from "../../domain";

export interface CommerceProvider {
  getOffer(variantId: ProductVariantId): Promise<CommerceOffer | null>;
  listOffers(): Promise<readonly CommerceOffer[]>;
}
