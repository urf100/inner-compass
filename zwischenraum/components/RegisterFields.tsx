/** Gemeinsame Felder der Registrierungsformulare. */
export function RegisterFields({ nameHint }: { nameHint: string }) {
  return (
    <>
      <div>
        <label htmlFor="display_name" className="label">
          Name
        </label>
        <input id="display_name" name="display_name" required maxLength={80} autoComplete="nickname" className="input" aria-describedby="display_name_hint" />
        <p id="display_name_hint" className="hint">
          {nameHint}
        </p>
      </div>
      <div>
        <label htmlFor="email" className="label">
          E-Mail-Adresse
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="input"
          aria-describedby="password_hint"
        />
        <p id="password_hint" className="hint">
          Mindestens 10 Zeichen.
        </p>
      </div>
      <div className="flex items-start gap-3 rounded-xl bg-honey-50 p-3">
        <input id="test_ok" name="test_ok" type="checkbox" required className="mt-1 size-5 accent-sage-600" />
        <label htmlFor="test_ok" className="text-honey-800">
          Ich habe verstanden, dass dies eine <strong>Testversion</strong> ist, und gebe keine echten Gesundheitsdaten
          ein.
        </label>
      </div>
    </>
  );
}
