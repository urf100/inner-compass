import type { Metadata } from "next";
import { EmptyState } from "@/components/EmptyState";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { formatDateLong, formatDateTime, formatTime, hoursUntil, viennaDate } from "@/lib/dates";
import { getTherapistName } from "@/lib/queries";
import type { AppointmentSlot } from "@/lib/types";
import { bookSlot, cancelBooking } from "./actions";

export const metadata: Metadata = { title: "Termine" };

export default async function ClientAppointmentsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, profile } = await requireRole("client");
  const nowIso = new Date().toISOString();

  const [{ data: mine }, { data: free }, therapistName] = await Promise.all([
    supabase
      .from("appointment_slots")
      .select("*")
      .eq("client_id", profile.id)
      .gte("starts_at", nowIso)
      .order("starts_at")
      .returns<AppointmentSlot[]>(),
    // RLS zeigt nur freie, zukünftige Zeitfenster der eigenen Therapeut:in
    supabase
      .from("appointment_slots")
      .select("*")
      .is("client_id", null)
      .gte("starts_at", nowIso)
      .order("starts_at")
      .limit(100)
      .returns<AppointmentSlot[]>(),
    getTherapistName(supabase, profile.therapist_id),
  ]);

  const byDay = new Map<string, AppointmentSlot[]>();
  for (const s of free ?? []) {
    const day = viennaDate(s.starts_at);
    byDay.set(day, [...(byDay.get(day) ?? []), s]);
  }

  return (
    <div>
      <PageHeader
        title="Termine"
        intro={`Hier siehst du deine Termine bei ${therapistName ?? "deiner Therapeut:in"} und kannst freie Zeitfenster buchen.`}
      />
      <Flash code={sp.m} />

      <section aria-labelledby="meine" className="mb-8">
        <h2 id="meine" className="mb-3 text-xl font-semibold">
          Deine kommenden Termine
        </h2>
        {mine?.length ? (
          <ul className="space-y-3">
            {mine.map((s) => {
              const canCancel = hoursUntil(s.starts_at) > 24;
              return (
                <li key={s.id} className="card flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{formatDateTime(s.starts_at)}</p>
                    <p className="text-sm text-ink-soft">
                      bis {formatTime(s.ends_at)} · bei {therapistName ?? "deiner Therapeut:in"}
                    </p>
                  </div>
                  {canCancel ? (
                    <form action={cancelBooking}>
                      <input type="hidden" name="id" value={s.id} />
                      <SubmitButton className="btn-secondary btn-sm" confirmMessage="Diesen Termin wirklich stornieren?">
                        Stornieren
                      </SubmitButton>
                    </form>
                  ) : (
                    <p className="max-w-xs text-sm text-ink-soft">
                      Weniger als 24 Stunden bis zum Termin – bitte melde dich direkt bei deiner Therapeut:in, wenn du
                      absagen musst.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-ink-soft">Du hast gerade keinen Termin gebucht.</p>
        )}
      </section>

      <section aria-labelledby="frei">
        <h2 id="frei" className="mb-1 text-xl font-semibold">
          Freie Zeitfenster
        </h2>
        <p className="mb-3 text-sm text-ink-soft">Stornieren ist bis 24 Stunden vor dem Termin möglich.</p>
        {byDay.size === 0 ? (
          <EmptyState
            title="Gerade keine freien Zeitfenster"
            text="Deine Therapeut:in hat aktuell keine freien Termine eingetragen. Schau gern später noch einmal vorbei."
          />
        ) : (
          <div className="space-y-4">
            {[...byDay.entries()].map(([day, slots]) => (
              <div key={day} className="card">
                <h3 className="mb-3 font-semibold">{formatDateLong(day)}</h3>
                <ul className="flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <li key={s.id}>
                      <form action={bookSlot}>
                        <input type="hidden" name="id" value={s.id} />
                        <SubmitButton
                          className="btn-secondary"
                          confirmMessage={`Termin am ${formatDateTime(s.starts_at)} verbindlich buchen?`}
                        >
                          {formatTime(s.starts_at)}–{formatTime(s.ends_at)}
                          <span className="sr-only"> buchen</span>
                        </SubmitButton>
                      </form>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
