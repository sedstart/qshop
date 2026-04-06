import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { ok, badRequest, forbidden, notFound, handleError } from "@/lib/api-response";
import { requireSession } from "@/lib/session";
import { getPaymentGateway } from "@/lib/payments";
import { eq } from "drizzle-orm";
import { z } from "zod";

const checkoutSchema = z.object({
  orderId: z.string(),
  successUrl: z.string(),
  cancelUrl: z.string(),
});

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const { orderId, successUrl, cancelUrl } = parsed.data;

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) return notFound("Order not found");
    if (order.buyerId !== session.user.id) return forbidden();
    if (order.paymentStatus === "paid") return badRequest("Order already paid");

    const rows = await db
      .select({ item: orderItems, product: products })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    const items = rows
      .filter((r) => r.product !== null)
      .map((r) => ({ product: r.product!, quantity: r.item.quantity }));

    if (items.length === 0) return badRequest("No valid products in order");

    const gateway = await getPaymentGateway();
    const { checkoutUrl, sessionId } = await gateway.createCheckout({
      orderId,
      items,
      customer: { email: session.user.email, name: session.user.name },
      currency: order.currency,
      successUrl,
      cancelUrl,
    });

    await db
      .update(orders)
      .set({ paymentId: sessionId, updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    return ok({ checkoutUrl, sessionId });
  } catch (err) {
    return handleError(err);
  }
}
