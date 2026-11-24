import type { Metadata } from "next";
import { CrisisPlanForm } from "@/components/CrisisPlanForm";
import { NotAnEmergencyServiceNotice } from "@/components/EmergencyNumbers";
import { Flash } from "@/components/Flash";
import { PageHeader } from "@/components/PageHeader";
import { requireRole } from "@/lib/auth";
import { normalizePlan } from "@/lib/crisis";
import type { CrisisPlan } from "@/lib/types";

export const metadata: Metadata = { title: "Krisenplan bearbeiten" };

export default async function EditCrisisPlanPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, profile } = await requireRole("client");
  const { data } = await supabase.from("crisis_plans").select("*").eq("client_id", profile.id).maybeSingle<CrisisPlan>();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Krisenplan bearbeiten"
        intro="Deine Therapeut:in kann diesen Plan ebenfalls sehen und ergänzen – am besten befüllt ihr ihn gemeinsam."
        back={{ href: "/krise", label: "Zur Krisenhilfe" }}
      />
      <Flash code={sp.m} />
      <div className="mb-6">
        <NotAnEmergencyServiceNotice />
      </div>
      <CrisisPlanForm plan={normalizePlan(data)} clientId={profile.id} />
    </div>
  );
}
