import type { Cart, Order, Payment, Visit } from "../../domain";

export interface CommerceState {
  readonly cart: Cart | null;
  readonly pendingOrder: Order | null;
  readonly payment: Payment | null;
  readonly visit: Visit | null;
}
