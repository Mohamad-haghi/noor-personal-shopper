export interface SearchQuery {
  readonly text: string;
  readonly category?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface SearchResult {
  readonly productId: ProductId;
  readonly score: number;
  readonly matchedAttributes: readonly string[];
  readonly reasons: readonly string[];
}

export interface SearchResponse {
  readonly query: SearchQuery;
  readonly results: readonly SearchResult[];
  readonly total: number;
}

import type { ProductId } from "./product";
