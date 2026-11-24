import { formatDateTime } from "@/lib/dates";
import { isPlanEmpty, telHref } from "@/lib/crisis";
import type { CrisisPlan } from "@/lib/types";

export function CrisisPlanView({ plan, updatedByName }: { plan: CrisisPlan | null; updatedByName?: string | null }) {
  if (isPlanEmpty(plan)) {
    return (
      <p className="text-ink-soft">
        Noch nichts eingetragen. Ihr könnt den Krisenplan gemeinsam in einer Sitzung befüllen.
      </p>
    );
  }
  const p = plan!;
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold">Meine Warnzeichen</h3>
        <p className="mt-1 whitespace-pre-line">{p.warning_signs || "–"}</p>
      </div>
      <div>
        <h3 className="font-semibold">Was mir hilft</h3>
        <p className="mt-1 whitespace-pre-line">{p.helpful_actions || "–"}</p>
      </div>
      <div>
        <h3 className="font-semibold">Menschen, die ich anrufen kann</h3>
        {p.contacts.length ? (
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {p.contacts.map((c, i) => {
              const href = telHref(c.phone);
              return (
                <li key={i} className="rounded-xl bg-sand-100 p-3">
                  <p className="font-semibold">{c.name || "Kontakt"}</p>
                  {c.note && <p className="text-sm text-ink-soft">{c.note}</p>}
                  {href ? (
                    <a href={href} className="link mt-1 inline-block">
                      {c.phone}
                      <span className="sr-only"> anrufen</span>
                    </a>
                  ) : (
                    c.phone && <p>{c.phone}</p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-1 text-ink-soft">–</p>
        )}
      </div>
      <p className="text-xs text-ink-soft">
        Zuletzt geändert: {formatDateTime(p.updated_at)}
        {updatedByName ? ` von ${updatedByName}` : ""}
      </p>
    </div>
  );
}
