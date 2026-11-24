"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";
import { str } from "@/lib/form";
import { withMessage } from "@/lib/messages";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(withMessage("/anmelden", "abgemeldet"));
}

export async function updateDisplayName(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/anmelden");

  const name = str(formData, "display_name", 80);
  if (!name) redirect(withMessage("/konto", "ungueltig"));

  const { error } = await session.supabase
    .from("profiles")
    .update({ display_name: name })
    .eq("id", session.profile.id);

  if (error) redirect(withMessage("/konto", "fehler"));
  revalidatePath("/", "layout");
  redirect(withMessage("/konto", "profil_gespeichert"));
}
