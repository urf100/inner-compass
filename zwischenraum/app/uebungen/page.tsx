import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { requireRole } from "@/lib/auth";
import { formatRelativeDay } from "@/lib/dates";
import type { Exercise, ExerciseAssignment } from "@/lib/types";

export const metadata: Metadata = { title: "Übungen" };

type Row = ExerciseAssignment & { exercise: Pick<Exercise, "title" | "category" | "duration_minutes"> | null };

function AssignmentCard({ a }: { a: Row }) {
  return (
    <li>
      <Link href={`/uebungen/${a.id}`} className="card block transition-shadow hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold">{a.exercise?.title ?? "Übung"}</h3>
          {a.completed_at ? (
            <span className="chip bg-sage-50 font-semibold text-sage-700">
              <span aria-hidden="true">✓ </span>erledigt {formatRelativeDay(a.completed_at)}
            </span>
          ) : (
            <span className="chip">offen</span>
          )}
        </div>
        {a.exercise && (
          <p className="mt-1 text-sm text-ink-soft">
            {a.exercise.category} · etwa {a.exercise.duration_minutes} Minuten
          </p>
        )}
        {a.note && <p className="mt-2 line-clamp-2">„{a.note}“</p>}
      </Link>
    </li>
  );
}

export default async function ClientExercisesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, profile } = await requireRole("client");
  const { data } = await supabase
    .from("exercise_assignments")
    .select("*, exercise:exercises(title, category, duration_minutes)")
    .eq("client_id", profile.id)
    .order("assigned_at", { ascending: false })
    .returns<Row[]>();

  const open = (data ?? []).filter((a) => !a.completed_at);
  const done = (data ?? []).filter((a) => a.completed_at);

  return (
    <div>
      <PageHeader title="Deine Übungen" intro="Übungen, die deine Therapeut:in für dich ausgesucht hat. Nimm dir Zeit – es gibt keinen Druck." />
      <Flash code={sp.m} />
      {!data?.length ? (
        <EmptyState
          title="Noch keine Übungen"
          text="Sobald deine Therapeut:in dir eine Übung zuweist, findest du sie hier."
        />
      ) : (
        <div className="space-y-8">
          <section aria-labelledby="offen">
            <h2 id="offen" className="mb-3 text-xl font-semibold">
              Offen ({open.length})
            </h2>
            {open.length ? (
              <ul className="space-y-3">
                {open.map((a) => (
                  <AssignmentCard key={a.id} a={a} />
                ))}
              </ul>
            ) : (
              <p className="text-ink-soft">Alles erledigt – schön, dass du drangeblieben bist.</p>
            )}
          </section>
          {done.length > 0 && (
            <section aria-labelledby="erledigt">
              <h2 id="erledigt" className="mb-3 text-xl font-semibold">
                Erledigt ({done.length})
              </h2>
              <ul className="space-y-3">
                {done.map((a) => (
                  <AssignmentCard key={a.id} a={a} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
