import { describe, expect, it } from "vitest";
import { mandatoryCriteriaLabels, renderMandatoryCriteriaNoMatch } from "../src/ui/render-recommendations";

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

  it("renders a truthful Persian no-match state without suggesting a substitute", () => {
    const routeView = { innerHTML: "" } as HTMLElement;
    renderMandatoryCriteriaNoMatch(routeView, ["frameMaterial"]);

    expect(routeView.innerHTML).toContain("محصول منطبق با شرط‌های اجباری پیدا نشد");
    expect(routeView.innerHTML).toContain("موتور تصمیم‌گیری COR هیچ محصول معتبری پیدا نکرد");
    expect(routeView.innerHTML).toContain("جنس فریم");
    expect(routeView.innerHTML).toContain("محصول ناسازگار نمایش داده نمی‌شود");
    expect(routeView.innerHTML).toContain('href="/shopper"');
    expect(routeView.innerHTML).not.toContain("پیشنهاد جایگزین");
  });
