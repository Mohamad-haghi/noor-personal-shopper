export type ShopperLaunchSource = "noor-website" | "direct" | "other";

export interface ShopperHandoffContext {
  readonly source: ShopperLaunchSource;
  readonly returnUrl?: string;
  readonly campaign?: string;
  readonly productId?: string;
  readonly branchId?: string;
}

export interface ShopperHandoffCodec {
  encode(context: ShopperHandoffContext): string;
  decode(value: string): ShopperHandoffContext | null;
}

export interface NoorIntegrationContext {
  readonly websiteBaseUrl?: string;
  readonly catalogEndpoint?: string;
  readonly accountEndpoint?: string;
  readonly branchEndpoint?: string;
  readonly reservationEndpoint?: string;
  readonly paymentEndpoint?: string;
  readonly heroContentEndpoint?: string;
}
