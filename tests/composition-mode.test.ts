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
});
