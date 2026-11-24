"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { uuid } from "@/lib/form";
import { withMessage } from "@/lib/messages";

// Buchen und Stornieren laufen über geprüfte Datenbankfunktionen
// (book_slot / cancel_booking), die Zuordnung und 24-h-Frist erzwingen.

export async function bookSlot(formData: FormData) {
  const { supabase } = await requireRole("client");
  const id = uuid(formData, "id");
  if (!id) redirect(withMessage("/termine", "fehler"));

  const { error } = await supabase.rpc("book_slot", { slot_id: id });
  if (error) redirect(withMessage("/termine", "nicht_verfuegbar"));

  revalidatePath("/termine");
  redirect(withMessage("/termine", "gebucht"));
}

export async function cancelBooking(formData: FormData) {
  const { supabase } = await requireRole("client");
  const id = uuid(formData, "id");
  if (!id) redirect(withMessage("/termine", "fehler"));

  const { error } = await supabase.rpc("cancel_booking", { slot_id: id });
  if (error) redirect(withMessage("/termine", "storno_zu_spaet"));

  revalidatePath("/termine");
  redirect(withMessage("/termine", "storniert"));
}
