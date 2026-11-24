/** Barrierearmer Schalter (natives Kontrollkästchen mit role="switch"). */
export function ShareSwitch({ defaultChecked = false, therapistName }: { defaultChecked?: boolean; therapistName?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-sand-100 p-4">
      <div>
        <label htmlFor="is_shared" className="font-semibold">
          Mit Therapeut:in teilen
        </label>
        <p id="is_shared_hint" className="hint">
          Standardmäßig ist jeder Eintrag privat. Wenn du teilst, kann {therapistName ?? "deine Therapeut:in"} diesen
          Eintrag lesen. Du kannst die Freigabe jederzeit zurückziehen.
        </p>
      </div>
      <span className="relative mt-1 inline-flex shrink-0">
        <input
          id="is_shared"
          name="is_shared"
          type="checkbox"
          role="switch"
          defaultChecked={defaultChecked}
          aria-describedby="is_shared_hint"
          className="peer h-7 w-12 cursor-pointer appearance-none rounded-full bg-sand-300 transition-colors checked:bg-sage-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
        />
      </span>
    </div>
  );
}
