import "server-only";
import { prisma } from "@/lib/prisma";
import { decryptSecret, encryptSecret } from "@/lib/crypto";

export type SettingKey = "RAZORPAY_KEY_ID" | "RAZORPAY_KEY_SECRET" | "RAZORPAY_WEBHOOK_SECRET";
const secretKeys = new Set<SettingKey>(["RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"]);

export async function getSetting(key: SettingKey) {
  const setting = await prisma.appSetting.findUnique({ where: { key } });
  if (!setting) return process.env[key] ?? "";
  return setting.encrypted ? decryptSecret(setting.value) : setting.value;
}

export async function setSetting(key: SettingKey, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return;
  const encrypted = secretKeys.has(key);
  await prisma.appSetting.upsert({
    where: { key },
    update: { value: encrypted ? encryptSecret(trimmed) : trimmed, encrypted },
    create: { key, value: encrypted ? encryptSecret(trimmed) : trimmed, encrypted }
  });
}

export async function getMaskedSetting(key: SettingKey) {
  const value = await getSetting(key);
  if (!value) return "Not configured";
  if (!secretKeys.has(key)) return value;
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export async function getRazorpayConfig() {
  return {
    keyId: await getSetting("RAZORPAY_KEY_ID"),
    keySecret: await getSetting("RAZORPAY_KEY_SECRET"),
    webhookSecret: await getSetting("RAZORPAY_WEBHOOK_SECRET")
  };
}
