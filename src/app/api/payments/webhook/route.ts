import { db } from "@/db";
import { orders } from "@/db/schema";
import { ok, badRequest, serverError } from "@/lib/api-response";
import { eq } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function markPaid(orderId: string, paymentId: string) {
  await db
    .update(orders)
    .set({ paymentStatus: "paid", paymentId, status: "confirmed", updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}

async function markFailed(orderId: string) {
  await db
    .update(orders)
    .set({ paymentStatus: "failed", updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}

// ---------------------------------------------------------------------------
// DodoPayments handler
// ---------------------------------------------------------------------------

async function handleDodo(request: Request): Promise<Response> {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  const signature = request.headers.get("webhook-signature");
  if (!secret || !signature) return badRequest("Missing webhook signature");

  // TODO: verify HMAC signature using DODO_WEBHOOK_SECRET
  const rawBody = await request.text();
  const event = JSON.parse(rawBody);

  const orderId: string | undefined = event.data?.metadata?.orderId;
  const paymentId: string | undefined = event.data?.payment_id ?? event.data?.session_id;

  if (event.type === "payment.succeeded" && orderId && paymentId) {
    await markPaid(orderId, paymentId);
  } else if (event.type === "payment.failed" && orderId) {
    await markFailed(orderId);
  }

  return ok({ received: true });
}

// ---------------------------------------------------------------------------
// Chargebee handler
// ---------------------------------------------------------------------------

async function handleChargebee(request: Request): Promise<Response> {
  // Chargebee sends Basic Auth – validate with the webhook password if set
  const webhookPassword = process.env.CHARGEBEE_WEBHOOK_PASSWORD;
  if (webhookPassword) {
    const authHeader = request.headers.get("authorization") ?? "";
    const encoded = Buffer.from(`api:${webhookPassword}`).toString("base64");
    if (authHeader !== `Basic ${encoded}`) return badRequest("Invalid webhook credentials");
  }

  const body = await request.json();
  const eventType: string = body.event_type;
  const content = body.content;

  // Chargebee passes orderId through pass_thru_content on the hosted page
  let orderId: string | undefined;
  try {
    const passThru = content?.invoice?.pass_thru_content ?? content?.hosted_page?.pass_thru_content;
    if (passThru) orderId = JSON.parse(passThru).orderId;
  } catch {
    // non-JSON pass_thru_content – ignore
  }

  const invoiceId: string | undefined = content?.invoice?.id;

  if (eventType === "payment_succeeded" && orderId && invoiceId) {
    await markPaid(orderId, invoiceId);
  } else if (eventType === "payment_failed" && orderId) {
    await markFailed(orderId);
  }

  return ok({ received: true });
}

// ---------------------------------------------------------------------------
// Route handler – dispatches by PAYMENT_GATEWAY env var
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const gateway = process.env.PAYMENT_GATEWAY?.toLowerCase().trim();
    if (gateway === "chargebee") return handleChargebee(request);
    return handleDodo(request);
  } catch (err) {
    console.error("[webhook]", err);
    return serverError();
  }
}
