import type { Metadata } from "next";
import { ExerciseForm } from "@/components/ExerciseForm";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Neue Übung" };

export default async function NewExercisePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  await requireRole("therapist");
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Neue Übung" back={{ href: "/praxis/uebungen", label: "Zur Bibliothek" }} />
      <Flash code={sp.m} />
      <ExerciseForm />
    </div>
  );
}
