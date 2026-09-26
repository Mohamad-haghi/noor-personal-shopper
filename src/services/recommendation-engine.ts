import type {
  Product,
  ProductVariant,
  Recommendation,
  RecommendationContext,
  RecommendationPrimaryReason,
  RecommendationSecondaryReason,
  ShopperProfileId,
} from "../domain";

export interface RecommendationCandidate {
  readonly product: Product;
  readonly variant: ProductVariant;
}

type Journey = NonNullable<RecommendationContext["journey"]>;

const FACE_SHAPE_MAP: Readonly<Record<string, string>> = {
  "گرد": "round",
  "بیضی": "oval",
  "قلبی": "heart",
  "کشیده": "rectangle",
};

function custom(product: Product, key: string): unknown {
  return product.attributes.customAttributes[key];
}

function stringArray(value: unknown): readonly string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function hasAny(values: readonly string[], expected: readonly string[]): boolean {
  return expected.some((item) => values.includes(item));
}

function journeyOf(context: RecommendationContext): Journey {
  return context.journey ?? {
    productType: null,
    useCase: null,
    style: null,
    faceShape: null,
  };
}

function scoreCandidate(
  product: Product,
  context: RecommendationContext,
): {
  score: number;
  primary: RecommendationPrimaryReason;
  secondary: readonly RecommendationSecondaryReason[];
  explanation: string;
} {
  const journey = journeyOf(context);
  const category = product.attributes.category;
  const shapes = stringArray(custom(product, "frameShapes"));
  const faces = stringArray(custom(product, "faceCompatibility"));
  const frameType = String(custom(product, "frameType") ?? "").toLowerCase();
  const sourceStyle = String(custom(product, "style") ?? "").toLowerCase();
  const lensFeature = String(custom(product, "lensFeature") ?? "").toLowerCase();

  let score = 35;
  let primary: RecommendationPrimaryReason = "complementary";
  const secondary: RecommendationSecondaryReason[] = [];
  const reasons: string[] = [];

  if (
    (journey.productType === "عینک طبی" && category === "optical") ||
    (journey.productType === "عینک آفتابی" && category === "sunglasses")
  ) {
    score += 24;
    primary = "shopper_request";
    reasons.push("نوع عینک با انتخاب شما هماهنگ است");
  } else if (journey.productType === "هر دو" && category !== null) {
    score += 14;
    reasons.push("این فریم با انتخاب انعطاف‌پذیر شما سازگار است");
  } else if (journey.productType) {
    score -= 6;
  }

  const normalizedFace = journey.faceShape
    ? FACE_SHAPE_MAP[journey.faceShape]
    : undefined;
  if (normalizedFace && faces.includes(normalizedFace)) {
    score += 18;
    primary = "style_match";
    secondary.push("size_available");
    reasons.push("فرم صورت انتخاب‌شده در اطلاعات محصول پشتیبانی شده است");
  }

  if (
    journey.useCase === "استفاده روزمره" &&
    (category === "optical" || lensFeature.includes("single"))
  ) {
    score += 8;
    primary = primary === "complementary" ? "occasion_appropriate" : primary;
    reasons.push("ویژگی‌های ثبت‌شدهٔ فریم با استفاده روزمره همخوان است");
  }

  if (
    journey.useCase === "کار و جلسات" &&
    (category === "optical" ||
      hasAny(shapes, ["rectangular", "square", "round"]))
  ) {
    score += 7;
    primary = primary === "complementary" ? "occasion_appropriate" : primary;
    reasons.push("فرم ثبت‌شدهٔ فریم برای ظاهر مرتب و کاری مناسب‌تر است");
  }

  if (journey.useCase === "رانندگی و فضای باز" && category === "sunglasses") {
    score += 8;
    primary = primary === "complementary" ? "occasion_appropriate" : primary;
    reasons.push("این محصول در دستهٔ آفتابی قرار دارد و برای فضای باز انتخاب شده است");
  }

  if (
    journey.useCase === "مناسبت و استایل" &&
    hasAny(shapes, ["butterfly", "square", "aviator"])
  ) {
    score += 8;
    primary = primary === "complementary" ? "occasion_appropriate" : primary;
    reasons.push("فرم ثبت‌شدهٔ فریم برای استایل شاخص‌تر مناسب است");
  }

  if (
    journey.style === "مینیمال و ظریف" &&
    (hasAny(shapes, ["round", "rectangular"]) || frameType.includes("full"))
  ) {
    score += 6;
    secondary.push("brand_preference");
    reasons.push("فرم و ساختار ثبت‌شدهٔ فریم با انتخاب مینیمال نزدیک است");
  }

  if (
    journey.style === "کلاسیک و ماندگار" &&
    hasAny(shapes, ["aviator", "round", "wayfarer"])
  ) {
    score += 9;
    primary = primary === "complementary" ? "style_match" : primary;
    reasons.push("فرم ثبت‌شدهٔ فریم در خانوادهٔ کلاسیک قرار می‌گیرد");
  }

  if (
    journey.style === "مدرن و شاخص" &&
    hasAny(shapes, ["square", "butterfly", "rectangular"])
  ) {
    score += 8;
    primary = primary === "complementary" ? "style_match" : primary;
    reasons.push("فرم ثبت‌شدهٔ فریم جهت‌گیری مدرن و شاخص دارد");
  }

  if (
    journey.style === "جسور و متفاوت" &&
    hasAny(shapes, ["butterfly", "square", "aviator"])
  ) {
    score += 7;
    primary = primary === "complementary" ? "style_match" : primary;
    reasons.push("فرم ثبت‌شدهٔ فریم شخصیت بصری مشخصی دارد");
  }

  if (product.attributes.tags.includes("unisex")) {
    score += 2;
  }

  if (sourceStyle.includes("understated") && journey.style === "کلاسیک و ماندگار") {
    score += 3;
    secondary.push("brand_preference");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    primary,
    secondary: [...new Set(secondary)],
    explanation:
      reasons.slice(0, 3).join(" · ") ||
      "بر اساس ویژگی‌های ثبت‌شدهٔ محصول با الگوی انتخاب فعلی شما همخوانی دارد.",
  };
}

export class RecommendationEngine {
  generate(
    shopperId: ShopperProfileId,
    context: RecommendationContext,
    candidates: readonly RecommendationCandidate[],
  ): readonly Recommendation[] {
    const ranked = candidates
      .map((candidate) => ({
        candidate,
        result: scoreCandidate(candidate.product, context),
      }))
      .sort(
        (a, b) =>
          b.result.score - a.result.score ||
          a.candidate.product.merchandising.displayPriority -
            b.candidate.product.merchandising.displayPriority,
      )
      .slice(0, 3);

    const now = new Date();

    return ranked.map(({ candidate, result }, index) => ({
      identity: {
        id: `demo-recommendation-${index + 1}-${candidate.variant.identity.id}`,
      },
      shopperId,
      variantId: candidate.variant.identity,
      score: {
        overall: result.score,
        styleMatch: null,
        budgetMatch: null,
        occasionMatch: null,
        popularityScore: null,
      },
      reason: {
        primaryReason: result.primary,
        secondaryReasons: result.secondary,
        explanation: result.explanation,
      },
      context,
      createdAt: now,
      expiresAt: null,
    }));
  }
}
