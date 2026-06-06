import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "@/lib/env";
export function getSupabaseAdmin() { return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } }); }
export function getSupabaseBrowser() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }
