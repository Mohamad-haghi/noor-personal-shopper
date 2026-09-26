import type { CheckoutProvider } from "../interfaces/checkout-provider";
import type { CartProvider } from "../interfaces/cart-provider";
import type {
  CheckoutRequest,
  DemoCheckoutPricingPolicy,
  Order,
} from "../../domain";
import { DEFAULT_DEMO_CHECKOUT_PRICING_POLICY } from "../../domain/checkout";

export class DemoCheckoutProvider implements CheckoutProvider {
  constructor(
    private readonly cartProvider: CartProvider,
    private readonly pricingPolicy: DemoCheckoutPricingPolicy = DEFAULT_DEMO_CHECKOUT_PRICING_POLICY,
  ) {}

  async validate(request: CheckoutRequest): Promise<readonly string[]> {
    const errors: string[] = [];
    const cart = await this.cartProvider.getCart(request.cartId);

    if (!cart || cart.items.length === 0) errors.push("سبد خرید خالی است.");
    if (!request.accountId.id) errors.push("حساب کاربری معتبر نیست.");
    if (!request.shopper.recipientName.trim()) errors.push("نام گیرنده الزامی است.");

    if (request.fulfillment.method === "delivery") {
      if (!request.fulfillment.address.addressLine1.trim()) errors.push("آدرس تحویل الزامی است.");
      if (!request.fulfillment.address.city.trim()) errors.push("شهر الزامی است.");
      if (!request.fulfillment.address.postalCode.trim()) errors.push("کد پستی الزامی است.");
    } else if (!request.fulfillment.branchId.trim()) {
      errors.push("انتخاب شعبه برای تحویل حضوری الزامی است.");
    }

    if (cart && cart.items.some((item) => item.currency !== cart.currency)) {
      errors.push("ارز اقلام سبد یکسان نیست.");
    }

    return errors;
  }

  async createOrderFromCart(request: CheckoutRequest): Promise<Order> {
    const errors = await this.validate(request);
    if (errors.length > 0) throw new Error(errors.join(" "));

    const cart = await this.cartProvider.getCart(request.cartId);
    if (!cart) throw new Error("سبد خرید پیدا نشد.");

    const discount = Math.max(0, this.pricingPolicy.discount);
    const tax = Math.max(0, Math.round(cart.subtotal * this.pricingPolicy.taxRate));
    const shipping = request.fulfillment.method === "delivery"
      ? Math.max(0, this.pricingPolicy.deliveryFee)
      : 0;
    const total = Math.max(0, cart.subtotal - discount + tax + shipping);
    const now = new Date();

    return {
      identity: {
        id: "demo-order-" + request.accountId.id + "-" + now.getTime(),
      },
      accountId: request.accountId,
      cartId: request.cartId,
      status: "draft",
      items: cart.items.map((item) => ({
        id: item.id,
        variantId: item.variantId.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
      })),
      pricing: {
        subtotal: cart.subtotal,
        discount,
        tax,
        shipping,
        total,
        currency: cart.currency,
      },
      shipping: request.fulfillment.method === "delivery"
        ? {
            method: "delivery",
            address: request.fulfillment.address,
            branchId: null,
            estimatedDelivery: null,
            trackingNumber: null,
          }
        : {
            method: "pickup",
            address: {
              recipientName: request.shopper.recipientName,
              addressLine1: "تحویل حضوری از شعبه منتخب",
              addressLine2: null,
              city: "تهران",
              state: null,
              postalCode: "0000000000",
              country: "IR",
              phone: request.shopper.phone,
            },
            branchId: request.fulfillment.branchId,
            estimatedDelivery: null,
            trackingNumber: null,
          },
      createdAt: now,
      updatedAt: now,
    };
  }
}
