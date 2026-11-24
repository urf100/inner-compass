"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { homeFor } from "@/lib/auth";
import { safeRedirectPath, str } from "@/lib/form";
import { withMessage } from "@/lib/messages";
import type { UserRole } from "@/lib/types";

export async function signIn(formData: FormData) {
  const email = str(formData, "email", 254).toLowerCase();
  const password = str(formData, "password", 200);
  const next = safeRedirectPath(formData.get("weiter"), "");

  if (!email || !password) redirect(withMessage("/anmelden", "ungueltig"));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) redirect(withMessage("/anmelden", "login_fehler"));

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle<{ role: UserRole }>();

  if (!profile) {
    await supabase.auth.signOut();
    redirect(withMessage("/anmelden", "fehler"));
  }

  revalidatePath("/", "layout");
  const home = homeFor(profile.role);
  // Nur in den eigenen Bereich weiterleiten
  const allowed = profile.role === "therapist" ? next.startsWith("/praxis") : !next.startsWith("/praxis");
  redirect(next && allowed ? next : home);
}
