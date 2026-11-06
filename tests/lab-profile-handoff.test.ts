import { describe, expect, it } from "vitest";
import { resolveRoute } from "../src/app/routing/routes";
import { ShopperFeature } from "../src/features/shopper/shopper-feature";
import { DemoSelectionProfileProvider } from "../src/providers/demo/demo-selection-profile-provider";
import { SelectionProfileService } from "../src/services/selection-profile-service";
import { renderSelectionProfile } from "../src/ui/render-selection-profile";
import { renderHowItWorks } from "../src/ui/render-how-it-works";

describe("Lab presentation boundary and NOOR handoff", () => {
  it("resolves Lab-style aliases and the new profile page inside the NOOR router", () => {
    expect(resolveRoute("/catalog")?.route.path).toBe("/catalog");
    expect(resolveRoute("/product/example-sku")?.params.id).toBe("example-sku");
    expect(resolveRoute("/profile")?.route.path).toBe("/profile");
    expect(resolveRoute("/how-it-works")?.route.path).toBe("/how-it-works");
    expect(resolveRoute("/recommendations")?.route.path).toBe("/recommendations");
  });

  it("renders the profile summary from NOOR ShopperFeature and hands off to NOOR recommendations", async () => {
    const service = new SelectionProfileService(new DemoSelectionProfileProvider());
    const feature = new ShopperFeature(service, null);
    await feature.setAnswer("productType", "عینک آفتابی");
    await feature.setAnswer("useCase", "رانندگی و فضای باز");
    await feature.setAnswer("style", "خلبانی");
    await feature.setAnswer("faceShape", "بیضی");
    await feature.setAnswer("frameMaterial", "فلزی");
    await feature.setAnswer("frameColor", "مشکی");
    await feature.setAnswer("gender", "یونیسکس");
    await feature.setCriterionMandatory("frameMaterial", true);

    const routeView = { innerHTML: "" } as HTMLElement;
    renderSelectionProfile(routeView, feature);

    expect(routeView.innerHTML).toContain("پروفایل انتخاب شما");
    expect(routeView.innerHTML).toContain("رانندگی و فضای باز");
    expect(routeView.innerHTML).toContain("خلبانی");
    expect(routeView.innerHTML).toContain("جنس فریم");
    expect(routeView.innerHTML).toContain('href="/recommendations" data-app-link');
    expect(routeView.innerHTML).toContain("موتور تصمیم COR");
    expect(routeView.innerHTML).not.toContain("recommend(");
  });

  it("provides a truthful how-it-works explanation without importing Lab's local ranking", () => {
    const routeView = { innerHTML: "" } as HTMLElement;
    renderHowItWorks(routeView);
    expect(routeView.innerHTML).toContain("پروفایل انتخاب");
    expect(routeView.innerHTML).toContain("مسیر تصمیم‌گیری COR");
    expect(routeView.innerHTML).not.toContain("recommend(");
  });

  it("can reopen a specific NOOR questionnaire step for profile editing", async () => {
    const service = new SelectionProfileService(new DemoSelectionProfileProvider());
    const feature = new ShopperFeature(service, null);
    await feature.setAnswer("productType", "عینک طبی");
    feature.goToStep(5);
    expect(feature.getCurrentStep().id).toBe("frame-material");
    feature.goToStep(7);
    expect(feature.getCurrentStep().id).toBe("gender");
  });
});
