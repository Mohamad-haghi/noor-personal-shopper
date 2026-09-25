import type { SearchQuery, SearchResponse } from "../../domain/search";

export interface SearchProvider {
  search(query: SearchQuery): Promise<SearchResponse>;
}
