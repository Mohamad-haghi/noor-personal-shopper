import type { SearchQuery } from "../../domain/search";
import type { IntegrationProvider } from "./integration-provider";

export interface SearchIntegration extends IntegrationProvider {
  search(query: SearchQuery): Promise<unknown>;
}
