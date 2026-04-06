import { ok, badRequest, handleError } from "@/lib/api-response";
import { requireSession } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await requireSession();
    return ok(session.user);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH() {
  try {
    const session = await requireSession();
    if (session.user.role !== "buyer") {
      return badRequest("Only buyers can upgrade to seller");
    }
    await db.update(users).set({ role: "seller" }).where(eq(users.id, session.user.id));
    return ok({ message: "Account upgraded to seller" });
  } catch (err) {
    return handleError(err);
  }
}
