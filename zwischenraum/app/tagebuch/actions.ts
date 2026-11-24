"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { SUGGESTED_TAGS } from "@/lib/constants";
import { isValidDateString, todayInVienna } from "@/lib/dates";
import { bool, int, str, uuid } from "@/lib/form";
import { withMessage } from "@/lib/messages";

function parseEntry(formData: FormData) {
  const entryDate = str(formData, "entry_date", 10);
  const mood = int(formData, "mood");
  const content = str(formData, "content", 10_000);
  const suggested = SUGGESTED_TAGS as readonly string[];

  const picked = formData
    .getAll("tags")
    .filter((t): t is string => typeof t === "string" && suggested.includes(t));
  const custom = str(formData, "tags_custom", 200)
    .split(",")
    .map((t) => t.trim().replace(/\s+/g, " ").slice(0, 30))
    .filter(Boolean);
  const tags = Array.from(new Set([...picked, ...custom])).slice(0, 12);

  if (!isValidDateString(entryDate) || entryDate > todayInVienna()) return null;
  if (mood === null || mood < 1 || mood > 10) return null;

  return { entry_date: entryDate, mood, content, tags, is_shared: bool(formData, "is_shared") };
}

export async function createEntry(formData: FormData) {
  const { supabase, profile } = await requireRole("client");
  const values = parseEntry(formData);
  if (!values) redirect(withMessage("/tagebuch/neu", "ungueltig"));

  const { error } = await supabase.from("journal_entries").insert({ ...values, client_id: profile.id });
  if (error) redirect(withMessage("/tagebuch/neu", "fehler"));

  revalidatePath("/tagebuch");
  redirect(withMessage("/tagebuch", "eintrag_gespeichert"));
}

export async function updateEntry(formData: FormData) {
  const { supabase, profile } = await requireRole("client");
  const id = uuid(formData, "id");
  if (!id) redirect(withMessage("/tagebuch", "fehler"));
  const values = parseEntry(formData);
  if (!values) redirect(withMessage(`/tagebuch/${id}`, "ungueltig"));

  const { data, error } = await supabase
    .from("journal_entries")
    .update(values)
    .eq("id", id)
    .eq("client_id", profile.id)
    .select("id");
  if (error || !data?.length) redirect(withMessage(`/tagebuch/${id}`, "fehler"));

  revalidatePath("/tagebuch");
  redirect(withMessage("/tagebuch", "eintrag_gespeichert"));
}

export async function deleteEntry(formData: FormData) {
  const { supabase, profile } = await requireRole("client");
  const id = uuid(formData, "id");
  if (!id) redirect(withMessage("/tagebuch", "fehler"));

  const { error } = await supabase.from("journal_entries").delete().eq("id", id).eq("client_id", profile.id);
  if (error) redirect(withMessage("/tagebuch", "fehler"));

  revalidatePath("/tagebuch");
  redirect(withMessage("/tagebuch", "eintrag_geloescht"));
}

export async function setShared(formData: FormData) {
  const { supabase, profile } = await requireRole("client");
  const id = uuid(formData, "id");
  const share = str(formData, "share", 5) === "true";
  if (!id) redirect(withMessage("/tagebuch", "fehler"));

  const { data, error } = await supabase
    .from("journal_entries")
    .update({ is_shared: share })
    .eq("id", id)
    .eq("client_id", profile.id)
    .select("id");
  if (error || !data?.length) redirect(withMessage("/tagebuch", "fehler"));

  revalidatePath("/tagebuch");
  redirect(withMessage("/tagebuch", share ? "geteilt" : "nicht_geteilt"));
}
