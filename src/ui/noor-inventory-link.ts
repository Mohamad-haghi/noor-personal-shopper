import type { Product } from "../domain";

const NOOR_STORE_ORIGIN = "https://www.nooroptic.com";
const NOOR_STORE_LOCALE = "/fa";

function customString(product: Product, key: string): string | null {
  const value = product.attributes.customAttributes[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export interface NoorInventoryDestination {
  readonly url: string;
  readonly reference: string;
  readonly label: string;
}

export function getNoorInventoryDestination(product: Product): NoorInventoryDestination | null {
  const reference =
    product.externalIds.providerProductId ??
    product.externalIds.externalSystemIds.noorReference ??
    product.externalIds.sku ??
    null;

  if (!reference) return null;

  const model = customString(product, "model") ?? product.name;
  const query = encodeURIComponent(model);
  return {
    url: `${NOOR_STORE_ORIGIN}${NOOR_STORE_LOCALE}/search?controller=search&s=${query}`,
    reference,
    label: "مشاهده در فروشگاه نور",
  };
}
