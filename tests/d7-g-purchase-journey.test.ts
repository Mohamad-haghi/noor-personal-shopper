import { describe, expect, it } from "vitest";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { DemoCommerceProvider } from "../src/providers/demo/demo-commerce-provider";
import { DemoCartProvider } from "../src/providers/demo/demo-cart-provider";
import { DemoCheckoutProvider } from "../src/providers/demo/demo-checkout-provider";
import { DemoPaymentProvider } from "../src/providers/demo/demo-payment-provider";
import { DemoOrderProvider } from "../src/providers/demo/demo-order-provider";
import { DemoConfirmationProvider } from "../src/providers/demo/demo-confirmation-provider";
import { CartService } from "../src/services/cart-service";
import { CheckoutService } from "../src/services/checkout-service";
import { PaymentService } from "../src/services/payment-service";
import { OrderService } from "../src/services/order-service";
import { ConfirmationService } from "../src/services/confirmation-service";

describe("D7-G purchase journey", () => {
  it("completes recommendation-to-confirmation flow and preserves demo pricing boundaries", async () => {
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog);
    const cart = new CartService(new DemoCartProvider());
    const products = await catalog.listProducts();
    const variants = await catalog.listVariants(products[0].identity);
    const offer = await commerce.getOffer(variants[0].identity);
    expect(offer?.pricing.source).toBe("demo");

    const storedCart = await cart.addCommerceOffer({ id: "d7-g-cart" }, offer!);
    const checkout = new CheckoutService(new DemoCheckoutProvider(
      new DemoCartProvider(),
    ));
    const cartProvider = new DemoCartProvider();
    await cartProvider.addItem({ id: "d7-g-cart" }, storedCart.items[0]);

    const order = await new CheckoutService(new DemoCheckoutProvider(cartProvider)).createOrderFromCart({
      cartId: { id: "d7-g-cart" },
      accountId: { id: "d7-g-account" },
      shopper: { recipientName: "کاربر Demo", phone: "09120000000" },
      fulfillment: {
        method: "delivery",
        address: {
          recipientName: "کاربر Demo",
          addressLine1: "خیابان نمونه",
          addressLine2: null,
          city: "تهران",
          state: "تهران",
          postalCode: "1234567890",
          country: "IR",
          phone: "09120000000",
        },
      },
    });

    expect(order.status).toBe("draft");
    expect(order.pricing.total).toBe(storedCart.subtotal + 350_000);

    const payments = new PaymentService(new DemoPaymentProvider());
    const orders = new OrderService(new DemoOrderProvider());
    const confirmations = new ConfirmationService(new DemoConfirmationProvider());

    const payment = await payments.createPayment({
      identity: { id: "d7-g-payment" },
      orderId: order.identity,
      amount: order.pricing.total,
      currency: order.pricing.currency,
      method: "digital_wallet",
      status: "pending",
      transaction: {
        providerTransactionId: "demo-pending",
        authorizationCode: null,
        capturedAt: null,
        failureReason: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(payment.status).toBe("captured");

    const confirmed = await orders.createOrder({ ...order, status: "confirmed", updatedAt: new Date() });
    const confirmation = await confirmations.createConfirmation({
      identity: { id: "d7-g-confirmation" },
      orderId: confirmed.identity,
      requestIdentity: {
        requestToken: "d7-g-request",
        ipAddress: null,
        userAgent: null,
        fingerprint: null,
      },
      status: "confirmed",
      sentAt: new Date(),
      confirmedAt: new Date(),
    });

    expect((await orders.getOrder(confirmed.identity))?.status).toBe("confirmed");
    expect((await confirmations.getConfirmationForOrder(confirmed.identity))?.requestIdentity.requestToken).toBe("d7-g-request");
    expect(confirmation.orderId.id).toBe(confirmed.identity.id);
    expect(confirmed.pricing.currency).toBe("IRR");
  });

  it("keeps failed payment out of confirmed-order state and recovers on retry", async () => {
    const orders = new OrderService(new DemoOrderProvider());
    const payments = new PaymentService(new DemoPaymentProvider());
    const confirmations = new ConfirmationService(new DemoConfirmationProvider());
    const order = {
      identity: { id: "d7-g-recovery-order" },
      accountId: { id: "d7-g-account" },
      cartId: { id: "d7-g-cart" },
      status: "draft" as const,
      items: [{ id: "item-1", variantId: "variant-1", quantity: 1, unitPrice: 7_000_000, currency: "IRR" }],
      pricing: { subtotal: 7_000_000, discount: 0, tax: 0, shipping: 350_000, total: 7_350_000, currency: "IRR" },
      shipping: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const failed = await payments.createPayment({
      identity: { id: "d7-g-recovery-payment" },
      orderId: order.identity,
      amount: order.pricing.total,
      currency: order.pricing.currency,
      method: "digital_wallet",
      status: "pending",
      transaction: {
        providerTransactionId: "demo-pending",
        authorizationCode: null,
        capturedAt: null,
        failureReason: "demo_failure",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(failed.status).toBe("failed");
    expect(await orders.getOrder(order.identity)).toBeNull();
    expect(await confirmations.getConfirmationForOrder(order.identity)).toBeNull();

    const recovered = await payments.createPayment({
      ...failed,
      identity: { id: "d7-g-recovery-payment-retry" },
      status: "pending",
      transaction: {
        ...failed.transaction!,
        failureReason: null,
      },
      updatedAt: new Date(),
    });

    expect(recovered.status).toBe("captured");
    const confirmed = await orders.createOrder({ ...order, status: "confirmed", updatedAt: new Date() });
    await confirmations.createConfirmation({
      identity: { id: "d7-g-recovery-confirmation" },
      orderId: confirmed.identity,
      requestIdentity: {
        requestToken: "d7-g-recovery-request",
        ipAddress: null,
        userAgent: null,
        fingerprint: null,
      },
      status: "confirmed",
      sentAt: new Date(),
      confirmedAt: new Date(),
    });

    expect((await orders.getOrder(order.identity))?.status).toBe("confirmed");
    expect(await confirmations.getConfirmationForOrder(order.identity)).not.toBeNull();
  });
});
