import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { getSession } from "@/lib/auth";
import { signOut, updateDisplayName } from "@/app/actions";

export const metadata: Metadata = { title: "Konto" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const session = await getSession();
  if (!session) redirect("/anmelden?weiter=/konto");
  const { profile, supabase, user } = session;

  let therapistName: string | null = null;
  if (profile.role === "client" && profile.therapist_id) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", profile.therapist_id)
      .maybeSingle<{ display_name: string }>();
    therapistName = data?.display_name ?? null;
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Dein Konto" />
      <Flash code={sp.m} />

      <dl className="card mb-6 grid gap-3">
        <div>
          <dt className="text-sm text-ink-soft">Rolle</dt>
          <dd className="font-semibold">{profile.role === "therapist" ? "Therapeut:in" : "Klient:in"}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-soft">E-Mail-Adresse</dt>
          <dd className="font-semibold break-all">{user.email}</dd>
        </div>
        {profile.role === "client" && (
          <div>
            <dt className="text-sm text-ink-soft">Deine Therapeut:in</dt>
            <dd className="font-semibold">{therapistName ?? "–"}</dd>
          </div>
        )}
      </dl>

      <form action={updateDisplayName} className="card mb-6 space-y-4">
        <div>
          <label htmlFor="display_name" className="label">
            Angezeigter Name
          </label>
          <input
            id="display_name"
            name="display_name"
            defaultValue={profile.display_name}
            required
            maxLength={80}
            className="input"
          />
        </div>
        <SubmitButton>Name speichern</SubmitButton>
      </form>

      <form action={signOut}>
        <SubmitButton className="btn-secondary w-full" pendingText="Abmelden …">
          Abmelden
        </SubmitButton>
      </form>
    </div>
  );
}
