import { EMERGENCY_NUMBERS } from "@/lib/constants";

export function EmergencyNumbers() {
  return (
    <section aria-labelledby="notruf" className="rounded-2xl bg-clay-50 p-5 ring-1 ring-clay-100">
      <h2 id="notruf" className="text-xl font-bold text-clay-800">
        Sofort Hilfe in Österreich
      </h2>
      <p className="mt-1 text-clay-800">Wenn du in Gefahr bist oder nicht mehr weiterweißt: Ruf bitte jetzt an.</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {EMERGENCY_NUMBERS.map((n) => (
          <li key={n.number}>
            <a
              href={`tel:${n.number}`}
              className="flex h-full flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-clay-100 transition-shadow hover:shadow-md"
            >
              <span className="text-3xl font-bold text-clay-800">{n.number}</span>
              <span className="font-semibold">{n.label}</span>
              <span className="text-sm text-ink-soft">{n.description}</span>
              <span className="mt-2 text-sm font-semibold text-clay-800">
                Anrufen<span className="sr-only">: {n.label} {n.number}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function NotAnEmergencyServiceNotice() {
  return (
    <p className="rounded-xl bg-white p-4 font-semibold ring-2 ring-clay-600" role="note">
      Diese App ist kein Notfalldienst. Deine Therapeut:in wird nicht automatisch benachrichtigt.
    </p>
  );
}
