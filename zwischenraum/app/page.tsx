import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, homeFor } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect(homeFor(session.profile.role));

  return (
    <div className="mx-auto max-w-3xl">
      <section className="py-6 sm:py-12">
        <p className="mb-2 font-semibold text-sage-700">Zwischen den Sitzungen</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Ein ruhiger Ort für das, was zwischen zwei Terminen passiert.</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Zwischenraum verbindet Klient:innen und ihre Psychotherapeut:innen: mit einem privaten Tagebuch, Übungen,
          Terminen und einem gemeinsamen Krisenplan. Du entscheidest, was du teilst.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/anmelden" className="btn-primary">
            Anmelden
          </Link>
          <Link href="/registrieren" className="btn-secondary">
            Neues Konto anlegen
          </Link>
        </div>
      </section>

      <section aria-labelledby="was" className="grid gap-4 sm:grid-cols-2">
        <h2 id="was" className="sr-only">
          Was Zwischenraum bietet
        </h2>
        {[
          {
            t: "Privates Tagebuch",
            d: "Stimmung, Gedanken und Themen festhalten. Jeder Eintrag ist zuerst nur für dich – teilen kannst du ihn mit einem Klick.",
          },
          {
            t: "Übungen",
            d: "Übungen von deiner Therapeut:in in Ruhe ausprobieren und kurz festhalten, wie es dir damit ging.",
          },
          {
            t: "Termine",
            d: "Freie Zeitfenster sehen, buchen und bei Bedarf bis 24 Stunden vorher stornieren.",
          },
          {
            t: "Krisenplan",
            d: "Warnzeichen, was hilft und wichtige Kontakte – gemeinsam vorbereitet und jederzeit erreichbar.",
          },
        ].map((f) => (
          <div key={f.t} className="card">
            <h3 className="text-lg font-semibold">{f.t}</h3>
            <p className="mt-1 text-ink-soft">{f.d}</p>
          </div>
        ))}
      </section>

      <p className="mt-8 rounded-xl bg-sand-100 p-4 text-ink-soft">
        Zwischenraum ersetzt keine Therapie und ist kein Notfalldienst. Wenn es dir gerade sehr schlecht geht, findest du
        über den Button <strong className="text-ink">„Krisenhilfe“</strong> oben jederzeit Notrufnummern.
      </p>
    </div>
  );
}
