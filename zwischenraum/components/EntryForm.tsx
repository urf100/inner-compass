import { MOOD_LABELS, SUGGESTED_TAGS } from "@/lib/constants";
import { todayInVienna } from "@/lib/dates";
import type { JournalEntry } from "@/lib/types";
import { ShareSwitch } from "@/components/ShareSwitch";
import { SubmitButton } from "@/components/SubmitButton";

export function EntryForm({
  action,
  entry,
  therapistName,
}: {
  action: (formData: FormData) => Promise<void>;
  entry?: JournalEntry;
  therapistName?: string | null;
}) {
  const suggested = SUGGESTED_TAGS as readonly string[];
  const customTags = (entry?.tags ?? []).filter((t) => !suggested.includes(t));
  const today = todayInVienna();

  return (
    <form action={action} className="space-y-6">
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <div className="card space-y-6">
        <div>
          <label htmlFor="entry_date" className="label">
            Datum
          </label>
          <input
            id="entry_date"
            name="entry_date"
            type="date"
            required
            max={today}
            defaultValue={entry?.entry_date ?? today}
            className="input max-w-52"
          />
        </div>

        <fieldset>
          <legend className="label">Wie geht es dir? (1 = sehr schwer, 10 = ausgezeichnet)</legend>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <label key={n} className="relative">
                <input
                  type="radio"
                  name="mood"
                  value={n}
                  required
                  defaultChecked={entry?.mood === n}
                  className="peer sr-only"
                />
                <span
                  className="flex h-12 cursor-pointer items-center justify-center rounded-xl bg-white text-lg font-bold text-ink ring-1 ring-sand-300 transition-colors peer-checked:bg-sage-600 peer-checked:text-white peer-checked:ring-sage-600 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-700 hover:bg-sand-100 peer-checked:hover:bg-sage-700"
                  title={MOOD_LABELS[n]}
                >
                  {n}
                  <span className="sr-only">: {MOOD_LABELS[n]}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="content" className="label">
            Was beschäftigt dich?
          </label>
          <textarea
            id="content"
            name="content"
            rows={7}
            maxLength={10000}
            defaultValue={entry?.content ?? ""}
            className="input"
            placeholder="Schreib so viel oder so wenig, wie du magst."
          />
        </div>

        <fieldset>
          <legend className="label">Themen (optional)</legend>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => (
              <label key={tag} className="relative">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  defaultChecked={entry?.tags.includes(tag)}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-10 cursor-pointer items-center rounded-full bg-white px-4 ring-1 ring-sand-300 peer-checked:bg-sage-100 peer-checked:font-semibold peer-checked:text-sage-700 peer-checked:ring-sage-500 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-700">
                  {tag}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-3">
            <label htmlFor="tags_custom" className="text-sm font-semibold">
              Eigene Themen, durch Komma getrennt
            </label>
            <input
              id="tags_custom"
              name="tags_custom"
              defaultValue={customTags.join(", ")}
              maxLength={200}
              className="input mt-1"
              placeholder="z. B. Studium, Sport"
            />
          </div>
        </fieldset>
      </div>

      <ShareSwitch defaultChecked={entry?.is_shared ?? false} therapistName={therapistName} />

      <SubmitButton pendingText="Wird gespeichert …" className="btn-primary w-full sm:w-auto">
        Eintrag speichern
      </SubmitButton>
    </form>
  );
}
