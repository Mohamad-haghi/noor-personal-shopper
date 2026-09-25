import type { Payment, PaymentId, OrderId } from "../../domain";

export interface PaymentProvider {
  getPayment(id: PaymentId): Promise<Payment | null>;
  createPayment(payment: Payment): Promise<Payment>;
  listPayments(orderId: OrderId): Promise<readonly Payment[]>;
}
