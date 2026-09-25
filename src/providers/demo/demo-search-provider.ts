import type { SearchProvider } from "../interfaces/search-provider";
import type { SearchQuery, SearchResponse } from "../../domain/search";

export class DemoSearchProvider implements SearchProvider {
  async search(query: SearchQuery): Promise<SearchResponse> {
    return { query, results: [], total: 0 };
  }
}
