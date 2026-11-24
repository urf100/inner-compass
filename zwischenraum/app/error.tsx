"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl py-12 text-center" role="alert">
      <h1 className="text-2xl font-bold">Da ist etwas schiefgelaufen</h1>
      <p className="mt-2 text-ink-soft">
        Das tut uns leid. Du kannst es gleich noch einmal versuchen. Wenn du Hilfe brauchst, findest du unter
        „Krisenhilfe“ jederzeit Notrufnummern.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Erneut versuchen
        </button>
        <Link href="/krise" className="btn-secondary">
          Krisenhilfe
        </Link>
      </div>
    </div>
  );
}
