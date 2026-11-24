import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { Flash } from "@/components/Flash";
import { MoodBadge } from "@/components/MoodBadge";
import { MoodChart } from "@/components/MoodChart";
import { requireRole } from "@/lib/auth";
import { addDays, formatDateLong, formatDateTime, formatRelativeDay, todayInVienna } from "@/lib/dates";
import { isUuid } from "@/lib/form";
import { dailyMood } from "@/lib/mood";
import { getOwnClient } from "@/lib/queries";
import type { AppointmentSlot, Exercise, ExerciseAssignment, JournalEntry } from "@/lib/types";

export const metadata: Metadata = { title: "Klient:in – Überblick" };

export default async function ClientOverviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();
  const { supabase, profile } = await requireRole("therapist");
  const client = await getOwnClient(supabase, profile.id, id);
  if (!client) notFound();

  const [{ data: entries }, { data: slots }, { data: assignments }] = await Promise.all([
    // Nur freigegebene Einträge (zusätzlich durch RLS erzwungen)
    supabase
      .from("journal_entries")
      .select("*")
      .eq("client_id", client.id)
      .eq("is_shared", true)
      .order("entry_date", { ascending: false })
      .limit(60)
      .returns<JournalEntry[]>(),
    supabase
      .from("appointment_slots")
      .select("*")
      .eq("therapist_id", profile.id)
      .eq("client_id", client.id)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .returns<AppointmentSlot[]>(),
    supabase
      .from("exercise_assignments")
      .select("*, exercise:exercises(title, duration_minutes)")
      .eq("therapist_id", profile.id)
      .eq("client_id", client.id)
      .order("assigned_at", { ascending: false })
      .returns<(ExerciseAssignment & { exercise: Pick<Exercise, "title" | "duration_minutes"> | null })[]>(),
  ]);

  const since = addDays(todayInVienna(), -29);
  const points = dailyMood((entries ?? []).filter((e) => e.entry_date >= since));
  const open = (assignments ?? []).filter((a) => !a.completed_at);
  const done = (assignments ?? []).filter((a) => a.completed_at);

  return (
    <div className="space-y-8">
      <Flash code={sp.m} />
      <MoodChart points={points} title="Stimmungsverlauf (geteilte Einträge, letzte 30 Tage)" />

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card" aria-labelledby="termine">
          <h2 id="termine" className="mb-2 text-lg font-semibold">
            Kommende Termine
          </h2>
          {slots?.length ? (
            <ul className="space-y-1">
              {slots.map((s) => (
                <li key={s.id}>{formatDateTime(s.starts_at)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft">Kein Termin gebucht.</p>
          )}
        </section>
        <section className="card" aria-labelledby="uebungen">
          <h2 id="uebungen" className="mb-2 text-lg font-semibold">
            Zugewiesene Übungen
          </h2>
          {assignments?.length ? (
            <ul className="space-y-1">
              {open.map((a) => (
                <li key={a.id}>
                  <span className="chip mr-2">offen</span>
                  {a.exercise?.title}
                </li>
              ))}
              {done.map((a) => (
                <li key={a.id}>
                  <span className="chip mr-2 bg-sage-50 text-sage-700">erledigt</span>
                  {a.exercise?.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft">Noch keine Übungen zugewiesen.</p>
          )}
          <Link href={`/praxis/klient-innen/${client.id}/uebungen`} className="link mt-3 inline-block text-sm">
            Übungen verwalten →
          </Link>
        </section>
      </div>

      <section aria-labelledby="geteilt">
        <h2 id="geteilt" className="mb-1 text-xl font-semibold">
          Geteilte Tagebucheinträge
        </h2>
        <p className="mb-3 text-sm text-ink-soft">
          Nur Einträge, die {client.display_name} freigegeben hat. Wird eine Freigabe zurückgezogen, verschwindet der
          Eintrag hier sofort.
        </p>
        {entries?.length ? (
          <ul className="space-y-3">
            {entries.map((e) => (
              <li key={e.id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{formatDateLong(e.entry_date)}</h3>
                  <MoodBadge mood={e.mood} />
                </div>
                {e.content ? (
                  <p className="mt-2 whitespace-pre-line">{e.content}</p>
                ) : (
                  <p className="mt-2 text-ink-soft italic">Ohne Text</p>
                )}
                {e.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Themen">
                    {e.tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {e.shared_at && <p className="mt-3 text-xs text-ink-soft">Geteilt {formatRelativeDay(e.shared_at)}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Noch keine geteilten Einträge" text="Sobald etwas geteilt wird, erscheint es hier." />
        )}
      </section>
    </div>
  );
}
