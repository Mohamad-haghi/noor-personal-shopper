import { describe, expect, it } from "vitest";
import { formatRecommendationScore, recommendationCountLabel, recommendationHeadline } from "../src/ui/render-recommendations";

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

describe("recommendation count presentation", () => {
  it("uses the actual number of displayed recommendations in the headline", () => {
    expect(recommendationHeadline(1)).toBe("یک پیشنهاد برای شروع");
    expect(recommendationHeadline(2)).toBe("دو پیشنهاد برای شروع");
    expect(recommendationHeadline(3)).toBe("سه پیشنهاد برای شروع");
  });

  it("uses singular and plural comparison labels truthfully", () => {
    expect(recommendationCountLabel(1)).toBe("یک پیشنهاد");
    expect(recommendationCountLabel(2)).toBe("دو پیشنهاد");
    expect(recommendationCountLabel(3)).toBe("سه پیشنهاد");
  });

  it("handles invalid counts safely", () => {
    expect(recommendationHeadline(Number.NaN)).toBe("0 پیشنهاد برای شروع");
    expect(recommendationCountLabel(-2)).toBe("0 پیشنهاد");
  });
});
