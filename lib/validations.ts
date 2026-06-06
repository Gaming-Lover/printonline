import { z } from "zod";
export const registerSchema = z.object({ name: z.string().min(2).max(80), email: z.string().email().toLowerCase(), password: z.string().min(8).max(128) });
export const loginSchema = z.object({ email: z.string().email().toLowerCase(), password: z.string().min(8).max(128) });
export const orderSchema = z.object({ fileUrl: z.string().url(), filePath: z.string().min(3), fileName: z.string().min(1).max(255), pages: z.coerce.number().int().min(1).max(2000), copies: z.coerce.number().int().min(1).max(100), printType: z.enum(["BW", "COLOR"]), paperSize: z.enum(["A4", "A3"]), sideType: z.enum(["SINGLE", "DOUBLE"]) });
export const pricingSchema = z.object({ bwPrice: z.coerce.number().int().min(1).max(1000), colorPrice: z.coerce.number().int().min(1).max(5000) });
export const statusSchema = z.object({ orderId: z.string().min(5), status: z.enum(["PRINTING", "PRINTED", "FAILED"]) });
export const paymentVerifySchema = z.object({ orderId: z.string().min(5), razorpay_order_id: z.string(), razorpay_payment_id: z.string(), razorpay_signature: z.string() });
