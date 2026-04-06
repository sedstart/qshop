import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, accounts, sessions, verifications, products, orders, orderItems } from "../src/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function clean() {
  console.log("🧹  Clearing all data…\n");

  // Delete in FK-safe order (children before parents)
  const oi = await db.delete(orderItems).returning({ id: orderItems.id });
  console.log(`  🗑  order_items:   ${oi.length}`);

  const o = await db.delete(orders).returning({ id: orders.id });
  console.log(`  🗑  orders:        ${o.length}`);

  const p = await db.delete(products).returning({ id: products.id });
  console.log(`  🗑  products:      ${p.length}`);

  const a = await db.delete(accounts).returning({ id: accounts.id });
  console.log(`  🗑  accounts:      ${a.length}`);

  const s = await db.delete(sessions).returning({ id: sessions.id });
  console.log(`  🗑  sessions:      ${s.length}`);

  const v = await db.delete(verifications).returning({ id: verifications.id });
  console.log(`  🗑  verifications: ${v.length}`);

  const u = await db.delete(users).returning({ id: users.id });
  console.log(`  🗑  users:         ${u.length}`);

  console.log("\n✅  All data cleared.\n");
}

clean().catch((err) => {
  console.error(err);
  process.exit(1);
});
