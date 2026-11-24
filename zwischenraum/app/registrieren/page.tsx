import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Registrieren" };

export default function RegisterChoicePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold sm:text-3xl">Neues Konto anlegen</h1>
      <p className="mt-1 mb-6 text-ink-soft">Wie möchtest du Zwischenraum nutzen?</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/registrieren/einladung" className="card block transition-shadow hover:shadow-md">
          <h2 className="text-lg font-semibold">Ich bin Klient:in</h2>
          <p className="mt-1 text-ink-soft">
            Du hast von deiner Therapeut:in einen Einladungscode bekommen.
          </p>
          <span className="link mt-3 inline-block">Mit Einladungscode registrieren →</span>
        </Link>
        <Link href="/registrieren/praxis" className="card block transition-shadow hover:shadow-md">
          <h2 className="text-lg font-semibold">Ich bin Therapeut:in</h2>
          <p className="mt-1 text-ink-soft">Lege ein Konto für deine Praxis an und lade deine Klient:innen ein.</p>
          <span className="link mt-3 inline-block">Praxis-Konto anlegen →</span>
        </Link>
      </div>
      <p className="mt-6 text-center text-ink-soft">
        Du hast schon ein Konto?{" "}
        <Link href="/anmelden" className="link">
          Anmelden
        </Link>
      </p>
    </div>
  );
}
