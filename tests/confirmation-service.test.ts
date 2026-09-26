import { describe, expect, it } from "vitest";
import { DemoConfirmationProvider } from "../src/providers/demo/demo-confirmation-provider";
import { ConfirmationService } from "../src/services/confirmation-service";
import type { Confirmation } from "../src/domain";

function makeConfirmation(id: string, orderId: string): Confirmation {
  const now = new Date();
  return {
    identity: { id }, orderId: { id: orderId },
    requestIdentity: { requestToken: `demo-request-${orderId}`, ipAddress: null, userAgent: null, fingerprint: null },
    status: "confirmed", sentAt: now, confirmedAt: now,
  };
}

describe("D7-F DemoConfirmationProvider", () => {
  it("persists and retrieves a confirmation by id", async () => {
    const service = new ConfirmationService(new DemoConfirmationProvider());
    const confirmation = makeConfirmation("demo-confirmation-1", "demo-order-1");
    await service.createConfirmation(confirmation);
    const retrieved = await service.getConfirmation(confirmation.identity);
    expect(retrieved?.identity.id).toBe("demo-confirmation-1");
    expect(retrieved?.status).toBe("confirmed");
    expect(retrieved?.requestIdentity.requestToken).toBe("demo-request-demo-order-1");
  });

  it("retrieves the confirmation for its order", async () => {
    const service = new ConfirmationService(new DemoConfirmationProvider());
    const confirmation = makeConfirmation("demo-confirmation-1", "demo-order-1");
    await service.createConfirmation(confirmation);
    const retrieved = await service.getConfirmationForOrder({ id: "demo-order-1" });
    expect(retrieved?.orderId.id).toBe("demo-order-1");
  });

  it("does not return a confirmation for an unrelated order", async () => {
    const service = new ConfirmationService(new DemoConfirmationProvider());
    await service.createConfirmation(makeConfirmation("demo-confirmation-1", "demo-order-1"));
    expect(await service.getConfirmationForOrder({ id: "demo-order-2" })).toBeNull();
  });
});
