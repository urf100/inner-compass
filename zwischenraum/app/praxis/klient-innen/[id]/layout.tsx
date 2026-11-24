import { notFound } from "next/navigation";
import { ClientTabs } from "@/components/ClientTabs";
import { PageHeader } from "@/components/PageHeader";
import { requireRole } from "@/lib/auth";
import { formatDateLong, viennaDate } from "@/lib/dates";
import { isUuid } from "@/lib/form";
import { getOwnClient } from "@/lib/queries";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const { supabase, profile } = await requireRole("therapist");
  const client = await getOwnClient(supabase, profile.id, id);
  if (!client) notFound();

  return (
    <div>
      <PageHeader
        title={client.display_name}
        intro={client.created_at ? `Verbunden seit ${formatDateLong(viennaDate(client.created_at))}` : undefined}
        back={{ href: "/praxis", label: "Alle Klient:innen" }}
      />
      <ClientTabs clientId={client.id} />
      {children}
    </div>
  );
}
