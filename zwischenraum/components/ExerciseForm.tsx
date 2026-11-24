import { EXERCISE_CATEGORIES } from "@/lib/constants";
import type { Exercise } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import { saveExercise } from "@/app/praxis/actions";

export function ExerciseForm({ exercise }: { exercise?: Exercise }) {
  return (
    <form action={saveExercise} className="card space-y-4">
      {exercise && <input type="hidden" name="id" value={exercise.id} />}
      <div>
        <label htmlFor="title" className="label">
          Titel
        </label>
        <input id="title" name="title" required maxLength={120} defaultValue={exercise?.title} className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="label">
            Kategorie
          </label>
          <input
            id="category"
            name="category"
            required
            maxLength={60}
            list="kategorien"
            defaultValue={exercise?.category}
            className="input"
          />
          <datalist id="kategorien">
            {EXERCISE_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="duration_minutes" className="label">
            Dauer in Minuten
          </label>
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min={1}
            max={240}
            required
            defaultValue={exercise?.duration_minutes ?? 10}
            className="input"
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="label">
          Beschreibung und Anleitung
        </label>
        <textarea
          id="description"
          name="description"
          rows={12}
          maxLength={8000}
          defaultValue={exercise?.description}
          className="input"
        />
        <p className="hint">Zeilenumbrüche bleiben erhalten. Schreib so, dass die Übung auch ohne dich verständlich ist.</p>
      </div>
      <SubmitButton>Übung speichern</SubmitButton>
    </form>
  );
}
