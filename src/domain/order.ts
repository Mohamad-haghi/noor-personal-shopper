import type { CartId } from "./cart";
import type { AccountId } from "./account";

export interface OrderId {
  readonly id: string;
}

export interface Order {
  readonly identity: OrderId;
  readonly accountId: AccountId;
  readonly cartId: CartId | null;
  readonly status: OrderStatus;
  readonly items: readonly OrderItem[];
  readonly pricing: OrderPricing;
  readonly shipping: OrderShipping | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type OrderStatus = 
  | "draft"
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  readonly id: string;
  readonly variantId: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly currency: string;
}

export interface OrderPricing {
  readonly subtotal: number;
  readonly discount: number;
  readonly tax: number;
  readonly shipping: number;
  readonly total: number;
  readonly currency: string;
}

export interface OrderShipping {
  readonly method: "delivery" | "pickup";
  readonly address: ShippingAddress | null;
  readonly branchId: string | null;
  readonly estimatedDelivery: Date | null;
  readonly trackingNumber: string | null;
}

export interface ShippingAddress {
  readonly recipientName: string;
  readonly addressLine1: string;
  readonly addressLine2: string | null;
  readonly city: string;
  readonly state: string | null;
  readonly postalCode: string;
  readonly country: string;
  readonly phone: string | null;
}
