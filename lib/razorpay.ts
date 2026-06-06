import crypto from "crypto";
import Razorpay from "razorpay";
import { requireEnv } from "@/lib/env";
export function razorpay() { return new Razorpay({ key_id: requireEnv("RAZORPAY_KEY_ID"), key_secret: requireEnv("RAZORPAY_KEY_SECRET") }); }
export function verifyRazorpayPayment(orderId: string, paymentId: string, signature: string) {
  const expected = crypto.createHmac("sha256", requireEnv("RAZORPAY_KEY_SECRET")).update(`${orderId}|${paymentId}`).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
export function verifyWebhook(rawBody: string, signature: string) {
  const expected = crypto.createHmac("sha256", requireEnv("RAZORPAY_WEBHOOK_SECRET")).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
