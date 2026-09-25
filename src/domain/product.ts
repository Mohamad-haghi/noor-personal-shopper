export interface ProductId {
  readonly id: string;
  readonly source: ProductSource;
}

export type ProductSource = "demo" | "noor" | "external";

export interface Product {
  readonly identity: ProductId;
  readonly slug: string;
  readonly name: string;
  readonly description: string | null;
  readonly attributes: ProductAttributes;
  readonly merchandising: ProductMerchandising;
  readonly media: ProductMedia;
  readonly externalIds: ExternalProductIdentifiers;
}

export interface ProductAttributes {
  readonly category: string | null;
  readonly subcategory: string | null;
  readonly tags: readonly string[];
  readonly customAttributes: Readonly<Record<string, unknown>>;
}

export interface ProductMerchandising {
  readonly isFeatured: boolean;
  readonly isNewArrival: boolean;
  readonly isBestSeller: boolean;
  readonly displayPriority: number;
  readonly promotionalLabels: readonly string[];
}

export interface ProductMedia {
  readonly primaryImage: ProductImage | null;
  readonly gallery: readonly ProductImage[];
  readonly videoUrl: string | null;
}

export interface ProductImage {
  readonly url: string;
  readonly altText: string | null;
  readonly width: number | null;
  readonly height: number | null;
}

export interface ExternalProductIdentifiers {
  readonly sku: string | null;
  readonly barcode: string | null;
  readonly providerProductId: string | null;
  readonly externalSystemIds: Readonly<Record<string, string>>;
}
