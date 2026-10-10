import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getCompositionModeError } from "../src/app/composition/composition-mode";

describe("application composition mode", () => {
  it("allows the explicitly selected demo mode", () => {
    expect(getCompositionModeError("demo")).toBeNull();
  });

  it("fails closed for integrated mode until real providers are configured", () => {
    expect(getCompositionModeError("integrated")).toContain(
      "real providers are configured",
    );
  });


  it("checks integrated-mode rejection before constructing any demo provider", () => {
    const bootstrap = readFileSync(
      new URL("../src/app/bootstrap.ts", import.meta.url),
      "utf8",
    );
    const modeCheck = bootstrap.indexOf("getCompositionModeError(config.mode)");
    const rejectionBranch = bootstrap.indexOf("if (compositionModeError)");
    const firstDemoConstruction = bootstrap.indexOf("new DemoFoundationProvider()");

    expect(modeCheck).toBeGreaterThanOrEqual(0);
    expect(rejectionBranch).toBeGreaterThan(modeCheck);
    expect(firstDemoConstruction).toBeGreaterThan(rejectionBranch);
    expect(bootstrap.slice(rejectionBranch, firstDemoConstruction)).toContain("return;");
  });
});
