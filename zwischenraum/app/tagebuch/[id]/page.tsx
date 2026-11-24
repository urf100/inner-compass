import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryForm } from "@/components/EntryForm";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { isUuid } from "@/lib/form";
import { getTherapistName } from "@/lib/queries";
import type { JournalEntry } from "@/lib/types";
import { deleteEntry, updateEntry } from "../actions";

export const metadata: Metadata = { title: "Eintrag bearbeiten" };

export default async function EditEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();
  const { supabase, profile } = await requireRole("client");

  const [{ data: entry }, therapistName] = await Promise.all([
    supabase.from("journal_entries").select("*").eq("id", id).eq("client_id", profile.id).maybeSingle<JournalEntry>(),
    getTherapistName(supabase, profile.therapist_id),
  ]);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Eintrag bearbeiten" back={{ href: "/tagebuch", label: "Zurück zum Tagebuch" }} />
      <Flash code={sp.m} />
      <EntryForm action={updateEntry} entry={entry} therapistName={therapistName} />

      <form action={deleteEntry} className="mt-10 border-t border-sand-200 pt-6">
        <input type="hidden" name="id" value={entry.id} />
        <SubmitButton
          className="btn-danger"
          pendingText="Wird gelöscht …"
          confirmMessage="Möchtest du diesen Eintrag wirklich endgültig löschen?"
        >
          Eintrag löschen
        </SubmitButton>
      </form>
    </div>
  );
}
