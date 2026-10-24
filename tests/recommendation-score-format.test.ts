import { describe, expect, it } from "vitest";
import { formatRecommendationScore } from "../src/ui/render-recommendations";

describe("recommendation score presentation", () => {
  it("converts normalized COR scores to whole percentages", () => {
    expect(formatRecommendationScore(1)).toBe("100");
    expect(formatRecommendationScore(0.92)).toBe("92");
    expect(formatRecommendationScore(0.5)).toBe("50");
    expect(formatRecommendationScore(0)).toBe("0");
  });

  it("rounds fractional percentages and bounds malformed values", () => {
    expect(formatRecommendationScore(0.005)).toBe("1");
    expect(formatRecommendationScore(-0.2)).toBe("0");
    expect(formatRecommendationScore(1.4)).toBe("100");
    expect(formatRecommendationScore(Number.NaN)).toBe("—");
  });
});
