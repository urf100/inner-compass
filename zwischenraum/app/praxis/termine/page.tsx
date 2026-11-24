import type { Metadata } from "next";
import { EmptyState } from "@/components/EmptyState";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { addDays, formatDateLong, formatTime, todayInVienna, viennaDate } from "@/lib/dates";
import type { AppointmentSlot, Profile } from "@/lib/types";
import { createSlots, deleteSlot } from "@/app/praxis/actions";

export const metadata: Metadata = { title: "Termine verwalten" };

export default async function TherapistSlotsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, profile } = await requireRole("therapist");

  const [{ data: slots }, { data: clients }] = await Promise.all([
    supabase
      .from("appointment_slots")
      .select("*")
      .eq("therapist_id", profile.id)
      .gte("ends_at", new Date().toISOString())
      .order("starts_at")
      .limit(200)
      .returns<AppointmentSlot[]>(),
    supabase
      .from("profiles")
      .select("id, display_name")
      .eq("therapist_id", profile.id)
      .returns<Pick<Profile, "id" | "display_name">[]>(),
  ]);

  const names = new Map((clients ?? []).map((c) => [c.id, c.display_name]));
  const byDay = new Map<string, AppointmentSlot[]>();
  for (const s of slots ?? []) {
    const day = viennaDate(s.starts_at);
    byDay.set(day, [...(byDay.get(day) ?? []), s]);
  }
  const booked = (slots ?? []).filter((s) => s.client_id).length;

  return (
    <div>
      <PageHeader
        title="Termine"
        intro="Lege freie Zeitfenster an. Deine Klient:innen können sie buchen und bis 24 Stunden vorher stornieren."
      />
      <Flash code={sp.m} />

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <form action={createSlots} className="card h-fit space-y-4">
          <h2 className="text-lg font-semibold">Freie Zeitfenster anlegen</h2>
          <div>
            <label htmlFor="date" className="label">
              Datum
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              min={todayInVienna()}
              defaultValue={addDays(todayInVienna(), 1)}
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="time" className="label">
                Beginn
              </label>
              <input id="time" name="time" type="time" required defaultValue="09:00" step={300} className="input" />
            </div>
            <div>
              <label htmlFor="duration_minutes" className="label">
                Dauer (Min.)
              </label>
              <input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                min={10}
                max={240}
                required
                defaultValue={50}
                className="input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="repeat_weeks" className="label">
              Wöchentlich wiederholen
            </label>
            <select id="repeat_weeks" name="repeat_weeks" defaultValue="1" className="input">
              <option value="1">Nur einmal</option>
              {[2, 3, 4, 6, 8, 12].map((n) => (
                <option key={n} value={n}>
                  {n} Wochen
                </option>
              ))}
            </select>
          </div>
          <p className="hint">Zeiten in österreichischer Zeit (Europe/Vienna).</p>
          <SubmitButton className="btn-primary w-full">Zeitfenster anlegen</SubmitButton>
        </form>

        <section aria-labelledby="kommend">
          <h2 id="kommend" className="mb-1 text-xl font-semibold">
            Kommende Zeitfenster
          </h2>
          <p className="mb-3 text-sm text-ink-soft">
            {slots?.length ?? 0} Zeitfenster, davon {booked} gebucht.
          </p>
          {byDay.size === 0 ? (
            <EmptyState title="Noch keine Zeitfenster" text="Lege links dein erstes freies Zeitfenster an." />
          ) : (
            <div className="space-y-4">
              {[...byDay.entries()].map(([day, daySlots]) => (
                <div key={day} className="card">
                  <h3 className="mb-2 font-semibold">{formatDateLong(day)}</h3>
                  <ul className="divide-y divide-sand-100">
                    {daySlots.map((s) => (
                      <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                        <span>
                          <span className="font-semibold">
                            {formatTime(s.starts_at)}–{formatTime(s.ends_at)}
                          </span>{" "}
                          {s.client_id ? (
                            <span className="chip ml-1 bg-sage-50 font-semibold text-sage-700">
                              gebucht: {names.get(s.client_id) ?? "Klient:in"}
                            </span>
                          ) : (
                            <span className="chip ml-1">frei</span>
                          )}
                        </span>
                        <form action={deleteSlot}>
                          <input type="hidden" name="id" value={s.id} />
                          <SubmitButton
                            className="btn-quiet btn-sm"
                            confirmMessage={
                              s.client_id
                                ? "Dieser Termin ist gebucht. Wirklich absagen und entfernen? Bitte informiere deine Klient:in persönlich."
                                : "Dieses freie Zeitfenster entfernen?"
                            }
                          >
                            {s.client_id ? "Absagen" : "Entfernen"}
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
    </div>
  );
}
