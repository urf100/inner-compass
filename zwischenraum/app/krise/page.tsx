import type { Metadata } from "next";
import Link from "next/link";
import { CrisisPlanView } from "@/components/CrisisPlanView";
import { EmergencyNumbers, NotAnEmergencyServiceNotice } from "@/components/EmergencyNumbers";
import { Flash } from "@/components/Flash";
import { getSession } from "@/lib/auth";
import { normalizePlan } from "@/lib/crisis";
import type { CrisisPlan } from "@/lib/types";

export const metadata: Metadata = { title: "Krisenhilfe" };

export default async function CrisisPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const session = await getSession();

  let plan: CrisisPlan | null = null;
  let updatedByName: string | null = null;
  if (session?.profile.role === "client") {
    const { data } = await session.supabase
      .from("crisis_plans")
      .select("*")
      .eq("client_id", session.profile.id)
      .maybeSingle<CrisisPlan>();
    plan = normalizePlan(data);
    if (plan?.updated_by) {
      const { data: p } = await session.supabase
        .from("profiles")
        .select("display_name")
        .eq("id", plan.updated_by)
        .maybeSingle<{ display_name: string }>();
      updatedByName = plan.updated_by === session.profile.id ? "dir" : (p?.display_name ?? null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Krisenhilfe</h1>
        <p className="mt-1 text-ink-soft">Du bist nicht allein. Hier findest du sofort Unterstützung.</p>
      </div>
      <Flash code={sp.m} />

      <EmergencyNumbers />
      <NotAnEmergencyServiceNotice />

      {session?.profile.role === "client" && (
        <section aria-labelledby="plan" className="card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 id="plan" className="text-xl font-semibold">
              Dein persönlicher Krisenplan
            </h2>
            <Link href="/krise/bearbeiten" className="btn-secondary btn-sm">
              Bearbeiten
            </Link>
          </div>
          <CrisisPlanView plan={plan} updatedByName={updatedByName} />
        </section>
      )}

      {session?.profile.role === "therapist" && (
        <p className="card text-ink-soft">
          Die Krisenpläne deiner Klient:innen findest du in der jeweiligen Klient:innen-Ansicht unter „Krisenplan“. Dort
          könnt ihr ihn gemeinsam befüllen.
        </p>
      )}

      {!session && (
        <p className="card text-ink-soft">
          Wenn du ein Konto hast,{" "}
          <Link href="/anmelden?weiter=/krise" className="link">
            melde dich an
          </Link>
          , um deinen persönlichen Krisenplan zu sehen.
        </p>
      )}

      <section aria-labelledby="sofort" className="card">
        <h2 id="sofort" className="text-lg font-semibold">
          Was du jetzt sofort tun kannst
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Atme langsam aus – länger aus als ein. Zähl dabei bis fünf.</li>
          <li>Spür deine Füße auf dem Boden. Benenne fünf Dinge, die du gerade siehst.</li>
          <li>Ruf eine Person an, der du vertraust, oder die TelefonSeelsorge unter 142.</li>
          <li>Bring dich an einen sicheren Ort und entferne Dinge, mit denen du dir schaden könntest.</li>
        </ul>
      </section>
    </div>
  );
}
