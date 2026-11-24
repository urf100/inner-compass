import type { Metadata } from "next";
import Link from "next/link";
import { Flash } from "@/components/Flash";
import { RegisterFields } from "@/components/RegisterFields";
import { SubmitButton } from "@/components/SubmitButton";
import { signUpTherapist } from "../actions";

export const metadata: Metadata = { title: "Praxis-Konto anlegen" };

export default async function RegisterTherapistPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-md">
      <Link href="/registrieren" className="link mb-3 inline-block text-sm">
        ← Zurück
      </Link>
      <h1 className="text-2xl font-bold sm:text-3xl">Praxis-Konto anlegen</h1>
      <p className="mt-1 mb-6 text-ink-soft">
        Nach der Registrierung kannst du Einladungscodes für deine Klient:innen erstellen. Sechs Beispiel-Übungen sind
        schon in deiner Bibliothek.
      </p>
      <Flash code={sp.m} />
      <form action={signUpTherapist} className="card space-y-4">
        <RegisterFields nameHint="So sehen dich deine Klient:innen, z. B. „Mag.a Maria Huber“." />
        <SubmitButton className="btn-primary w-full" pendingText="Konto wird angelegt …">
          Konto anlegen
        </SubmitButton>
      </form>
    </div>
  );
}
