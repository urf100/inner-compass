import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Flash } from "@/components/Flash";
import { MoodBadge } from "@/components/MoodBadge";
import { MoodChart } from "@/components/MoodChart";
import { PageHeader } from "@/components/PageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { addDays, formatDateLong, todayInVienna } from "@/lib/dates";
import { dailyMood } from "@/lib/mood";
import { getTherapistName } from "@/lib/queries";
import type { JournalEntry } from "@/lib/types";
import { setShared } from "./actions";

export const metadata: Metadata = { title: "Tagebuch" };

export default async function JournalPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, profile } = await requireRole("client");

  const [{ data: entries }, { data: recent }, therapistName] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("*")
      .eq("client_id", profile.id)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<JournalEntry[]>(),
    supabase
      .from("journal_entries")
      .select("entry_date, mood")
      .eq("client_id", profile.id)
      .gte("entry_date", addDays(todayInVienna(), -29))
      .returns<{ entry_date: string; mood: number }[]>(),
    getTherapistName(supabase, profile.therapist_id),
  ]);

  const list = entries ?? [];
  const points = dailyMood(recent ?? []);

  return (
    <div>
      <PageHeader
        title={`Hallo ${profile.display_name}`}
        intro="Dein Tagebuch ist zuerst nur für dich. Du entscheidest bei jedem Eintrag, ob du ihn teilst."
      >
        <Link href="/tagebuch/neu" className="btn-primary">
          <span aria-hidden="true">+</span> Neuer Eintrag
        </Link>
      </PageHeader>
      <Flash code={sp.m} />

      {list.length === 0 ? (
        <EmptyState
          title="Noch keine Einträge – wie geht es dir heute?"
          text="Ein paar Worte oder einfach nur eine Zahl für deine Stimmung genügen für den Anfang."
          actionHref="/tagebuch/neu"
          actionLabel="Ersten Eintrag schreiben"
        />
      ) : (
        <div className="space-y-6">
          <MoodChart points={points} title="Deine Stimmung in den letzten 30 Tagen" />

          <section aria-labelledby="eintraege">
            <h2 id="eintraege" className="mb-3 text-xl font-semibold">
              Deine Einträge
            </h2>
            <ul className="space-y-3">
              {list.map((e) => (
                <li key={e.id} id={`eintrag-${e.id}`} className="card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{formatDateLong(e.entry_date)}</h3>
                    <MoodBadge mood={e.mood} />
                  </div>
                  {e.content && <p className="mt-2 line-clamp-4 whitespace-pre-line text-ink">{e.content}</p>}
                  {e.tags.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Themen">
                      {e.tags.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-sand-100 pt-3">
                    <p className="text-sm">
                      {e.is_shared ? (
                        <span className="font-semibold text-sage-700">
                          <span aria-hidden="true">👁 </span>Geteilt mit {therapistName ?? "deiner Therapeut:in"}
                        </span>
                      ) : (
                        <span className="text-ink-soft">
                          <span aria-hidden="true">🔒 </span>Privat – nur für dich
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <form action={setShared}>
                        <input type="hidden" name="id" value={e.id} />
                        <input type="hidden" name="share" value={e.is_shared ? "false" : "true"} />
                        <SubmitButton className="btn-secondary btn-sm" pendingText="…">
                          {e.is_shared ? "Freigabe zurückziehen" : "Mit Therapeut:in teilen"}
                        </SubmitButton>
                      </form>
                      <Link href={`/tagebuch/${e.id}`} className="btn-quiet btn-sm">
                        Bearbeiten<span className="sr-only"> (Eintrag vom {formatDateLong(e.entry_date)})</span>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
