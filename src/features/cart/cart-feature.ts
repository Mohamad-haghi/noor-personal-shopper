import type { CartId } from "../../domain";

export interface CartState {
  readonly cartId: CartId | null;
  readonly itemCount: number;
  readonly isLoading: boolean;
}

export class CartFeature {
  getState(): CartState {
    return {
      cartId: null,
      itemCount: 0,
      isLoading: false,
    };
  }
}
