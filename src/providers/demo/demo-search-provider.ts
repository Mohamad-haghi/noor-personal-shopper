import type { CatalogProvider } from "../interfaces/catalog-provider";
import type { SearchProvider } from "../interfaces/search-provider";
import type { Product, SearchQuery, SearchResponse, SearchResult } from "../../domain";

const SYNONYMS: Readonly<Record<string, readonly string[]>> = {
  "طبی": ["optical", "عینک طبی"], "آفتابی": ["sunglasses", "عینک آفتابی"], "مشکی": ["black"], "طلایی": ["gold"],
  "قهوه‌ای": ["brown", "havana"], "کلاسیک": ["classic", "simple", "understated"], "مینیمال": ["minimal", "understated", "simple"],
  "مدرن": ["modern", "sporty"], "جسور": ["bold"], "گرد": ["round"], "مربع": ["square", "rectangle"],
  "مستطیل": ["rectangular", "rectangle"], "خلبانی": ["aviator"], "پروانه‌ای": ["butterfly"], "روزمره": ["daily", "urban"],
  "رانندگی": ["driving", "outdoor"],
};

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("fa").replaceAll("ي", "ی").replaceAll("ك", "ک").replaceAll(/[،,؛;|/]+/g, " ").replaceAll(/\s+/g, " ");
}
function termsFor(text: string): string[] {
  const raw = normalize(text).split(" ").filter(Boolean); const expanded = new Set(raw);
  for (const term of raw) for (const synonym of SYNONYMS[term] ?? []) expanded.add(normalize(synonym));
  return [...expanded];
}
function searchableValues(product: Product): string[] {
  const c = product.attributes.customAttributes;
  return [product.name, product.description ?? "", product.slug, product.attributes.category ?? "", product.attributes.subcategory ?? "", ...product.attributes.tags, String(c.model ?? ""), String(c.gender ?? ""), String(c.frameMaterial ?? ""), String(c.frameColor ?? ""), ...(Array.isArray(c.frameShapes) ? c.frameShapes.map(String) : []), ...(Array.isArray(c.faceCompatibility) ? c.faceCompatibility.map(String) : []), String(c.style ?? ""), String(c.sourceNote ?? "")].map(normalize).filter(Boolean);
}
function scoreProduct(product: Product, query: SearchQuery, terms: readonly string[]): SearchResult | null {
  const values = searchableValues(product); const haystack = values.join(" "); const matched = new Set<string>(); const reasons = new Set<string>(); let score = 0;
  const q = normalize(query.text);
  if (q && haystack.includes(q)) { score += 8; matched.add("exact"); reasons.add("عبارت جست‌وجو مستقیماً در اطلاعات فریم پیدا شد"); }
  for (const term of terms) if (haystack.includes(term)) { score += 2; matched.add(term); }
  const c = product.attributes.customAttributes; const faces = Array.isArray(c.faceCompatibility) ? c.faceCompatibility.map(String) : [];
  for (const raw of normalize(query.text).split(" ").filter(Boolean)) {
    const expanded = SYNONYMS[raw] ?? [raw];
    if (expanded.some((term) => faces.includes(term))) { score += 3; matched.add("frame-dna"); reasons.add("فرم فریم با Frame DNA ثبت‌شده برای این جست‌وجو همخوانی دارد"); }
  }
  if (query.category && product.attributes.category === query.category) { score += 4; matched.add("category"); reasons.add(query.category === "optical" ? "نوع فریم: طبی" : "نوع فریم: آفتابی"); }
  if (score === 0) return null;
  if ([...matched].some((x) => ["round","square","rectangle","rectangular","aviator","butterfly"].includes(x))) reasons.add("فرم فریم با عبارت جست‌وجو تطبیق داده شد");
  if ([...matched].some((x) => ["black","gold","brown"].includes(x))) reasons.add("رنگ فریم با عبارت جست‌وجو تطبیق داده شد");
  return { productId: product.identity, score, matchedAttributes: [...matched], reasons: [...reasons].slice(0, 3) };
}
export class DemoSearchProvider implements SearchProvider {
  constructor(private readonly catalogProvider: CatalogProvider) {}
  async search(query: SearchQuery): Promise<SearchResponse> {
    const products = await this.catalogProvider.listProducts(); const terms = termsFor(query.text);
    const results = products.map((product) => scoreProduct(product, query, terms)).filter((result): result is SearchResult => result !== null).sort((a, b) => b.score - a.score || a.productId.id.localeCompare(b.productId.id));
    const offset = Math.max(0, query.offset ?? 0); const limit = Math.max(1, query.limit ?? 12);
    return { query, results: results.slice(offset, offset + limit), total: results.length };
  }
}
