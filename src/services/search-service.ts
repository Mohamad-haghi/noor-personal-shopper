import type { SearchProvider } from "../providers/interfaces/search-provider";
import type { ProductId } from "../domain/product";
import type { SearchQuery, SearchResponse, SearchResult } from "../domain/search";

export class SearchService {
  constructor(private readonly provider: SearchProvider) {}

  search(query: SearchQuery): Promise<SearchResponse> {
    return this.provider.search(query);
  }

  findSimilar(productId: ProductId, limit = 4): Promise<readonly SearchResult[]> {
    return this.provider.findSimilar(productId, limit);
  }
}
