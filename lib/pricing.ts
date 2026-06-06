import "server-only";
import { prisma } from "@/lib/prisma";
import type { PrintType } from "@prisma/client";
export async function getPricing() { return prisma.pricing.findFirst({ orderBy: { updatedAt: "desc" } }).then(p => p ?? prisma.pricing.create({ data: { bwPrice: 2, colorPrice: 10 } })); }
export async function calculateAmount(pages: number, copies: number, printType: PrintType) { const p = await getPricing(); return pages * copies * (printType === "BW" ? p.bwPrice : p.colorPrice); }
