import type { SearchProvider } from "../providers/interfaces/search-provider";
import type { SearchQuery, SearchResponse } from "../domain/search";

export class SearchService {
  constructor(private readonly provider: SearchProvider) {}

  search(query: SearchQuery): Promise<SearchResponse> {
    return this.provider.search(query);
  }
}
