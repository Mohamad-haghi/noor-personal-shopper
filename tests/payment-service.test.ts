import { describe, expect, it } from "vitest";
import { DemoPaymentProvider } from "../src/providers/demo/demo-payment-provider";
import { PaymentService } from "../src/services/payment-service";

function payment(failureReason: string | null = null) {
  const now = new Date();
  return {
    identity: { id: "demo-payment-test" },
    orderId: { id: "demo-order-test" },
    amount: 9_000_000,
    currency: "IRR",
    method: "digital_wallet" as const,
    status: "pending" as const,
    transaction: {
      providerTransactionId: "pending",
      authorizationCode: null,
      capturedAt: null,
      failureReason,
    },
    createdAt: now,
    updatedAt: now,
  };
}

describe("D7-D DemoPaymentProvider", () => {
  it("captures a demo payment successfully", async () => {
    const service = new PaymentService(new DemoPaymentProvider());
    const result = await service.createPayment(payment());
    expect(result.status).toBe("captured");
    expect(result.transaction?.providerTransactionId).toMatch(/^demo-txn-/);
    expect(result.transaction?.authorizationCode).toMatch(/^DEMO-AUTH-/);
    expect(result.transaction?.failureReason).toBeNull();
  });

  it("supports deterministic failure and retry recovery", async () => {
    const service = new PaymentService(new DemoPaymentProvider());
    const failed = await service.createPayment(payment("demo_failure"));
    expect(failed.status).toBe("failed");
    expect(failed.transaction?.failureReason).toBeTruthy();

    const recovered = await service.createPayment(payment());
    expect(recovered.status).toBe("captured");
    expect(recovered.transaction?.failureReason).toBeNull();
  });

  it("keeps payments queryable by order", async () => {
    const service = new PaymentService(new DemoPaymentProvider());
    await service.createPayment(payment());
    const payments = await service.listPayments({ id: "demo-order-test" });
    expect(payments).toHaveLength(1);
  });
});
