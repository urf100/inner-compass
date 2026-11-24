"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { str, uuid } from "@/lib/form";
import { withMessage } from "@/lib/messages";

export async function completeAssignment(formData: FormData) {
  const { supabase, profile } = await requireRole("client");
  const id = uuid(formData, "id");
  if (!id) redirect(withMessage("/uebungen", "fehler"));
  const reflection = str(formData, "reflection", 4000) || null;
  const markDone = str(formData, "intent", 10) === "done";
  const path = `/uebungen/${id}`;

  const { data: current } = await supabase
    .from("exercise_assignments")
    .select("completed_at")
    .eq("id", id)
    .eq("client_id", profile.id)
    .maybeSingle<{ completed_at: string | null }>();
  if (!current) redirect(withMessage("/uebungen", "fehler"));

  const update: { reflection: string | null; completed_at?: string } = { reflection };
  if (markDone && !current.completed_at) update.completed_at = new Date().toISOString();

  const { error } = await supabase
    .from("exercise_assignments")
    .update(update)
    .eq("id", id)
    .eq("client_id", profile.id);
  if (error) redirect(withMessage(path, "fehler"));

  revalidatePath("/uebungen");
  redirect(withMessage(path, markDone && !current.completed_at ? "erledigt" : "reflexion_gespeichert"));
}

export async function reopenAssignment(formData: FormData) {
  const { supabase, profile } = await requireRole("client");
  const id = uuid(formData, "id");
  if (!id) redirect(withMessage("/uebungen", "fehler"));
  const { error } = await supabase
    .from("exercise_assignments")
    .update({ completed_at: null })
    .eq("id", id)
    .eq("client_id", profile.id);
  if (error) redirect(withMessage(`/uebungen/${id}`, "fehler"));
  revalidatePath("/uebungen");
  redirect(withMessage(`/uebungen/${id}`, "wieder_offen"));
}
