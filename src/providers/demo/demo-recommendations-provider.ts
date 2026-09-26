import type { RecommendationCandidate, RecommendationsProvider } from "../interfaces/recommendations-provider";
import type { Product, Recommendation, RecommendationContext, RecommendationPrimaryReason, RecommendationSecondaryReason, ShopperProfileId } from "../../domain";

const FACE_LABELS: Record<string, string> = { گرد: "round", بیضی: "oval", مربع: "rectangle", کشیده: "rectangle", قلبی: "heart" };

function custom(product: Product, key: string): unknown { return product.attributes.customAttributes[key]; }
function stringArray(value: unknown): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }

type Journey = { productType: string | null; useCase: string | null; style: string | null; faceShape: string | null };

function scoreCandidate(product: Product, context: RecommendationContext): { score: number; primary: RecommendationPrimaryReason; secondary: RecommendationSecondaryReason[]; explanation: string } {
  const journey = (context as RecommendationContext & { journey?: Journey }).journey;
  const productType = journey?.productType ?? "";
  const useCase = journey?.useCase ?? "";
  const style = journey?.style ?? "";
  const faceShape = journey?.faceShape ?? "";
  const category = product.attributes.category;
  const shapes = stringArray(custom(product, "frameShapes"));
  const faces = stringArray(custom(product, "faceCompatibility"));
  const sourceStyle = String(custom(product, "style") ?? "").toLowerCase();
  const lens = String(custom(product, "lensFeature") ?? "").toLowerCase();
  let score = 35;
  const secondary: RecommendationSecondaryReason[] = [];
  const reasons: string[] = [];

  if ((productType === "عینک طبی" && category === "optical") || (productType === "عینک آفتابی" && category === "sunglasses")) {
    score += 24; reasons.push("نوع عینک با انتخاب شما هماهنگ است");
  } else if (productType === "هر دو") score += 14; else score -= 6;

  const normalizedFace = FACE_LABELS[faceShape];
  if (normalizedFace && faces.includes(normalizedFace)) { score += 18; reasons.push("فرم صورت انتخاب‌شده در اطلاعات محصول پشتیبانی شده است"); }
  if (useCase.includes("روزمره") && (category === "optical" || lens.includes("single"))) { score += 8; reasons.push("برای استفاده روزمره انتخاب متعادلی است"); }
  if (useCase.includes("کار") && (category === "optical" || shapes.some((s) => ["rectangular", "square", "round"].includes(s)))) { score += 7; reasons.push("با فضای کاری و ظاهر مرتب سازگار است"); }
  if (useCase.includes("رانندگی") && category === "sunglasses") { score += 8; reasons.push("برای مسیرهای بیرون از خانه در دسته آفتابی قرار می‌گیرد"); }
  if (useCase.includes("مناسبت") && ["butterfly", "square", "aviator"].some((s) => shapes.includes(s))) { score += 8; reasons.push("فرم شاخص‌تری برای استایل انتخاب‌شده دارد"); }

  if (style.includes("مینیمال") && (shapes.includes("round") || shapes.includes("rectangular") || String(custom(product, "frameType") ?? "").includes("full"))) { score += 6; reasons.push("ساختار فریم با انتخاب مینیمال نزدیک است"); }
  if (style.includes("کلاسیک") && (shapes.includes("aviator") || shapes.includes("round") || shapes.includes("wayfarer") || sourceStyle.includes("understated"))) { score += 9; reasons.push("فرم کلاسیک و ماندگار دارد"); }
  if (style.includes("مدرن") && (shapes.includes("square") || shapes.includes("butterfly") || shapes.includes("rectangular"))) { score += 8; reasons.push("فرم معاصر و مشخصی دارد"); }
  if (style.includes("جسور") && (shapes.includes("butterfly") || shapes.includes("square") || shapes.includes("aviator"))) { score += 7; reasons.push("فرم فریم شخصیت بصری بیشتری ایجاد می‌کند"); }
  if (product.attributes.tags.includes("unisex")) { score += 2; }

  score = Math.max(0, Math.min(100, score));
  const primary: RecommendationPrimaryReason = reasons.some((r) => r.includes("فرم صورت")) ? "style_match" : reasons.some((r) => r.includes("نوع عینک")) ? "shopper_request" : "complementary";
  return { score, primary, secondary: [...new Set(secondary)], explanation: reasons.slice(0, 3).join(" · ") || "با الگوی انتخاب فعلی شما همخوانی مناسبی دارد." };
}

export class DemoRecommendationsProvider implements RecommendationsProvider {
  async getRecommendations(_shopperId: ShopperProfileId): Promise<readonly Recommendation[]> { return []; }

  async generateRecommendations(shopperId: ShopperProfileId, context: RecommendationContext, candidates: readonly RecommendationCandidate[]): Promise<readonly Recommendation[]> {
    const ranked = candidates.map((candidate) => ({ candidate, result: scoreCandidate(candidate.product, context) }))
      .sort((a, b) => b.result.score - a.result.score || a.candidate.product.merchandising.displayPriority - b.candidate.product.merchandising.displayPriority)
      .slice(0, 3);
    const now = new Date();
    return ranked.map(({ candidate, result }, index) => ({
      identity: { id: "demo-recommendation-" + (index + 1) + "-" + candidate.variant.identity.id },
      shopperId,
      variantId: candidate.variant.identity,
      score: { overall: result.score, styleMatch: result.score, budgetMatch: null, occasionMatch: result.score, popularityScore: null },
      reason: { primaryReason: result.primary, secondaryReasons: result.secondary, explanation: result.explanation },
      context,
      createdAt: now,
      expiresAt: null,
    }));
  }
}