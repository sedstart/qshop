import type { PaymentGateway } from "./types";

export type { PaymentGateway, CreateCheckoutParams, CheckoutResult, CheckoutItem, CheckoutProduct } from "./types";

type GatewayName = "dodo" | "chargebee";

function getGatewayName(): GatewayName {
  const raw = process.env.PAYMENT_GATEWAY?.toLowerCase().trim();
  if (raw === "chargebee") return "chargebee";
  return "dodo"; // default
}

/**
 * Returns the active payment gateway based on the PAYMENT_GATEWAY env var.
 * Modules are imported lazily so only the active gateway's dependencies are
 * evaluated at runtime.
 */
export async function getPaymentGateway(): Promise<PaymentGateway> {
  const name = getGatewayName();
  if (name === "chargebee") {
    const { chargebeeGateway } = await import("./chargebee");
    return chargebeeGateway;
  }
  const { dodoGateway } = await import("./dodo");
  return dodoGateway;
}
