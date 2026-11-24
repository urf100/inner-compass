// Rückmeldungen nach Aktionen. In der URL steht nur ein Schlüssel (?m=...),
// niemals freier Text – so lassen sich keine fremden Meldungen einschleusen.

type Kind = "success" | "error" | "info";

export const MESSAGES = {
  // allgemein
  fehler: { kind: "error", text: "Das hat leider nicht geklappt. Bitte versuch es noch einmal." },
  ungueltig: { kind: "error", text: "Bitte prüfe deine Eingaben." },
  // Anmeldung / Registrierung
  login_fehler: { kind: "error", text: "E-Mail-Adresse oder Passwort stimmen nicht." },
  abgemeldet: { kind: "info", text: "Du bist abgemeldet. Bis bald!" },
  code_ungueltig: { kind: "error", text: "Dieser Einladungscode ist ungültig, abgelaufen oder wurde bereits verwendet." },
  passwort_kurz: { kind: "error", text: "Das Passwort muss mindestens 10 Zeichen lang sein." },
  email_vergeben: { kind: "error", text: "Mit dieser E-Mail-Adresse gibt es bereits ein Konto." },
  registriert_bestaetigen: {
    kind: "info",
    text: "Fast geschafft: Bitte bestätige deine E-Mail-Adresse über den Link, den wir dir geschickt haben. Danach kannst du dich anmelden.",
  },
  bestaetigt: { kind: "success", text: "Deine E-Mail-Adresse ist bestätigt. Willkommen!" },
  link_ungueltig: {
    kind: "info",
    text: "Der Link konnte hier nicht verwendet werden. Falls du deine E-Mail-Adresse gerade bestätigt hast, melde dich bitte einfach an.",
  },
  testhinweis_fehlt: { kind: "error", text: "Bitte bestätige, dass du keine echten Gesundheitsdaten eingibst." },
  // Tagebuch
  eintrag_gespeichert: { kind: "success", text: "Dein Eintrag ist gespeichert." },
  eintrag_geloescht: { kind: "success", text: "Der Eintrag wurde gelöscht." },
  geteilt: { kind: "success", text: "Der Eintrag ist jetzt für deine Therapeut:in sichtbar." },
  nicht_geteilt: { kind: "success", text: "Der Eintrag ist wieder privat." },
  // Termine
  gebucht: { kind: "success", text: "Der Termin ist gebucht." },
  storniert: { kind: "success", text: "Der Termin wurde storniert." },
  storno_zu_spaet: {
    kind: "error",
    text: "Stornieren ist nur bis 24 Stunden vor dem Termin möglich. Bitte wende dich direkt an deine Therapeut:in.",
  },
  nicht_verfuegbar: { kind: "error", text: "Dieses Zeitfenster ist leider nicht mehr frei." },
  slots_angelegt: { kind: "success", text: "Die Zeitfenster wurden angelegt." },
  slot_ueberschneidung: { kind: "error", text: "Mindestens ein Zeitfenster überschneidet sich mit einem bestehenden." },
  slot_vergangen: { kind: "error", text: "Zeitfenster müssen in der Zukunft liegen." },
  slot_geloescht: { kind: "success", text: "Das Zeitfenster wurde entfernt." },
  // Übungen
  uebung_gespeichert: { kind: "success", text: "Die Übung ist gespeichert." },
  uebung_geloescht: { kind: "success", text: "Die Übung wurde gelöscht." },
  uebung_zugewiesen_nicht_loeschbar: {
    kind: "error",
    text: "Diese Übung ist noch Klient:innen zugewiesen und kann deshalb nicht gelöscht werden.",
  },
  zugewiesen: { kind: "success", text: "Die Übung wurde zugewiesen." },
  zuweisung_entfernt: { kind: "success", text: "Die Zuweisung wurde entfernt." },
  erledigt: { kind: "success", text: "Schön, dass du dir die Zeit genommen hast. Die Übung ist als erledigt markiert." },
  wieder_offen: { kind: "info", text: "Die Übung ist wieder offen." },
  reflexion_gespeichert: { kind: "success", text: "Deine Reflexion ist gespeichert." },
  // Notizen / Einladungen / Krisenplan
  notiz_gespeichert: { kind: "success", text: "Die Notiz ist gespeichert." },
  notiz_geloescht: { kind: "success", text: "Die Notiz wurde gelöscht." },
  einladung_erstellt: { kind: "success", text: "Ein neuer Einladungscode wurde erstellt." },
  einladung_geloescht: { kind: "success", text: "Der Einladungscode wurde gelöscht." },
  krisenplan_gespeichert: { kind: "success", text: "Der Krisenplan ist gespeichert." },
  profil_gespeichert: { kind: "success", text: "Dein Name wurde gespeichert." },
} as const satisfies Record<string, { kind: Kind; text: string }>;

export type MessageKey = keyof typeof MESSAGES;

export function getMessage(key: string | string[] | undefined) {
  if (typeof key !== "string") return null;
  return key in MESSAGES ? MESSAGES[key as MessageKey] : null;
}

/** Hängt ?m=<schlüssel> an einen Pfad an. */
export function withMessage(path: string, key: MessageKey) {
  return `${path}${path.includes("?") ? "&" : "?"}m=${key}`;
}
