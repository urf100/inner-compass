import type { Metadata } from "next";
import Link from "next/link";
import { Flash } from "@/components/Flash";
import { RegisterFields } from "@/components/RegisterFields";
import { SubmitButton } from "@/components/SubmitButton";
import { signUpClient } from "../actions";

export const metadata: Metadata = { title: "Mit Einladungscode registrieren" };

export default async function RegisterClientPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const code = typeof sp.code === "string" ? sp.code.slice(0, 20) : "";
  return (
    <div className="mx-auto max-w-md">
      <Link href="/registrieren" className="link mb-3 inline-block text-sm">
        ← Zurück
      </Link>
      <h1 className="text-2xl font-bold sm:text-3xl">Willkommen im Zwischenraum</h1>
      <p className="mt-1 mb-6 text-ink-soft">
        Mit dem Einladungscode deiner Therapeut:in wirst du automatisch mit ihr bzw. ihm verbunden. Deine
        Tagebucheinträge bleiben trotzdem privat, bis du sie selbst teilst.
      </p>
      <Flash code={sp.m} />
      <form action={signUpClient} className="card space-y-4">
        <div>
          <label htmlFor="invite_code" className="label">
            Einladungscode
          </label>
          <input
            id="invite_code"
            name="invite_code"
            required
            defaultValue={code}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="ABCDE-12345"
            className="input font-mono tracking-wider uppercase"
            aria-describedby="invite_hint"
          />
          <p id="invite_hint" className="hint">
            Steht auf dem Zettel oder in der Nachricht deiner Therapeut:in.
          </p>
        </div>
        <RegisterFields nameHint="Wie möchtest du genannt werden? Ein Vorname oder Spitzname reicht." />
        <SubmitButton className="btn-primary w-full" pendingText="Konto wird angelegt …">
          Konto anlegen
        </SubmitButton>
      </form>
    </div>
  );
}
