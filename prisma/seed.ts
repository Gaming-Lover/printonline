import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.pricing.upsert({ where: { id: "default-pricing" }, update: {}, create: { id: "default-pricing", bwPrice: 2, colorPrice: 10 } });
  const email = process.env.ADMIN_EMAIL ?? process.env.DEFAULT_ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD ?? process.env.DEFAULT_ADMIN_PASSWORD;
  if (email && password) {
    await prisma.user.upsert({ where: { email: email.toLowerCase() }, update: { role: "ADMIN" }, create: { name: "PrintHub Admin", email: email.toLowerCase(), password: await bcrypt.hash(password, 12), role: "ADMIN" } });
  }
}
main().finally(() => prisma.$disconnect());
