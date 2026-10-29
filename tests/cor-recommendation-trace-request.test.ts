import { describe, expect, it } from "vitest";
import {
  createCorRecommendationRequestId,
  isCorTraceRequested,
} from "../src/integration/digital-sales-core/recommendation-bridge";

describe("opt-in COR recommendation trace request IDs", () => {
  it("marks an explicitly tagged URL as a test request", () => {
    expect(isCorTraceRequested("?corTrace=1")).toBe(true);
    expect(createCorRecommendationRequestId("?corTrace=1", 123, () => 0.5))
      .toMatch(/^noor-test-123-/);
  });

  it("preserves the marker captured by the entry point after the URL query is lost", () => {
    // main.ts runs after static imports have evaluated. The bridge must read this
    // marker at request time rather than freezing it during module initialization.
    expect(isCorTraceRequested("", true, false)).toBe(true);
    expect(isCorTraceRequested("", false, true)).toBe(true);
    expect(createCorRecommendationRequestId("?route=results&corTrace=1", 456, () => 0.5))
      .toMatch(/^noor-test-456-/);
  });

  it("does not mark ordinary requests as controlled tests", () => {
    expect(isCorTraceRequested("?route=results")).toBe(false);
    expect(isCorTraceRequested("", false, false)).toBe(false);
    expect(createCorRecommendationRequestId("?route=results", 789, () => 0.5))
      .toMatch(/^noor-request-789-/);
  });
});
