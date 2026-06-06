import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatCurrency(amount: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount); }
export function absoluteUrl(path: string) { return `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}${path}`; }
