"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";
import { bool, str } from "@/lib/form";
import { withMessage, type MessageKey } from "@/lib/messages";

const MIN_PASSWORD = 10;

function back(path: string, key: MessageKey): never {
  redirect(withMessage(path, key));
}

async function register(
  path: string,
  formData: FormData,
  metadata: Record<string, string>,
  home: string,
) {
  const email = str(formData, "email", 254).toLowerCase();
  const password = str(formData, "password", 200);
  const displayName = str(formData, "display_name", 80);

  if (!bool(formData, "test_ok")) back(path, "testhinweis_fehlt");
  if (!email || !displayName) back(path, "ungueltig");
  if (password.length < MIN_PASSWORD) back(path, "passwort_kurz");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
      data: { ...metadata, display_name: displayName },
    },
  });

  if (error) {
    if (error.code === "user_already_exists" || error.code === "email_exists") back(path, "email_vergeben");
    if (error.code === "weak_password") back(path, "passwort_kurz");
    // Fehler aus dem Datenbank-Trigger (z. B. Einladungscode ungültig)
    back(path, metadata.role === "client" ? "code_ungueltig" : "fehler");
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect(home);
  }
  // E-Mail-Bestätigung ist im Supabase-Projekt aktiviert
  redirect(withMessage("/anmelden", "registriert_bestaetigen"));
}

export async function signUpTherapist(formData: FormData) {
  await register("/registrieren/praxis", formData, { role: "therapist" }, "/praxis");
}

export async function signUpClient(formData: FormData) {
  const code = str(formData, "invite_code", 20).toUpperCase().replace(/\s+/g, "");
  const path = `/registrieren/einladung`;
  if (!/^[A-Z0-9]{5}-?[A-Z0-9]{5}$/.test(code)) back(path, "code_ungueltig");
  const normalized = code.includes("-") ? code : `${code.slice(0, 5)}-${code.slice(5)}`;

  // Freundliche Vorab-Prüfung (die verbindliche Prüfung macht der DB-Trigger)
  const supabase = await createClient();
  const { data: valid } = await supabase.rpc("check_invitation_code", { invite_code: normalized });
  if (!valid) back(path, "code_ungueltig");

  await register(path, formData, { role: "client", invite_code: normalized }, "/tagebuch");
}
