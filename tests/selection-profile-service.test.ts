import { describe, expect, it } from "vitest";
import type { SelectionProfile } from "../src/domain";
import { DemoSelectionProfileProvider } from "../src/providers/demo/demo-selection-profile-provider";
import { SelectionProfileService } from "../src/services/selection-profile-service";

function createProfile(id: string, accountId: string | null = null): SelectionProfile {
  const now = new Date();
  return {
    identity: { id },
    accountId: accountId ? { id: accountId } : null,
    name: "Test Selection",
    description: null,
    criteria: {
      productType: "عینک طبی",
      useCase: "استفاده روزمره",
      style: "کلاسیک و ماندگار",
      faceShape: "مربع",
    },
    items: [],
    createdAt: now,
    updatedAt: now,
  };
}

describe("SelectionProfileService", () => {
  it("persists and retrieves a structured selection profile", async () => {
    const service = new SelectionProfileService(new DemoSelectionProfileProvider());
    const profile = createProfile("selection-test");

    await service.saveProfile(profile);

    expect(await service.getProfile(profile.identity)).toEqual(profile);
  });

  it("lists profiles by optional account ownership without mixing accounts", async () => {
    const service = new SelectionProfileService(new DemoSelectionProfileProvider());
    await service.saveProfile(createProfile("selection-a", "account-a"));
    await service.saveProfile(createProfile("selection-b", "account-b"));
    await service.saveProfile(createProfile("selection-anonymous"));

    const profiles = await service.listProfilesForAccount({ id: "account-a" });

    expect(profiles.map((profile) => profile.identity.id)).toEqual(["selection-a"]);
  });
});
