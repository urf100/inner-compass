import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Flash } from "@/components/Flash";
import { SubmitButton } from "@/components/SubmitButton";
import { getSession, homeFor } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/form";
import { signIn } from "./actions";

export const metadata: Metadata = { title: "Anmelden" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const session = await getSession();
  if (session) redirect(homeFor(session.profile.role));
  const weiter = safeRedirectPath(sp.weiter, "");

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold sm:text-3xl">Willkommen zurück</h1>
      <p className="mt-1 mb-6 text-ink-soft">Schön, dass du da bist. Melde dich mit deiner E-Mail-Adresse an.</p>
      <Flash code={sp.m} />
      <form action={signIn} className="card space-y-4">
        <input type="hidden" name="weiter" value={weiter} />
        <div>
          <label htmlFor="email" className="label">
            E-Mail-Adresse
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required className="input" />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Passwort
          </label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
        </div>
        <SubmitButton className="btn-primary w-full" pendingText="Anmeldung läuft …">
          Anmelden
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-ink-soft">
        Noch kein Konto?{" "}
        <Link href="/registrieren" className="link">
          Jetzt registrieren
        </Link>
      </p>
    </div>
  );
}
