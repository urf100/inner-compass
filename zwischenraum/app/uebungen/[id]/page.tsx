import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/dates";
import { isUuid } from "@/lib/form";
import { getTherapistName } from "@/lib/queries";
import type { Exercise, ExerciseAssignment } from "@/lib/types";
import { completeAssignment, reopenAssignment } from "../actions";

export const metadata: Metadata = { title: "Übung" };

export default async function AssignmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();
  const { supabase, profile } = await requireRole("client");

  const [{ data: a }, therapistName] = await Promise.all([
    supabase
      .from("exercise_assignments")
      .select("*, exercise:exercises(*)")
      .eq("id", id)
      .eq("client_id", profile.id)
      .maybeSingle<ExerciseAssignment & { exercise: Exercise | null }>(),
    getTherapistName(supabase, profile.therapist_id),
  ]);
  if (!a || !a.exercise) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={a.exercise.title}
        intro={`${a.exercise.category} · etwa ${a.exercise.duration_minutes} Minuten`}
        back={{ href: "/uebungen", label: "Alle Übungen" }}
      />
      <Flash code={sp.m} />

      {a.note && (
        <div className="mb-5 rounded-xl bg-sage-50 p-4">
          <p className="text-sm font-semibold text-sage-700">Hinweis von {therapistName ?? "deiner Therapeut:in"}</p>
          <p className="mt-1 whitespace-pre-line">{a.note}</p>
        </div>
      )}

      <article className="card mb-6">
        <h2 className="sr-only">Anleitung</h2>
        <p className="whitespace-pre-line">{a.exercise.description}</p>
      </article>

      <form action={completeAssignment} className="card space-y-4">
        <input type="hidden" name="id" value={a.id} />
        <h2 className="text-lg font-semibold">{a.completed_at ? "Deine Reflexion" : "Wie war es für dich?"}</h2>
        {a.completed_at && (
          <p className="text-sm text-sage-700">
            <span aria-hidden="true">✓ </span>Erledigt am {formatDateTime(a.completed_at)}
          </p>
        )}
        <div>
          <label htmlFor="reflection" className="label">
            Kurze Reflexion (optional)
          </label>
          <textarea
            id="reflection"
            name="reflection"
            rows={5}
            maxLength={4000}
            defaultValue={a.reflection ?? ""}
            className="input"
            placeholder="Was hast du bemerkt? Was war leicht, was schwer?"
            aria-describedby="reflection_hint"
          />
          <p id="reflection_hint" className="hint">
            Deine Reflexion ist für {therapistName ?? "deine Therapeut:in"} sichtbar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {a.completed_at ? (
            <SubmitButton name="intent" value="save">
              Reflexion speichern
            </SubmitButton>
          ) : (
            <>
              <SubmitButton name="intent" value="done">
                Als erledigt markieren
              </SubmitButton>
              <SubmitButton name="intent" value="save" className="btn-secondary">
                Nur Reflexion speichern
              </SubmitButton>
            </>
          )}
        </div>
      </form>

      {a.completed_at && (
        <form action={reopenAssignment} className="mt-4">
          <input type="hidden" name="id" value={a.id} />
          <SubmitButton className="btn-quiet btn-sm">Wieder als offen markieren</SubmitButton>
        </form>
      )}
    </div>
  );
}
