import { describe, expect, it } from "vitest";
import { mandatoryCriteriaLabels } from "../src/ui/render-recommendations";

describe("mandatory criteria no-match messaging", () => {
  it("uses shopper-friendly Persian labels for mandatory criteria", () => {
    expect(mandatoryCriteriaLabels(["frameShape", "frameMaterial"])).toEqual([
      "فرم فریم",
      "جنس فریم",
    ]);
  });

  it("deduplicates criteria and keeps unknown values visible", () => {
    expect(mandatoryCriteriaLabels(["frameColor", "frameColor", "customCriterion"])).toEqual([
      "رنگ فریم",
      "customCriterion",
    ]);
  });
});
