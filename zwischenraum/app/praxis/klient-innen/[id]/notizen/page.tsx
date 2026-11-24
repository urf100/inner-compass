import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Flash } from "@/components/Flash";
import { SubmitButton } from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { formatDateLong, todayInVienna } from "@/lib/dates";
import { isUuid } from "@/lib/form";
import { getOwnClient } from "@/lib/queries";
import type { SessionNote } from "@/lib/types";
import { deleteNote, saveNote } from "@/app/praxis/actions";

export const metadata: Metadata = { title: "Sitzungsnotizen" };

export default async function NotesPage({
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

  const { data: notes } = await supabase
    .from("session_notes")
    .select("*")
    .eq("therapist_id", profile.id)
    .eq("client_id", client.id)
    .order("session_date", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<SessionNote[]>();

  return (
    <div className="space-y-6">
      <Flash code={sp.m} />
      <p className="rounded-xl bg-sky-50 p-4 text-sky-700">
        <strong>Nur für dich:</strong> Sitzungsnotizen sind ausschließlich für dich als Verfasser:in lesbar.{" "}
        {client.display_name} sieht sie nicht.
      </p>

      <form action={saveNote} className="card space-y-4">
        <h2 className="text-lg font-semibold">Neue Notiz</h2>
        <input type="hidden" name="client_id" value={client.id} />
        <div>
          <label htmlFor="session_date" className="label">
            Sitzungsdatum
          </label>
          <input
            id="session_date"
            name="session_date"
            type="date"
            required
            defaultValue={todayInVienna()}
            className="input max-w-52"
          />
        </div>
        <div>
          <label htmlFor="content" className="label">
            Notiz
          </label>
          <textarea id="content" name="content" rows={6} required maxLength={20000} className="input" />
        </div>
        <SubmitButton>Notiz speichern</SubmitButton>
      </form>

      <section aria-labelledby="bisher">
        <h2 id="bisher" className="mb-3 text-xl font-semibold">
          Bisherige Notizen
        </h2>
        {notes?.length ? (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="card">
                <h3 className="font-semibold">{formatDateLong(n.session_date)}</h3>
                <p className="mt-2 whitespace-pre-line">{n.content}</p>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-sage-700">Bearbeiten oder löschen</summary>
                  <form action={saveNote} className="mt-3 space-y-3">
                    <input type="hidden" name="client_id" value={client.id} />
                    <input type="hidden" name="id" value={n.id} />
                    <div>
                      <label htmlFor={`date-${n.id}`} className="label">
                        Sitzungsdatum
                      </label>
                      <input
                        id={`date-${n.id}`}
                        name="session_date"
                        type="date"
                        required
                        defaultValue={n.session_date}
                        className="input max-w-52"
                      />
                    </div>
                    <div>
                      <label htmlFor={`content-${n.id}`} className="label">
                        Notiz
                      </label>
                      <textarea
                        id={`content-${n.id}`}
                        name="content"
                        rows={6}
                        required
                        maxLength={20000}
                        defaultValue={n.content}
                        className="input"
                      />
                    </div>
                    <SubmitButton className="btn-primary btn-sm">Änderungen speichern</SubmitButton>
                  </form>
                  <form action={deleteNote} className="mt-3">
                    <input type="hidden" name="client_id" value={client.id} />
                    <input type="hidden" name="id" value={n.id} />
                    <SubmitButton className="btn-danger btn-sm" confirmMessage="Diese Notiz endgültig löschen?">
                      Notiz löschen
                    </SubmitButton>
                  </form>
                </details>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-soft">Noch keine Notizen zu {client.display_name}.</p>
        )}
      </section>
    </div>
  );
}
