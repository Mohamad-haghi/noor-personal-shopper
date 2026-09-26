import { describe, expect, it } from "vitest";
import { DemoBranchProvider } from "../src/providers/demo/demo-branch-provider";
import { DemoVisitProvider } from "../src/providers/demo/demo-visit-provider";

describe("Demo branch and visit providers", () => {
  it("exposes demo branches through the existing provider boundary", async () => {
    const provider = new DemoBranchProvider();
    const branches = await provider.listBranches();

    expect(branches.length).toBeGreaterThanOrEqual(3);
    expect(branches.every((branch) => branch.status === "open")).toBe(true);
    expect(branches.every((branch) => branch.services.includes("pickup"))).toBe(true);
  });

  it("resolves a branch by identity", async () => {
    const provider = new DemoBranchProvider();
    const branches = await provider.listBranches();
    const branch = await provider.getBranch(branches[0].identity);

    expect(branch?.identity).toEqual(branches[0].identity);
  });

  it("persists and cancels visits in demo runtime state", async () => {
    const provider = new DemoVisitProvider();
    const visit = {
      identity: { id: "demo-visit-test" },
      branchId: { id: "demo-branch-mashhad-central" },
      accountId: { id: "demo-account-test" },
      scheduledAt: new Date(Date.now() + 86_400_000),
      duration: { estimatedMinutes: 45, actualMinutes: null },
      purpose: "consultation" as const,
      status: "requested" as const,
      notes: null,
      createdAt: new Date(),
    };

    await provider.requestVisit(visit);

    expect(await provider.getVisit(visit.identity)).toEqual(visit);

    const cancelled = await provider.cancelVisit(visit.identity);
    expect(cancelled?.status).toBe("cancelled");
    expect((await provider.getVisit(visit.identity))?.status).toBe("cancelled");
  });
});
