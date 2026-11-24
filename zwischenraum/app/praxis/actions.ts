"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { addDays, isValidDateString, isValidTimeString, viennaLocalToUtc } from "@/lib/dates";
import { int, str, uuid } from "@/lib/form";
import { withMessage } from "@/lib/messages";
import { getOwnClient } from "@/lib/queries";

// Jede Aktion prüft serverseitig die Rolle (requireRole) und – wo eine
// Klient:in betroffen ist – die Zuordnung (getOwnClient). RLS in der
// Datenbank erzwingt dieselben Regeln ein zweites Mal.

async function requireClientOf(clientId: string | null) {
  const session = await requireRole("therapist");
  if (!clientId) redirect(withMessage("/praxis", "fehler"));
  const client = await getOwnClient(session.supabase, session.profile.id, clientId);
  if (!client) redirect(withMessage("/praxis", "fehler"));
  return { ...session, client };
}

// -----------------------------------------------------------------------------
// Sitzungsnotizen
// -----------------------------------------------------------------------------
export async function saveNote(formData: FormData) {
  const { supabase, profile, client } = await requireClientOf(uuid(formData, "client_id"));
  const base = `/praxis/klient-innen/${client.id}/notizen`;
  const noteId = uuid(formData, "id");
  const sessionDate = str(formData, "session_date", 10);
  const content = str(formData, "content", 20_000);
  if (!isValidDateString(sessionDate) || !content) redirect(withMessage(base, "ungueltig"));

  if (noteId) {
    const { data, error } = await supabase
      .from("session_notes")
      .update({ session_date: sessionDate, content })
      .eq("id", noteId)
      .eq("therapist_id", profile.id)
      .select("id");
    if (error || !data?.length) redirect(withMessage(base, "fehler"));
  } else {
    const { error } = await supabase
      .from("session_notes")
      .insert({ therapist_id: profile.id, client_id: client.id, session_date: sessionDate, content });
    if (error) redirect(withMessage(base, "fehler"));
  }
  revalidatePath(base);
  redirect(withMessage(base, "notiz_gespeichert"));
}

export async function deleteNote(formData: FormData) {
  const { supabase, profile, client } = await requireClientOf(uuid(formData, "client_id"));
  const base = `/praxis/klient-innen/${client.id}/notizen`;
  const noteId = uuid(formData, "id");
  if (!noteId) redirect(withMessage(base, "fehler"));
  const { error } = await supabase.from("session_notes").delete().eq("id", noteId).eq("therapist_id", profile.id);
  if (error) redirect(withMessage(base, "fehler"));
  revalidatePath(base);
  redirect(withMessage(base, "notiz_geloescht"));
}

// -----------------------------------------------------------------------------
// Übungen zuweisen
// -----------------------------------------------------------------------------
export async function assignExercise(formData: FormData) {
  const { supabase, profile, client } = await requireClientOf(uuid(formData, "client_id"));
  const base = `/praxis/klient-innen/${client.id}/uebungen`;
  const exerciseId = uuid(formData, "exercise_id");
  const note = str(formData, "note", 2000) || null;
  if (!exerciseId) redirect(withMessage(base, "ungueltig"));

  const { error } = await supabase
    .from("exercise_assignments")
    .insert({ exercise_id: exerciseId, therapist_id: profile.id, client_id: client.id, note });
  if (error) redirect(withMessage(base, "fehler"));
  revalidatePath(base);
  redirect(withMessage(base, "zugewiesen"));
}

export async function removeAssignment(formData: FormData) {
  const { supabase, profile, client } = await requireClientOf(uuid(formData, "client_id"));
  const base = `/praxis/klient-innen/${client.id}/uebungen`;
  const id = uuid(formData, "id");
  if (!id) redirect(withMessage(base, "fehler"));
  const { error } = await supabase
    .from("exercise_assignments")
    .delete()
    .eq("id", id)
    .eq("therapist_id", profile.id)
    .eq("client_id", client.id);
  if (error) redirect(withMessage(base, "fehler"));
  revalidatePath(base);
  redirect(withMessage(base, "zuweisung_entfernt"));
}

// -----------------------------------------------------------------------------
// Übungsbibliothek
// -----------------------------------------------------------------------------
function parseExercise(formData: FormData) {
  const title = str(formData, "title", 120);
  const description = str(formData, "description", 8000);
  const category = str(formData, "category", 60);
  const duration = int(formData, "duration_minutes");
  if (!title || !category || duration === null || duration < 1 || duration > 240) return null;
  return { title, description, category, duration_minutes: duration };
}

export async function saveExercise(formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");
  const id = uuid(formData, "id");
  const values = parseExercise(formData);
  const formPath = id ? `/praxis/uebungen/${id}` : "/praxis/uebungen/neu";
  if (!values) redirect(withMessage(formPath, "ungueltig"));

  if (id) {
    const { data, error } = await supabase
      .from("exercises")
      .update(values)
      .eq("id", id)
      .eq("therapist_id", profile.id)
      .select("id");
    if (error || !data?.length) redirect(withMessage(formPath, "fehler"));
  } else {
    const { error } = await supabase.from("exercises").insert({ ...values, therapist_id: profile.id });
    if (error) redirect(withMessage(formPath, "fehler"));
  }
  revalidatePath("/praxis/uebungen");
  redirect(withMessage("/praxis/uebungen", "uebung_gespeichert"));
}

export async function deleteExercise(formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");
  const id = uuid(formData, "id");
  if (!id) redirect(withMessage("/praxis/uebungen", "fehler"));

  const { count } = await supabase
    .from("exercise_assignments")
    .select("id", { count: "exact", head: true })
    .eq("exercise_id", id);
  if (count && count > 0) redirect(withMessage(`/praxis/uebungen/${id}`, "uebung_zugewiesen_nicht_loeschbar"));

  const { error } = await supabase.from("exercises").delete().eq("id", id).eq("therapist_id", profile.id);
  if (error) redirect(withMessage(`/praxis/uebungen/${id}`, "uebung_zugewiesen_nicht_loeschbar"));
  revalidatePath("/praxis/uebungen");
  redirect(withMessage("/praxis/uebungen", "uebung_geloescht"));
}

// -----------------------------------------------------------------------------
// Einladungen
// -----------------------------------------------------------------------------
export async function createInvitation(formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");
  const label = str(formData, "label", 80) || null;
  const { error } = await supabase.from("invitations").insert({ therapist_id: profile.id, label });
  if (error) redirect(withMessage("/praxis/einladungen", "fehler"));
  revalidatePath("/praxis/einladungen");
  redirect(withMessage("/praxis/einladungen", "einladung_erstellt"));
}

export async function deleteInvitation(formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");
  const id = uuid(formData, "id");
  if (!id) redirect(withMessage("/praxis/einladungen", "fehler"));
  const { error } = await supabase
    .from("invitations")
    .delete()
    .eq("id", id)
    .eq("therapist_id", profile.id)
    .is("used_by", null);
  if (error) redirect(withMessage("/praxis/einladungen", "fehler"));
  revalidatePath("/praxis/einladungen");
  redirect(withMessage("/praxis/einladungen", "einladung_geloescht"));
}

// -----------------------------------------------------------------------------
// Zeitfenster
// -----------------------------------------------------------------------------
export async function createSlots(formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");
  const base = "/praxis/termine";
  const date = str(formData, "date", 10);
  const time = str(formData, "time", 5);
  const duration = int(formData, "duration_minutes");
  const repeat = int(formData, "repeat_weeks") ?? 1;

  if (
    !isValidDateString(date) ||
    !isValidTimeString(time) ||
    duration === null ||
    duration < 10 ||
    duration > 240 ||
    repeat < 1 ||
    repeat > 12
  ) {
    redirect(withMessage(base, "ungueltig"));
  }

  // Wöchentliche Wiederholung in Wiener Ortszeit (Sommer-/Winterzeit wird berücksichtigt)
  const rows = Array.from({ length: repeat }, (_, week) => {
    const startsAt = viennaLocalToUtc(addDays(date, week * 7), time);
    const endsAt = new Date(startsAt.getTime() + duration * 60_000);
    return { therapist_id: profile.id, starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString() };
  });

  if (new Date(rows[0].starts_at).getTime() <= Date.now()) redirect(withMessage(base, "slot_vergangen"));

  const { error } = await supabase.from("appointment_slots").insert(rows);
  if (error) {
    // 23P01 = exclusion_violation (Überschneidung)
    redirect(withMessage(base, error.code === "23P01" ? "slot_ueberschneidung" : "fehler"));
  }
  revalidatePath(base);
  redirect(withMessage(base, "slots_angelegt"));
}

export async function deleteSlot(formData: FormData) {
  const { supabase, profile } = await requireRole("therapist");
  const id = uuid(formData, "id");
  if (!id) redirect(withMessage("/praxis/termine", "fehler"));
  const { error } = await supabase.from("appointment_slots").delete().eq("id", id).eq("therapist_id", profile.id);
  if (error) redirect(withMessage("/praxis/termine", "fehler"));
  revalidatePath("/praxis/termine");
  redirect(withMessage("/praxis/termine", "slot_geloescht"));
}
