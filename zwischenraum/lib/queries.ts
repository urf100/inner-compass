import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Name der zugeordneten Therapeut:in (für Klient:innen). */
export async function getTherapistName(supabase: SupabaseClient, therapistId: string | null) {
  if (!therapistId) return null;
  const { data } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", therapistId)
    .maybeSingle<{ display_name: string }>();
  return data?.display_name ?? null;
}

/**
 * Lädt das Profil einer Klient:in NUR, wenn sie der angemeldeten
 * Therapeut:in zugeordnet ist (zusätzlich zu RLS).
 */
export async function getOwnClient(supabase: SupabaseClient, therapistId: string, clientId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("id, role, display_name, therapist_id, created_at")
    .eq("id", clientId)
    .eq("role", "client")
    .eq("therapist_id", therapistId)
    .maybeSingle<import("@/lib/types").Profile>();
  return data ?? null;
}
