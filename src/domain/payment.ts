import type { OrderId } from "./order";

export interface PaymentId {
  readonly id: string;
}

export interface Payment {
  readonly identity: PaymentId;
  readonly orderId: OrderId;
  readonly amount: number;
  readonly currency: string;
  readonly method: PaymentMethod;
  readonly status: PaymentStatus;
  readonly transaction: PaymentTransaction | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type PaymentMethod = 
  | "credit_card"
  | "debit_card"
  | "bank_transfer"
  | "cash_on_delivery"
  | "digital_wallet"
  | "installment";

export type PaymentStatus = 
  | "pending"
  | "processing"
  | "authorized"
  | "captured"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partial_refund";

export interface PaymentTransaction {
  readonly providerTransactionId: string;
  readonly authorizationCode: string | null;
  readonly capturedAt: Date | null;
  readonly failureReason: string | null;
}
