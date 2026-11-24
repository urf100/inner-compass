import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExerciseForm } from "@/components/ExerciseForm";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { isUuid } from "@/lib/form";
import type { Exercise } from "@/lib/types";
import { deleteExercise } from "@/app/praxis/actions";

export const metadata: Metadata = { title: "Übung bearbeiten" };

export default async function EditExercisePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();
  const { supabase, profile } = await requireRole("therapist");
  const { data: exercise } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .eq("therapist_id", profile.id)
    .maybeSingle<Exercise>();
  if (!exercise) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Übung bearbeiten" back={{ href: "/praxis/uebungen", label: "Zur Bibliothek" }} />
      <Flash code={sp.m} />
      <ExerciseForm exercise={exercise} />
      <form action={deleteExercise} className="mt-10 border-t border-sand-200 pt-6">
        <input type="hidden" name="id" value={exercise.id} />
        <SubmitButton className="btn-danger" confirmMessage="Diese Übung endgültig aus der Bibliothek löschen?">
          Übung löschen
        </SubmitButton>
        <p className="hint">Übungen, die noch zugewiesen sind, können nicht gelöscht werden.</p>
      </form>
    </div>
  );
}
