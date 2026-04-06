import Chargebee from "chargebee";
import type { PaymentGateway, CreateCheckoutParams, CheckoutResult } from "./types";

function getClient() {
  return new Chargebee({
    apiKey: process.env.CHARGEBEE_API_KEY!,
    site: process.env.CHARGEBEE_SITE!,
  });
}

export const chargebeeGateway: PaymentGateway = {
  async createCheckout({ orderId, items, customer, currency, successUrl, cancelUrl }: CreateCheckoutParams): Promise<CheckoutResult> {
    const cb = getClient();

    const charges = items.map(({ product, quantity }) => ({
      amount: Math.round(parseFloat(product.price) * 100) * quantity,
      description: quantity > 1 ? `${product.name} × ${quantity}` : product.name,
    }));

    const response = await cb.hostedPage.checkoutOneTimeForItems({
      customer: { email: customer.email, first_name: customer.name },
      currency_code: currency,
      redirect_url: successUrl,
      cancel_url: cancelUrl,
      pass_thru_content: JSON.stringify({ orderId }),
      charges,
    });

    const page = response.hosted_page;

    return {
      checkoutUrl: page.url ?? "",
      sessionId: page.id ?? "",
    };
  },
};
