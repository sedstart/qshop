import DodoPayments from "dodopayments";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { PaymentGateway, CheckoutProduct, CreateCheckoutParams, CheckoutResult } from "./types";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: process.env.NODE_ENV === "production" ? "live_mode" : "test_mode",
});

async function ensureDodoProduct(product: CheckoutProduct): Promise<string> {
  if (product.dodoProductId) return product.dodoProductId;

  const priceInCents = Math.round(parseFloat(product.price) * 100);

  const dodoProduct = await dodo.products.create({
    name: product.name,
    description: product.description ?? undefined,
    price: {
      currency: "USD",
      discount: 0,
      price: priceInCents,
      purchasing_power_parity: false,
      type: "one_time_price",
    },
    tax_category: "saas",
  });

  await db
    .update(products)
    .set({ dodoProductId: dodoProduct.product_id, updatedAt: new Date() })
    .where(eq(products.id, product.id));

  return dodoProduct.product_id;
}

export const dodoGateway: PaymentGateway = {
  async createCheckout({ orderId, items, customer, successUrl, cancelUrl }: CreateCheckoutParams): Promise<CheckoutResult> {
    const productCart: { product_id: string; quantity: number }[] = [];

    for (const { product, quantity } of items) {
      const dodoProductId = await ensureDodoProduct(product);
      productCart.push({ product_id: dodoProductId, quantity });
    }

    const session = await dodo.checkoutSessions.create({
      product_cart: productCart,
      customer: { email: customer.email, name: customer.name },
      return_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { orderId },
    });

    return {
      checkoutUrl: session.checkout_url ?? "",
      sessionId: session.session_id,
    };
  },
};
