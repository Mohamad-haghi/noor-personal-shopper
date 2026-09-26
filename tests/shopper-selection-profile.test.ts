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
