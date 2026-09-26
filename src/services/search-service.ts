import type { Product, ProductId, SearchQuery, SearchResponse, SearchResult } from "../domain";
import type { CatalogService } from "./catalog-service";
import type { SearchProvider } from "../providers/interfaces/search-provider";

export class SearchService {
  constructor(private readonly provider: SearchProvider, private readonly catalogService: CatalogService) {}

  search(query: SearchQuery): Promise<SearchResponse> { return this.provider.search(query); }

  async findSimilar(productId: ProductId, limit = 4): Promise<readonly SearchResult[]> {
    const products = await this.catalogService.listProducts();
    const target = products.find((item) => item.identity.id === productId.id && item.identity.source === productId.source);
    if (!target) return [];
    const tc = target.attributes.customAttributes;
    const targetShapes = Array.isArray(tc.frameShapes) ? tc.frameShapes.map(String) : [];
    const targetFaces = Array.isArray(tc.faceCompatibility) ? tc.faceCompatibility.map(String) : [];
    return products.filter((item) => item.identity.id !== target.identity.id).map((item) => {
      const c = item.attributes.customAttributes; const shapes = Array.isArray(c.frameShapes) ? c.frameShapes.map(String) : []; const faces = Array.isArray(c.faceCompatibility) ? c.faceCompatibility.map(String) : [];
      const matched: string[] = []; const reasons: string[] = []; let score = 0;
      if (item.attributes.category === target.attributes.category) { score += 3; matched.push("category"); }
      if (typeof c.frameMaterial === "string" && c.frameMaterial === tc.frameMaterial) { score += 2; matched.push("material"); reasons.push("جنس فریم مشابه است"); }
      if (targetShapes.some((shape) => shapes.includes(shape))) { score += 3; matched.push("shape"); reasons.push("فرم فریم مشابه است"); }
      if (targetFaces.length && faces.length && targetFaces.some((face) => faces.includes(face))) { score += 2; matched.push("frame-dna"); reasons.push("Frame DNA مشترک دارد"); }
      if (typeof c.frameColor === "string" && c.frameColor === tc.frameColor) { score += 1; matched.push("color"); reasons.push("رنگ فریم مشابه است"); }
      return { productId: item.identity, score, matchedAttributes: matched, reasons: reasons.slice(0, 3) };
    }).filter((result) => result.score > 0).sort((a, b) => b.score - a.score || a.productId.id.localeCompare(b.productId.id)).slice(0, Math.max(1, limit));
  }
}
