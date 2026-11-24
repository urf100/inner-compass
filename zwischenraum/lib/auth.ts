import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/types";

export function homeFor(role: UserRole) {
  return role === "therapist" ? "/praxis" : "/tagebuch";
}

/**
 * Liefert Supabase-Client, geprüfte Person und Profil – oder null.
 * getUser() validiert die Sitzung beim Auth-Server (nicht nur das Cookie).
 */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, display_name, therapist_id, created_at")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (!profile) return null;
  return { supabase, user, profile };
});

/**
 * Serverseitige Rollenprüfung – wird von JEDER geschützten Seite und JEDER
 * Server Action aufgerufen. Ohne Anmeldung -> Anmeldeseite; falsche Rolle ->
 * eigener Startbereich. RLS in der Datenbank schützt zusätzlich.
 */
export async function requireRole(role: UserRole) {
  const session = await getSession();
  if (!session) redirect("/anmelden");
  if (session.profile.role !== role) redirect(homeFor(session.profile.role));
  return session;
}
