"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { pricingSchema, statusSchema } from "@/lib/validations";
import { setSetting } from "@/lib/settings";

export async function updatePricing(formData: FormData) {
  await requireAdmin();
  const parsed = pricingSchema.safeParse({ bwPrice: formData.get("bwPrice"), colorPrice: formData.get("colorPrice") });
  if (!parsed.success) return { error: "Invalid pricing" };
  const current = await prisma.pricing.findFirst({ orderBy: { updatedAt: "desc" } });
  if (current) await prisma.pricing.update({ where: { id: current.id }, data: parsed.data });
  else await prisma.pricing.create({ data: parsed.data });
  revalidatePath("/admin/pricing");
  revalidatePath("/admin/settings");
  revalidatePath("/upload");
  return { ok: true };
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const parsed = statusSchema.parse({ orderId: formData.get("orderId"), status: formData.get("status") });
  const jobStatus = parsed.status === "PRINTING" ? "PRINTING" : parsed.status === "PRINTED" ? "PRINTED" : "WAITING";
  await prisma.$transaction([
    prisma.order.update({ where: { id: parsed.orderId }, data: { orderStatus: parsed.status } }),
    prisma.printJob.upsert({ where: { orderId: parsed.orderId }, update: { status: jobStatus }, create: { orderId: parsed.orderId, status: jobStatus } })
  ]);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/queue");
}

export async function updateAdminSettings(formData: FormData) {
  await requireAdmin();
  const pricing = pricingSchema.safeParse({ bwPrice: formData.get("bwPrice"), colorPrice: formData.get("colorPrice") });
  if (!pricing.success) return { error: "Invalid pricing" };

  const current = await prisma.pricing.findFirst({ orderBy: { updatedAt: "desc" } });
  if (current) await prisma.pricing.update({ where: { id: current.id }, data: pricing.data });
  else await prisma.pricing.create({ data: pricing.data });

  await Promise.all([
    setSetting("RAZORPAY_KEY_ID", String(formData.get("razorpayKeyId") ?? "")),
    setSetting("RAZORPAY_KEY_SECRET", String(formData.get("razorpayKeySecret") ?? "")),
    setSetting("RAZORPAY_WEBHOOK_SECRET", String(formData.get("razorpayWebhookSecret") ?? ""))
  ]);

  revalidatePath("/admin/settings");
  revalidatePath("/admin/pricing");
  return { ok: true };
}
