import { describe, expect, it } from "vitest";
import { createCorRecommendationRequestId } from "../src/integration/digital-sales-core/recommendation-bridge";

describe("COR recommendation test marker", () => {
  it("labels only explicitly requested controlled test runs", () => {
    expect(createCorRecommendationRequestId("", 1234, () => 0.5)).toBe("noor-request-1234-i");
    expect(createCorRecommendationRequestId("?corTrace=1", 1234, () => 0.5)).toBe("noor-test-1234-i");
    expect(createCorRecommendationRequestId("?corTrace=0", 1234, () => 0.5)).toBe("noor-request-1234-i");
  });
});
