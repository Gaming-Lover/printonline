export type ApiResult<T> = { data: T; error?: never } | { data?: never; error: string };
export type RazorpayCheckoutResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; } }
