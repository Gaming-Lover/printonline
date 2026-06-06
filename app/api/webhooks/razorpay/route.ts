import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhook } from "@/lib/razorpay";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  if (!signature || !(await verifyWebhook(raw, signature))) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(raw);
  if (event.event === "payment.captured") {
    const entity = event.payload?.payment?.entity;
    const razorpayOrderId = entity?.order_id as string | undefined;
    const paymentId = entity?.id as string | undefined;

    if (razorpayOrderId && paymentId) {
      const payment = await prisma.payment.findUnique({ where: { razorpayOrderId } });
      if (payment) {
        await prisma.$transaction([
          prisma.payment.update({ where: { id: payment.id }, data: { razorpayPaymentId: paymentId, status: "PAID" } }),
          prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "PAID", orderStatus: "PAID" } }),
          prisma.printJob.upsert({ where: { orderId: payment.orderId }, update: { status: "WAITING" }, create: { orderId: payment.orderId, status: "WAITING" } })
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}
