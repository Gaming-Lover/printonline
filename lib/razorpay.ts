import crypto from "crypto";
import Razorpay from "razorpay";
import { getRazorpayConfig } from "@/lib/settings";

function safeCompare(expected: string, actual: string) {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);
  return expectedBuffer.length === actualBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

export async function razorpay() {
  const { keyId, keySecret } = await getRazorpayConfig();
  if (!keyId || !keySecret) throw new Error("Razorpay credentials are not configured");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function verifyRazorpayPayment(orderId: string, paymentId: string, signature: string) {
  const { keySecret } = await getRazorpayConfig();
  if (!keySecret) throw new Error("Razorpay secret is not configured");
  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeCompare(expected, signature);
}

export async function verifyWebhook(rawBody: string, signature: string) {
  const { webhookSecret } = await getRazorpayConfig();
  if (!webhookSecret) throw new Error("Razorpay webhook secret is not configured");
  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return safeCompare(expected, signature);
}
