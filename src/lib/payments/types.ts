export type CheckoutProduct = {
  /** Internal DB product id */
  id: string;
  name: string;
  description: string | null;
  /** Decimal string, e.g. "29.99" */
  price: string;
  currency: string;
  dodoProductId: string | null;
  chargebeeItemPriceId: string | null;
};

export type CheckoutItem = {
  product: CheckoutProduct;
  quantity: number;
};

export type CreateCheckoutParams = {
  orderId: string;
  items: CheckoutItem[];
  customer: { email: string; name: string };
  currency: string;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutResult = {
  /** URL to redirect the buyer to */
  checkoutUrl: string;
  /** Gateway-specific session / payment id to store on the order */
  sessionId: string;
};

export interface PaymentGateway {
  /**
   * Create a hosted checkout session and return the redirect URL.
   * Implementations must persist any gateway-side product/price IDs they
   * create back to the products table so future calls are cheap.
   */
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult>;
}
