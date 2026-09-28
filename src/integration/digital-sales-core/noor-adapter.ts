import type {
  Product as CoreProduct,
  ProductAttributeValue,
  ProductVariant as CoreProductVariant,
} from "digital-sales-core";
import type { Product as NoorProduct } from "../../domain/product";
import type { ProductVariant as NoorProductVariant } from "../../domain/product-variant";

export type DigitalSalesProductVariant = CoreProductVariant;
export type DigitalSalesProduct = CoreProduct;

export interface NoorDigitalSalesAdapterConfig {
  readonly locale: string;
  readonly storeOrigin: string;
  readonly purchaseDestinationMode: "product";
  readonly searchPath: string;
}

export const NOOR_DIGITAL_SALES_ADAPTER_CONFIG: NoorDigitalSalesAdapterConfig = {
  locale: "fa",
  storeOrigin: "https://www.nooroptic.com",
  purchaseDestinationMode: "product",
  searchPath: "/fa/search",
};

function coreAttributes(
  attributes: Readonly<Record<string, unknown>>,
): Readonly<Record<string, ProductAttributeValue>> {
  const result: Record<string, ProductAttributeValue> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      result[key] = value;
    } else if (
      Array.isArray(value) &&
      value.every(
        (item) =>
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean",
      )
    ) {
      result[key] = value as ProductAttributeValue[];
    }
  }
  return result;
}

function normalizeVariant(
  product: NoorProduct,
  variant: NoorProductVariant,
): DigitalSalesProductVariant {
  return {
    id: variant.identity.id,
    productId: product.externalIds.providerProductId ?? product.identity.id,
    title: variant.name,
    attributes: coreAttributes(variant.attributes.customAttributes),
    availability: variant.availability.isAvailable,
  };
}

function productUrl(
  product: NoorProduct,
  config: NoorDigitalSalesAdapterConfig,
): string | undefined {
  const model = product.attributes.customAttributes.model;
  if (typeof model !== "string" || !model.trim()) return undefined;

  const query = encodeURIComponent(model.trim());
  return `${config.storeOrigin.replace(/\/$/, "")}${config.searchPath}?controller=search&s=${query}`;
}

export function toDigitalSalesProduct(
  product: NoorProduct,
  variants: readonly NoorProductVariant[] = [],
  config: NoorDigitalSalesAdapterConfig = NOOR_DIGITAL_SALES_ADAPTER_CONFIG,
): DigitalSalesProduct {
  const reference =
    product.externalIds.providerProductId ??
    product.externalIds.externalSystemIds.noorReference ??
    product.externalIds.sku ??
    product.identity.id;

  const customAttributes = coreAttributes(product.attributes.customAttributes);
  const primaryImage = product.media.primaryImage?.url;
  const images = [
    ...(primaryImage ? [primaryImage] : []),
    ...product.media.gallery.map((image) => image.url),
  ];

  return {
    id: reference,
    title: product.name,
    category: product.attributes.category ?? "eyewear",
    ...(product.description ? { description: product.description } : {}),
    ...(typeof customAttributes.price === "number" ? { price: customAttributes.price } : {}),
    currency: "IRR",
    ...(images.length ? { images } : {}),
    ...(productUrl(product, config) ? { url: productUrl(product, config) } : {}),
    availability:
      variants.length > 0
        ? variants.some((item) => item.availability.isAvailable)
        : true,
    attributes: {
      ...customAttributes,
      source: "noor",
      noorProductId: product.identity.id,
      noorReference: reference,
    },
    ...(product.attributes.tags.length ? { tags: [...product.attributes.tags] } : {}),
    ...(variants.length
      ? { variants: variants.map((variant) => normalizeVariant(product, variant)) }
      : {}),
  };
}

export function toDigitalSalesProducts(
  products: readonly NoorProduct[],
  variantsByProductId: ReadonlyMap<string, readonly NoorProductVariant[]> = new Map(),
  config: NoorDigitalSalesAdapterConfig = NOOR_DIGITAL_SALES_ADAPTER_CONFIG,
): DigitalSalesProduct[] {
  return products.map((product) =>
    toDigitalSalesProduct(
      product,
      variantsByProductId.get(product.identity.id) ?? [],
      config,
    ),
  );
}

export function createNoorPurchaseDestination(
  product: DigitalSalesProduct,
  config: NoorDigitalSalesAdapterConfig = NOOR_DIGITAL_SALES_ADAPTER_CONFIG,
): string {
  if (product.url) return product.url;
  const query = encodeURIComponent(product.title);
  return `${config.storeOrigin.replace(/\/$/, "")}${config.searchPath}?controller=search&s=${query}`;
}
