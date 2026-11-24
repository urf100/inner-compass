import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrisisPlanForm } from "@/components/CrisisPlanForm";
import { CrisisPlanView } from "@/components/CrisisPlanView";
import { Flash } from "@/components/Flash";
import { requireRole } from "@/lib/auth";
import { normalizePlan } from "@/lib/crisis";
import { isUuid } from "@/lib/form";
import { getOwnClient } from "@/lib/queries";
import type { CrisisPlan } from "@/lib/types";

export const metadata: Metadata = { title: "Krisenplan" };

export default async function ClientCrisisPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();
  const { supabase, profile } = await requireRole("therapist");
  const client = await getOwnClient(supabase, profile.id, id);
  if (!client) notFound();

  const { data } = await supabase.from("crisis_plans").select("*").eq("client_id", client.id).maybeSingle<CrisisPlan>();
  const plan = normalizePlan(data);
  const updatedByName =
    plan?.updated_by === profile.id ? "dir" : plan?.updated_by === client.id ? client.display_name : null;

  return (
    <div className="space-y-6">
      <Flash code={sp.m} />
      <p className="rounded-xl bg-sky-50 p-4 text-sky-700">
        Den Krisenplan befüllt ihr gemeinsam: {client.display_name} sieht alle Änderungen und kann sie ebenfalls
        bearbeiten. Er erscheint bei {client.display_name} auf der Seite „Krisenhilfe“.
      </p>
      <section aria-labelledby="aktuell" className="card">
        <h2 id="aktuell" className="mb-4 text-lg font-semibold">
          Aktueller Stand
        </h2>
        <CrisisPlanView plan={plan} updatedByName={updatedByName} />
      </section>
      <section aria-labelledby="bearbeiten">
        <h2 id="bearbeiten" className="mb-3 text-lg font-semibold">
          Bearbeiten
        </h2>
        <CrisisPlanForm plan={plan} clientId={client.id} />
      </section>
    </div>
  );
}
