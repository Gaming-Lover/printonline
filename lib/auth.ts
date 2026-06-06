import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

const cookieName = "printhub_session";
const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "development-secret-change-me-32-char");
export type SessionUser = { id: string; email: string; name: string; role: Role };

export async function hashPassword(password: string) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash); }
export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
  (await cookies()).set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function destroySession() { (await cookies()).delete(cookieName); }
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return { id: String(payload.id), email: String(payload.email), name: String(payload.name), role: payload.role as Role };
  } catch { return null; }
}
export async function requireUser() { const s = await getSession(); if (!s) redirect("/login"); return s; }
export async function requireAdmin() { const s = await requireUser(); if (s.role !== "ADMIN") redirect("/dashboard"); return s; }
export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password))) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role } satisfies SessionUser;
}
