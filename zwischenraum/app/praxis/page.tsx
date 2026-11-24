import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Flash } from "@/components/Flash";
import { MoodChart } from "@/components/MoodChart";
import { TrendLabel } from "@/components/MoodBadge";
import { PageHeader } from "@/components/PageHeader";
import { requireRole } from "@/lib/auth";
import { addDays, formatDateTime, formatRelativeDay, todayInVienna } from "@/lib/dates";
import { dailyMood, moodTrend } from "@/lib/mood";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = { title: "Klient:innen" };

export default async function TherapistDashboard({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, profile } = await requireRole("therapist");
  const since = addDays(todayInVienna(), -29);
  const nowIso = new Date().toISOString();

  const { data: clients } = await supabase
    .from("profiles")
    .select("id, role, display_name, therapist_id, created_at")
    .eq("therapist_id", profile.id)
    .eq("role", "client")
    .order("display_name")
    .returns<Profile[]>();

  const ids = (clients ?? []).map((c) => c.id);

  const [entriesRes, latestSharedRes, assignmentsRes, slotsRes, invitesRes] = ids.length
    ? await Promise.all([
        // RLS liefert hier ausschließlich freigegebene Einträge
        supabase
          .from("journal_entries")
          .select("client_id, entry_date, mood")
          .in("client_id", ids)
          .eq("is_shared", true)
          .gte("entry_date", since)
          .returns<{ client_id: string; entry_date: string; mood: number }[]>(),
        supabase
          .from("journal_entries")
          .select("client_id, shared_at")
          .in("client_id", ids)
          .eq("is_shared", true)
          .order("shared_at", { ascending: false })
          .limit(500)
          .returns<{ client_id: string; shared_at: string | null }[]>(),
        supabase
          .from("exercise_assignments")
          .select("client_id, completed_at")
          .eq("therapist_id", profile.id)
          .not("completed_at", "is", null)
          .returns<{ client_id: string; completed_at: string }[]>(),
        supabase
          .from("appointment_slots")
          .select("client_id, starts_at, booked_at")
          .eq("therapist_id", profile.id)
          .not("client_id", "is", null)
          .returns<{ client_id: string; starts_at: string; booked_at: string }[]>(),
        supabase
          .from("invitations")
          .select("used_by, label")
          .eq("therapist_id", profile.id)
          .not("used_by", "is", null)
          .returns<{ used_by: string; label: string | null }[]>(),
      ])
    : [null, null, null, null, null];

  const rows = (clients ?? []).map((c) => {
    const entries = (entriesRes?.data ?? []).filter((e) => e.client_id === c.id);
    const points = dailyMood(entries);
    const { trend, recent } = moodTrend(points);
    const activity = [
      ...(latestSharedRes?.data ?? []).filter((e) => e.client_id === c.id).map((e) => e.shared_at),
      ...(assignmentsRes?.data ?? []).filter((a) => a.client_id === c.id).map((a) => a.completed_at),
      ...(slotsRes?.data ?? []).filter((s) => s.client_id === c.id).map((s) => s.booked_at),
    ]
      .filter((v): v is string => Boolean(v))
      .sort()
      .reverse();
    const nextAppointment = (slotsRes?.data ?? [])
      .filter((s) => s.client_id === c.id && s.starts_at > nowIso)
      .map((s) => s.starts_at)
      .sort()[0];
    const label = (invitesRes?.data ?? []).find((i) => i.used_by === c.id)?.label ?? null;
    return { client: c, points, trend, recent, lastActivity: activity[0] ?? null, nextAppointment, label };
  });

  return (
    <div>
      <PageHeader
        title="Deine Klient:innen"
        intro="Du siehst nur, was deine Klient:innen ausdrücklich mit dir teilen. Private Tagebucheinträge bleiben unsichtbar."
      >
        <Link href="/praxis/einladungen" className="btn-primary">
          Klient:in einladen
        </Link>
      </PageHeader>
      <Flash code={sp.m} />

      {rows.length === 0 ? (
        <EmptyState
          title="Noch keine Klient:innen verbunden"
          text="Erstelle einen Einladungscode und gib ihn deiner Klient:in. Nach der Registrierung erscheint sie oder er hier."
          actionHref="/praxis/einladungen"
          actionLabel="Einladungscode erstellen"
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {rows.map(({ client, points, trend, recent, lastActivity, nextAppointment, label }) => (
            <li key={client.id}>
              <Link
                href={`/praxis/klient-innen/${client.id}`}
                className="card block h-full transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{client.display_name}</h2>
                    {label && <p className="text-sm text-ink-soft">Kürzel: {label}</p>}
                  </div>
                  <MoodChart points={points} compact />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-ink-soft">Letzte Aktivität</dt>
                    <dd className="font-semibold">{lastActivity ? formatRelativeDay(lastActivity) : "–"}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Ø Stimmung (7 Tage)</dt>
                    <dd className="font-semibold">{recent !== null ? `${recent.toLocaleString("de-AT")}/10` : "–"}</dd>
                  </div>
                  <div className="col-span-2">
                    <TrendLabel trend={trend} />
                  </div>
                  <div className="col-span-2">
                    <dt className="text-ink-soft">Nächster Termin</dt>
                    <dd className="font-semibold">{nextAppointment ? formatDateTime(nextAppointment) : "keiner gebucht"}</dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-sm text-ink-soft">
        „Letzte Aktivität“ berücksichtigt nur Dinge, die für dich sichtbar sind: geteilte Einträge, erledigte Übungen und
        Buchungen. Der Trend vergleicht die letzten 7 Tage mit den 3 Wochen davor (nur geteilte Einträge).
      </p>
    </div>
  );
}
