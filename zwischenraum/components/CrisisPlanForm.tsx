import { MAX_CONTACTS } from "@/lib/crisis";
import type { CrisisPlan } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import { saveCrisisPlan } from "@/app/krise/actions";

export function CrisisPlanForm({ plan, clientId }: { plan: CrisisPlan | null; clientId: string }) {
  const contacts = Array.from({ length: MAX_CONTACTS }, (_, i) => plan?.contacts[i] ?? { name: "", phone: "", note: "" });
  return (
    <form action={saveCrisisPlan} className="card space-y-6">
      <input type="hidden" name="client_id" value={clientId} />
      <div>
        <label htmlFor="warning_signs" className="label">
          Warnzeichen
        </label>
        <textarea
          id="warning_signs"
          name="warning_signs"
          rows={4}
          maxLength={4000}
          defaultValue={plan?.warning_signs ?? ""}
          className="input"
          aria-describedby="warning_hint"
        />
        <p id="warning_hint" className="hint">
          Woran merke ich, dass eine Krise beginnt? Gedanken, Gefühle, Verhalten, Situationen.
        </p>
      </div>
      <div>
        <label htmlFor="helpful_actions" className="label">
          Was hilft
        </label>
        <textarea
          id="helpful_actions"
          name="helpful_actions"
          rows={4}
          maxLength={4000}
          defaultValue={plan?.helpful_actions ?? ""}
          className="input"
          aria-describedby="helpful_hint"
        />
        <p id="helpful_hint" className="hint">
          Was kann ich selbst tun, um mich zu beruhigen oder abzulenken? Welche Orte tun mir gut?
        </p>
      </div>
      <fieldset>
        <legend className="label">Kontaktpersonen</legend>
        <p className="hint mb-3">Menschen, die du in einer schwierigen Situation anrufen kannst.</p>
        <div className="space-y-4">
          {contacts.map((c, i) => (
            <div key={i} className="grid gap-3 rounded-xl bg-sand-100 p-3 sm:grid-cols-3">
              <div>
                <label htmlFor={`contact_name_${i}`} className="text-sm font-semibold">
                  Name {i + 1}
                </label>
                <input id={`contact_name_${i}`} name={`contact_name_${i}`} maxLength={80} defaultValue={c.name} className="input mt-1" />
              </div>
              <div>
                <label htmlFor={`contact_phone_${i}`} className="text-sm font-semibold">
                  Telefon {i + 1}
                </label>
                <input
                  id={`contact_phone_${i}`}
                  name={`contact_phone_${i}`}
                  type="tel"
                  maxLength={40}
                  defaultValue={c.phone}
                  className="input mt-1"
                />
              </div>
              <div>
                <label htmlFor={`contact_note_${i}`} className="text-sm font-semibold">
                  Notiz {i + 1}
                </label>
                <input
                  id={`contact_note_${i}`}
                  name={`contact_note_${i}`}
                  maxLength={120}
                  defaultValue={c.note}
                  placeholder="z. B. „Schwester, abends erreichbar“"
                  className="input mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      <SubmitButton>Krisenplan speichern</SubmitButton>
    </form>
  );
}
