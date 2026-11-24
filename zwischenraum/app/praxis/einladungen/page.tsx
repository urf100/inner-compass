import type { Metadata } from "next";
import { CopyButton } from "@/components/CopyButton";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { getSiteUrl } from "@/lib/env";
import { formatDateShort, formatDateTime, viennaDate } from "@/lib/dates";
import type { Invitation, Profile } from "@/lib/types";
import { createInvitation, deleteInvitation } from "@/app/praxis/actions";

export const metadata: Metadata = { title: "Einladungen" };

export default async function InvitationsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, profile } = await requireRole("therapist");
  const [{ data: invitations }, { data: clients }] = await Promise.all([
    supabase
      .from("invitations")
      .select("*")
      .eq("therapist_id", profile.id)
      .order("created_at", { ascending: false })
      .returns<Invitation[]>(),
    supabase
      .from("profiles")
      .select("id, display_name")
      .eq("therapist_id", profile.id)
      .returns<Pick<Profile, "id" | "display_name">[]>(),
  ]);
  const names = new Map((clients ?? []).map((c) => [c.id, c.display_name]));
  const site = getSiteUrl();
  const now = new Date().toISOString();

  return (
    <div>
      <PageHeader
        title="Einladungen"
        intro="Erstelle für jede Klient:in einen eigenen Code. Er kann genau einmal verwendet werden und ist 14 Tage gültig."
      />
      <Flash code={sp.m} />

      <form action={createInvitation} className="card mb-8 flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1">
          <label htmlFor="label" className="label">
            Internes Kürzel (optional)
          </label>
          <input id="label" name="label" maxLength={80} className="input" placeholder="z. B. „A. K., Dienstag“" aria-describedby="label_hint" />
          <p id="label_hint" className="hint">
            Nur für dich sichtbar – hilft dir, Codes zuzuordnen. Bitte keine vollständigen Namen oder Diagnosen.
          </p>
        </div>
        <SubmitButton className="btn-primary mb-7">Code erstellen</SubmitButton>
      </form>

      <h2 className="mb-3 text-xl font-semibold">Deine Codes</h2>
      {invitations?.length ? (
        <ul className="space-y-3">
          {invitations.map((inv) => {
            const used = Boolean(inv.used_by);
            const expired = !used && inv.expires_at < now;
            const link = `${site}/registrieren/einladung?code=${encodeURIComponent(inv.code)}`;
            return (
              <li key={inv.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-2xl font-bold tracking-widest" aria-label={`Code ${inv.code.split("").join(" ")}`}>
                      {inv.code}
                    </p>
                    {inv.label && <p className="text-sm text-ink-soft">{inv.label}</p>}
                  </div>
                  {used ? (
                    <span className="chip bg-sage-50 font-semibold text-sage-700">
                      eingelöst von {names.get(inv.used_by!) ?? "Klient:in"}
                    </span>
                  ) : expired ? (
                    <span className="chip bg-clay-50 text-clay-800">abgelaufen</span>
                  ) : (
                    <span className="chip">offen bis {formatDateShort(viennaDate(inv.expires_at))}</span>
                  )}
                </div>
                {used && inv.used_at && <p className="mt-2 text-sm text-ink-soft">Eingelöst am {formatDateTime(inv.used_at)}</p>}
                {!used && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {!expired && <CopyButton value={inv.code} label="Code kopieren" />}
                    {!expired && <CopyButton value={link} label="Einladungslink kopieren" />}
                    <form action={deleteInvitation}>
                      <input type="hidden" name="id" value={inv.id} />
                      <SubmitButton className="btn-quiet btn-sm" confirmMessage="Diesen Code löschen?">
                        Löschen
                      </SubmitButton>
                    </form>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-ink-soft">Noch keine Codes erstellt.</p>
      )}
    </div>
  );
}
