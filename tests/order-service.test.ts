import { describe, expect, it } from "vitest";
import { DemoOrderProvider } from "../src/providers/demo/demo-order-provider";
import { OrderService } from "../src/services/order-service";
import type { Order } from "../src/domain";

function makeOrder(id: string, accountId: string, status: Order["status"] = "confirmed"): Order {
  const now = new Date();
  return {
    identity: { id },
    accountId: { id: accountId },
    cartId: { id: "demo-cart" },
    status,
    items: [{ id: "demo-item-1", variantId: "demo-variant-1", quantity: 1, unitPrice: 7_000_000, currency: "IRR" }],
    pricing: { subtotal: 7_000_000, discount: 0, tax: 0, shipping: 0, total: 7_000_000, currency: "IRR" },
    shipping: null,
    createdAt: now,
    updatedAt: now,
  };
}

describe("D7-E DemoOrderProvider", () => {
  it("persists and retrieves a created order within demo runtime state", async () => {
    const service = new OrderService(new DemoOrderProvider());
    const order = makeOrder("demo-order-1", "demo-account-1");
    await service.createOrder(order);
    const retrieved = await service.getOrder(order.identity);
    expect(retrieved?.identity.id).toBe(order.identity.id);
    expect(retrieved?.status).toBe("confirmed");
    expect(retrieved?.pricing.total).toBe(order.pricing.total);
    expect(retrieved?.updatedAt).toBeInstanceOf(Date);
  });

  it("lists only orders belonging to the requested account", async () => {
    const service = new OrderService(new DemoOrderProvider());
    await service.createOrder(makeOrder("demo-order-1", "demo-account-1"));
    await service.createOrder(makeOrder("demo-order-2", "demo-account-2"));
    const orders = await service.listOrders({ id: "demo-account-1" });
    expect(orders).toHaveLength(1);
    expect(orders[0].identity.id).toBe("demo-order-1");
  });

  it("replaces the same order identity through the existing create boundary", async () => {
    const service = new OrderService(new DemoOrderProvider());
    await service.createOrder(makeOrder("demo-order-1", "demo-account-1", "draft"));
    await service.createOrder(makeOrder("demo-order-1", "demo-account-1", "confirmed"));
    const retrieved = await service.getOrder({ id: "demo-order-1" });
    expect(retrieved?.status).toBe("confirmed");
  });
});
