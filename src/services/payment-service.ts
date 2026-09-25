import type { PaymentProvider } from "../providers/interfaces/payment-provider";
import type { Payment, PaymentId, OrderId } from "../domain";

export class PaymentService {
  constructor(private readonly provider: PaymentProvider) {}

  getPayment(id: PaymentId): Promise<Payment | null> {
    return this.provider.getPayment(id);
  }

  createPayment(payment: Payment): Promise<Payment> {
    return this.provider.createPayment(payment);
  }

  listPayments(orderId: OrderId): Promise<readonly Payment[]> {
    return this.provider.listPayments(orderId);
  }
}
