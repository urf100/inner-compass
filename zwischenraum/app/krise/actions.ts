"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { MAX_CONTACTS } from "@/lib/crisis";
import { str, uuid } from "@/lib/form";
import { withMessage } from "@/lib/messages";
import { getOwnClient } from "@/lib/queries";

/**
 * Speichert den Krisenplan. Erlaubt für die Klient:in selbst und für die
 * zugeordnete Therapeut:in – serverseitig geprüft und zusätzlich per RLS.
 */
export async function saveCrisisPlan(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/anmelden");
  const { supabase, profile } = session;

  let clientId: string;
  let back: string;
  if (profile.role === "client") {
    clientId = profile.id;
    back = "/krise";
  } else {
    const requested = uuid(formData, "client_id");
    const client = requested ? await getOwnClient(supabase, profile.id, requested) : null;
    if (!client) redirect(withMessage("/praxis", "fehler"));
    clientId = client.id;
    back = `/praxis/klient-innen/${client.id}/krisenplan`;
  }

  const contacts = Array.from({ length: MAX_CONTACTS }, (_, i) => ({
    name: str(formData, `contact_name_${i}`, 80),
    phone: str(formData, `contact_phone_${i}`, 40).replace(/[^\d+()/\-\s]/g, ""),
    note: str(formData, `contact_note_${i}`, 120),
  })).filter((c) => c.name || c.phone);

  const values = {
    warning_signs: str(formData, "warning_signs", 4000),
    helpful_actions: str(formData, "helpful_actions", 4000),
    contacts,
  };

  const { data: existing } = await supabase
    .from("crisis_plans")
    .select("client_id")
    .eq("client_id", clientId)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("crisis_plans").update(values).eq("client_id", clientId)
    : await supabase.from("crisis_plans").insert({ client_id: clientId, ...values });

  if (error) redirect(withMessage(profile.role === "client" ? "/krise/bearbeiten" : back, "fehler"));
  revalidatePath(back);
  redirect(withMessage(back, "krisenplan_gespeichert"));
}
