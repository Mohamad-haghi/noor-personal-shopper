import { describe, expect, it } from "vitest";
import { formatRecommendationScore, formatRecommendationScoreLabel } from "../src/ui/render-recommendations";

describe("COR recommendation score display", () => {
  it("formats normalized COR scores as rounded percentages", () => {
    expect(formatRecommendationScore(1)).toBe("100");
    expect(formatRecommendationScore(0.625)).toBe("63");
    expect(formatRecommendationScore(0)).toBe("0");
  });

  it("clamps out-of-range scores and handles non-finite values", () => {
    expect(formatRecommendationScore(-0.5)).toBe("0");
    expect(formatRecommendationScore(1.5)).toBe("100");
    expect(formatRecommendationScore(Number.NaN)).toBe("—");
  });

  it("labels the value as a match score rather than a probability", () => {
    expect(formatRecommendationScoreLabel(0.625)).toBe("امتیاز تطابق 63%");
  });
});
