import type { SearchQuery, SearchResponse, SearchResult } from "../../domain/search";

export interface SearchProvider {
  search(query: SearchQuery): Promise<SearchResponse>;
  findSimilar(productId: import("../../domain").ProductId, limit?: number): Promise<readonly SearchResult[]>;
}
