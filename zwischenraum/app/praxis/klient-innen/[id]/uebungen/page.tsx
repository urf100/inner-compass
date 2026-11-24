import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flash } from "@/components/Flash";
import { SubmitButton } from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { formatDateShort, formatRelativeDay, viennaDate } from "@/lib/dates";
import { isUuid } from "@/lib/form";
import { getOwnClient } from "@/lib/queries";
import type { Exercise, ExerciseAssignment } from "@/lib/types";
import { assignExercise, removeAssignment } from "@/app/praxis/actions";

export const metadata: Metadata = { title: "Übungen der Klient:in" };

export default async function ClientExercisesPage({
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

  const [{ data: library }, { data: assignments }] = await Promise.all([
    supabase
      .from("exercises")
      .select("id, title, category, duration_minutes")
      .eq("therapist_id", profile.id)
      .order("title")
      .returns<Pick<Exercise, "id" | "title" | "category" | "duration_minutes">[]>(),
    supabase
      .from("exercise_assignments")
      .select("*, exercise:exercises(title, category, duration_minutes)")
      .eq("therapist_id", profile.id)
      .eq("client_id", client.id)
      .order("assigned_at", { ascending: false })
      .returns<(ExerciseAssignment & { exercise: Pick<Exercise, "title" | "category" | "duration_minutes"> | null })[]>(),
  ]);

  return (
    <div className="space-y-6">
      <Flash code={sp.m} />

      <form action={assignExercise} className="card space-y-4">
        <h2 className="text-lg font-semibold">Übung zuweisen</h2>
        <input type="hidden" name="client_id" value={client.id} />
        {library?.length ? (
          <>
            <div>
              <label htmlFor="exercise_id" className="label">
                Übung
              </label>
              <select id="exercise_id" name="exercise_id" required className="input">
                {library.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({e.category}, {e.duration_minutes} Min.)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="note" className="label">
                Persönlicher Hinweis (optional)
              </label>
              <textarea
                id="note"
                name="note"
                rows={3}
                maxLength={2000}
                className="input"
                placeholder="z. B. „Probier die Übung gern abends vor dem Schlafengehen.“"
              />
              <p className="hint">Dieser Hinweis ist für {client.display_name} sichtbar.</p>
            </div>
            <SubmitButton>Zuweisen</SubmitButton>
          </>
        ) : (
          <p className="text-ink-soft">
            Deine Bibliothek ist leer.{" "}
            <Link href="/praxis/uebungen/neu" className="link">
              Erste Übung anlegen
            </Link>
          </p>
        )}
      </form>

      <section aria-labelledby="zugewiesen">
        <h2 id="zugewiesen" className="mb-3 text-xl font-semibold">
          Zugewiesene Übungen
        </h2>
        {assignments?.length ? (
          <ul className="space-y-3">
            {assignments.map((a) => (
              <li key={a.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{a.exercise?.title}</h3>
                    <p className="text-sm text-ink-soft">
                      Zugewiesen am {formatDateShort(viennaDate(a.assigned_at))}
                      {a.exercise && ` · ${a.exercise.category} · ${a.exercise.duration_minutes} Min.`}
                    </p>
                  </div>
                  {a.completed_at ? (
                    <span className="chip bg-sage-50 font-semibold text-sage-700">
                      erledigt {formatRelativeDay(a.completed_at)}
                    </span>
                  ) : (
                    <span className="chip">offen</span>
                  )}
                </div>
                {a.note && (
                  <p className="mt-3 text-sm">
                    <span className="font-semibold">Dein Hinweis:</span> {a.note}
                  </p>
                )}
                {a.reflection && (
                  <blockquote className="mt-3 rounded-xl bg-sand-100 p-3">
                    <p className="text-sm font-semibold">Reflexion von {client.display_name}</p>
                    <p className="mt-1 whitespace-pre-line">{a.reflection}</p>
                  </blockquote>
                )}
                <form action={removeAssignment} className="mt-3">
                  <input type="hidden" name="client_id" value={client.id} />
                  <input type="hidden" name="id" value={a.id} />
                  <SubmitButton
                    className="btn-quiet btn-sm"
                    confirmMessage="Diese Zuweisung entfernen? Eine eventuelle Reflexion geht dabei verloren."
                  >
                    Zuweisung entfernen
                  </SubmitButton>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-soft">Noch keine Übungen zugewiesen.</p>
        )}
      </section>
    </div>
  );
}
