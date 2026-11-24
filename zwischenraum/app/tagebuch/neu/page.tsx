import type { Metadata } from "next";
import { EntryForm } from "@/components/EntryForm";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { requireRole } from "@/lib/auth";
import { getTherapistName } from "@/lib/queries";
import { createEntry } from "../actions";

export const metadata: Metadata = { title: "Neuer Eintrag" };

export default async function NewEntryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, profile } = await requireRole("client");
  const therapistName = await getTherapistName(supabase, profile.therapist_id);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Wie geht es dir heute?"
        intro="Nimm dir einen Moment. Es gibt hier kein Richtig oder Falsch."
        back={{ href: "/tagebuch", label: "Zurück zum Tagebuch" }}
      />
      <Flash code={sp.m} />
      <EntryForm action={createEntry} therapistName={therapistName} />
    </div>
  );
}
