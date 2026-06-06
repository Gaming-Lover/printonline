import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword, verifyPassword } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({ adminId: z.string().min(3).max(80), password: z.string().min(6).max(128) });
const defaultAdminId = process.env.DEFAULT_ADMIN_ID ?? "admin";
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "admin123";
const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@printhub.local";

export async function POST(req: Request) {
  const rl = rateLimit(`admin-login:${clientIp(req)}`, 6, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid admin credentials" }, { status: 400 });

  const { adminId, password } = parsed.data;
  if (adminId !== defaultAdminId) return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });

  let admin = await prisma.user.findUnique({ where: { email: defaultAdminEmail } });
  if (!admin && password === defaultAdminPassword) {
    admin = await prisma.user.create({
      data: { name: "PrintHub Admin", email: defaultAdminEmail, password: await hashPassword(defaultAdminPassword), role: "ADMIN" }
    });
  }

  if (!admin || admin.role !== "ADMIN" || !(await verifyPassword(password, admin.password))) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  await createSession({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
  return NextResponse.json({ ok: true });
}
