import { describe, expect, it } from "vitest";
import { DemoSelectionProfileProvider } from "../src/providers/demo/demo-selection-profile-provider";
import { SelectionProfileService } from "../src/services/selection-profile-service";
import { ShopperFeature } from "../src/features/shopper/shopper-feature";

describe("ShopperFeature structured SelectionProfile", () => {
  it("persists questionnaire answers as SelectionProfile criteria", async () => {
    const service = new SelectionProfileService(new DemoSelectionProfileProvider());
    const feature = new ShopperFeature(service, null);

    await feature.setAnswer("productType", "عینک طبی");
    await feature.setAnswer("useCase", "کار و جلسات");
    await feature.setAnswer("style", "کلاسیک و ماندگار");
    await feature.setAnswer("faceShape", "مربع");

    const profile = await service.getProfile({ id: "demo-selection-profile" });

    expect(profile?.criteria).toEqual({
      productType: "عینک طبی",
      useCase: "کار و جلسات",
      style: "کلاسیک و ماندگار",
      faceShape: "مربع",
    });
    expect(feature.getFlowState().selections?.identity.id).toBe("demo-selection-profile");
  });

  it("offers only frame shapes and materials represented by the selected catalog category", async () => {
    const service = new SelectionProfileService(new DemoSelectionProfileProvider());
    const feature = new ShopperFeature(service, null);
    await feature.setAnswer("productType", "عینک آفتابی");
    const sunglassesSteps = feature.getSteps();
    expect(sunglassesSteps.find((step) => step.id === "style")?.options).toEqual([
      "خلبانی", "مستطیلی", "مربعی", "پروانه‌ای",
    ]);
    expect(sunglassesSteps.find((step) => step.id === "frame-material")?.options).not.toContain("تیتانیوم");
    expect(sunglassesSteps.find((step) => step.id === "face-shape")?.options).toContain("مثلثی");
    expect(sunglassesSteps.find((step) => step.id === "use-case")?.options).toEqual(["استفاده روزمره", "کار و جلسات", "رانندگی و فضای باز"]);

    await feature.setAnswer("productType", "عینک طبی");
    const opticalSteps = feature.getSteps();
    expect(opticalSteps.find((step) => step.id === "style")?.options).toEqual([
      "مستطیلی", "مربعی", "ویفِرر",
    ]);
    expect(opticalSteps.find((step) => step.id === "frame-material")?.options).toContain("تیتانیوم");
    expect(opticalSteps.find((step) => step.id === "frame-material")?.options).not.toContain("نایلونی");
    expect(opticalSteps.find((step) => step.id === "face-shape")?.options).not.toContain("مثلثی");
    expect(opticalSteps.find((step) => step.id === "frame-color")?.options).not.toContain("هاوانا قهوه‌ای");
  });

  it("restores structured criteria from an existing SelectionProfile", async () => {
    const service = new SelectionProfileService(new DemoSelectionProfileProvider());
    const first = new ShopperFeature(service, null);
    await first.setAnswer("productType", "عینک آفتابی");
    await first.setAnswer("faceShape", "بیضی");

    const saved = await service.getProfile({ id: "demo-selection-profile" });
    const restored = new ShopperFeature(service, saved);

    expect(restored.getFlowState().journey.productType).toBe("عینک آفتابی");
    expect(restored.getFlowState().journey.faceShape).toBe("بیضی");
  });
});
