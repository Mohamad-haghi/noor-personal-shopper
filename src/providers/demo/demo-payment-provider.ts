import type { PaymentProvider } from "../interfaces/payment-provider";
import type { Payment, PaymentId, OrderId } from "../../domain";

export class DemoPaymentProvider implements PaymentProvider {
  async getPayment(_id: PaymentId): Promise<Payment | null> { return null; }

  async createPayment(payment: Payment): Promise<Payment> { return payment; }

  async listPayments(_orderId: OrderId): Promise<readonly Payment[]> { return []; }
}
