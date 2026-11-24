import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { requireRole } from "@/lib/auth";
import type { Exercise } from "@/lib/types";

export const metadata: Metadata = { title: "Übungsbibliothek" };

export default async function ExerciseLibraryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, profile } = await requireRole("therapist");
  const [{ data: exercises }, { data: assignments }] = await Promise.all([
    supabase.from("exercises").select("*").eq("therapist_id", profile.id).order("title").returns<Exercise[]>(),
    supabase
      .from("exercise_assignments")
      .select("exercise_id")
      .eq("therapist_id", profile.id)
      .returns<{ exercise_id: string }[]>(),
  ]);
  const counts = new Map<string, number>();
  for (const a of assignments ?? []) counts.set(a.exercise_id, (counts.get(a.exercise_id) ?? 0) + 1);

  return (
    <div>
      <PageHeader
        title="Übungsbibliothek"
        intro="Deine Übungen. Zuweisen kannst du sie in der Ansicht einer Klient:in unter „Übungen“."
      >
        <Link href="/praxis/uebungen/neu" className="btn-primary">
          <span aria-hidden="true">+</span> Neue Übung
        </Link>
      </PageHeader>
      <Flash code={sp.m} />
      {exercises?.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {exercises.map((e) => (
            <li key={e.id}>
              <Link href={`/praxis/uebungen/${e.id}`} className="card block h-full transition-shadow hover:shadow-md">
                <h2 className="text-lg font-semibold">{e.title}</h2>
                <p className="mt-1 flex flex-wrap gap-1.5 text-sm">
                  <span className="chip">{e.category}</span>
                  <span className="chip">{e.duration_minutes} Min.</span>
                  {counts.get(e.id) ? <span className="chip bg-sage-50 text-sage-700">{counts.get(e.id)}× zugewiesen</span> : null}
                </p>
                <p className="mt-2 line-clamp-3 text-ink-soft">{e.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Deine Bibliothek ist noch leer"
          text="Lege Übungen an, die du deinen Klient:innen mitgeben möchtest."
          actionHref="/praxis/uebungen/neu"
          actionLabel="Erste Übung anlegen"
        />
      )}
    </div>
  );
}
