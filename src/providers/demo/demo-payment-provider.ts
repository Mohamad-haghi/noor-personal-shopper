import type { Payment, PaymentId, OrderId } from "../../domain";

export class DemoPaymentProvider implements PaymentProvider {
  async getPayment(id: PaymentId): Promise<Payment | null> { return null; }

  async createPayment(payment: Payment): Promise<Payment> { return payment; }

  async listPayments(orderId: OrderId): Promise<readonly Payment[]> { return []; }
}
