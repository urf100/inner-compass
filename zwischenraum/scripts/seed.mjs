// =============================================================================
// Zwischenraum – Demo-Daten anlegen
//
//   npm run seed
//
// Legt an: 1 Therapeut:in, 2 Klient:innen (je 10 Tagebucheinträge),
// Termine, Übungszuweisungen, Sitzungsnotizen und Krisenpläne.
// Das Skript kann beliebig oft ausgeführt werden – vorhandene Demo-Konten
// werden vorher gelöscht (alle anderen Konten bleiben unberührt).
//
// Benötigt in .env.local: NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SECRET_KEY.
// Der geheime Schlüssel wird NUR hier lokal verwendet, nie in der App.
// =============================================================================
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !secretKey) {
  console.error(
    "\n❌ Bitte NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SECRET_KEY in .env.local eintragen (siehe .env.example).\n",
  );
  process.exit(1);
}

const DEMO_PASSWORD = "Zwischenraum-Demo-2026";
const DEMO = {
  therapist: { email: "demo-therapeutin@example.com", name: "Mag.a Maria Huber" },
  anna: { email: "demo-anna@example.com", name: "Anna" },
  jonas: { email: "demo-jonas@example.com", name: "Jonas" },
};

const admin = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ---------------------------------------------------------------------------
// Zeit-Hilfen (Europe/Vienna)
// ---------------------------------------------------------------------------
const TZ = "Europe/Vienna";
const isoDate = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const today = isoDate.format(new Date());

function addDays(date, days) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days, 12)).toISOString().slice(0, 10);
}
function viennaOffsetMs(utcMs) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const g = (t) => Number(parts.find((p) => p.type === t).value);
  return Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second")) - utcMs;
}
function vienna(date, time) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const wall = Date.UTC(y, m - 1, d, hh, mm);
  let ts = wall - viennaOffsetMs(wall);
  ts = wall - viennaOffsetMs(ts);
  return new Date(ts);
}
function weekday(date) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay(); // 0 = Sonntag
}
const minutes = (n) => n * 60_000;

// ---------------------------------------------------------------------------
async function must(promise, what) {
  const { data, error } = await promise;
  if (error) {
    console.error(`❌ Fehler bei „${what}“:`, error.message ?? error);
    process.exit(1);
  }
  return data;
}

async function deleteExistingDemoUsers() {
  const emails = new Set(Object.values(DEMO).map((d) => d.email));
  for (let page = 1; page < 50; page++) {
    const data = await must(admin.auth.admin.listUsers({ page, perPage: 200 }), "Konten auflisten");
    for (const u of data.users) {
      if (u.email && emails.has(u.email)) {
        await must(admin.auth.admin.deleteUser(u.id), `Demo-Konto ${u.email} löschen`);
        console.log(`  – altes Demo-Konto entfernt: ${u.email}`);
      }
    }
    if (data.users.length < 200) break;
  }
}

async function createUser(email, metadata) {
  const data = await must(
    admin.auth.admin.createUser({
      email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: metadata,
    }),
    `Konto ${email} anlegen`,
  );
  return data.user;
}

// ---------------------------------------------------------------------------
// Demo-Inhalte
// ---------------------------------------------------------------------------
const ANNA_ENTRIES = [
  { ago: 27, mood: 4, tags: ["Schlaf", "Arbeit"], shared: true, text: "Schlecht geschlafen, um 4 Uhr wach gelegen. Im Büro alles zäh. Habe mich nach der Arbeit gleich hingelegt." },
  { ago: 24, mood: 5, tags: ["Arbeit"], shared: false, text: "Projektbesprechung lief besser als befürchtet. Trotzdem dieses Ziehen im Bauch den ganzen Vormittag." },
  { ago: 21, mood: 3, tags: ["Angst", "Körper"], shared: true, text: "Im Supermarkt plötzlich Herzrasen. Bin raus und habe die 4-7-8-Atmung probiert. Nach ein paar Minuten ging es wieder." },
  { ago: 18, mood: 5, tags: ["Familie"], shared: false, text: "Telefonat mit meiner Mutter. Anstrengend, aber ich habe gesagt, dass ich am Sonntag nicht komme. Das war neu." },
  { ago: 15, mood: 6, tags: ["Bewegung", "Freude"], shared: true, text: "Langer Spaziergang an der Donau. Die Sonne hat gutgetan. Zum ersten Mal seit Wochen den Kopf frei gehabt." },
  { ago: 12, mood: 5, tags: ["Schlaf"], shared: false, text: "Wieder früh aufgewacht, aber nicht mehr so lange gegrübelt." },
  { ago: 9, mood: 6, tags: ["Arbeit", "Stress"], shared: true, text: "Viel zu tun, aber ich habe mir zwei Pausen genommen und bin kurz rausgegangen. Hat geholfen." },
  { ago: 6, mood: 7, tags: ["Freude", "Beziehung"], shared: true, text: "Abend mit Lea. Viel gelacht. Habe gemerkt, wie sehr mir das gefehlt hat." },
  { ago: 3, mood: 6, tags: ["Angst"], shared: false, text: "Kurz vor dem Zahnarzttermin wieder diese Unruhe. Gedankenprotokoll angefangen, aber nicht fertig gemacht." },
  { ago: 1, mood: 7, tags: ["Schlaf", "Körper"], shared: true, text: "Sechs Stunden am Stück geschlafen! Morgens Yoga-Video gemacht." },
];

const JONAS_ENTRIES = [
  { ago: 26, mood: 6, tags: ["Arbeit"], shared: true, text: "Neuer Dienstplan. Spätschichten diese Woche, mal sehen wie das wird." },
  { ago: 23, mood: 5, tags: ["Einsamkeit"], shared: false, text: "Wochenende allein in der Wohnung. Habe niemanden angerufen, obwohl ich wollte." },
  { ago: 20, mood: 4, tags: ["Stress", "Schlaf"], shared: false, text: "Nach der Spätschicht nicht runtergekommen. Bis 2 Uhr am Handy." },
  { ago: 17, mood: 4, tags: ["Arbeit", "Stress"], shared: true, text: "Konflikt mit dem Teamleiter. Ich habe nichts gesagt und mich danach den ganzen Abend geärgert." },
  { ago: 14, mood: 3, tags: ["Einsamkeit"], shared: true, text: "Fühle mich leer. Keine Lust auf irgendwas. Habe trotzdem eingekauft und gekocht." },
  { ago: 11, mood: 4, tags: ["Körper"], shared: false, text: "Kopfschmerzen den ganzen Tag. Viel zu wenig getrunken." },
  { ago: 8, mood: 5, tags: ["Bewegung"], shared: true, text: "Mit dem Rad zur Arbeit gefahren. Danach etwas wacher." },
  { ago: 5, mood: 5, tags: ["Beziehung"], shared: false, text: "Mit meinem Bruder geschrieben. Wir wollen uns nächste Woche treffen." },
  { ago: 2, mood: 6, tags: ["Freude"], shared: true, text: "Treffen mit Tobias, Fußball geschaut. Es war leichter als gedacht." },
  { ago: 0, mood: 5, tags: ["Arbeit"], shared: false, text: "Ganz okay. Morgen frei." },
];

// ---------------------------------------------------------------------------
async function main() {
  console.log("\n🌱 Zwischenraum – Demo-Daten werden angelegt …\n");
  await deleteExistingDemoUsers();

  // 1) Therapeut:in (der Trigger legt Profil + 6 Beispiel-Übungen an)
  const therapist = await createUser(DEMO.therapist.email, { role: "therapist", display_name: DEMO.therapist.name });
  console.log(`  ✓ Therapeut:in: ${DEMO.therapist.email}`);

  // 2) Einladungscodes
  const invites = await must(
    admin
      .from("invitations")
      .insert([
        { therapist_id: therapist.id, label: "A., Dienstag 10 Uhr" },
        { therapist_id: therapist.id, label: "J., Donnerstag 16 Uhr" },
        { therapist_id: therapist.id, label: "Erstgespräch nächste Woche" },
      ])
      .select("code, label"),
    "Einladungscodes anlegen",
  );

  // 3) Klient:innen registrieren sich mit je einem Code
  const anna = await createUser(DEMO.anna.email, { role: "client", display_name: DEMO.anna.name, invite_code: invites[0].code });
  const jonas = await createUser(DEMO.jonas.email, { role: "client", display_name: DEMO.jonas.name, invite_code: invites[1].code });
  console.log(`  ✓ Klient:innen: ${DEMO.anna.email}, ${DEMO.jonas.email}`);

  // 4) Tagebucheinträge (je 10)
  const toRows = (clientId, entries) =>
    entries.map((e) => ({
      client_id: clientId,
      entry_date: addDays(today, -e.ago),
      mood: e.mood,
      content: e.text,
      tags: e.tags,
      is_shared: e.shared,
    }));
  await must(
    admin.from("journal_entries").insert([...toRows(anna.id, ANNA_ENTRIES), ...toRows(jonas.id, JONAS_ENTRIES)]),
    "Tagebucheinträge anlegen",
  );
  console.log("  ✓ 20 Tagebucheinträge (davon 11 geteilt)");

  // 5) Sitzungsnotizen (nur für die Therapeut:in sichtbar)
  await must(
    admin.from("session_notes").insert([
      {
        therapist_id: therapist.id,
        client_id: anna.id,
        session_date: addDays(today, -14),
        content:
          "Thema: Panikattacke im Supermarkt. Psychoedukation zum Angstkreislauf. 4-7-8-Atmung geübt, gut angenommen. Nächstes Mal: Gedankenprotokoll einführen.",
      },
      {
        therapist_id: therapist.id,
        client_id: anna.id,
        session_date: addDays(today, -7),
        content:
          "Wirkt stabiler. Abgrenzung gegenüber der Mutter als Erfolg erlebt. Schlaf weiterhin Thema. Gedankenprotokoll als Hausaufgabe mitgegeben.",
      },
      {
        therapist_id: therapist.id,
        client_id: jonas.id,
        session_date: addDays(today, -10),
        content:
          "Gedrückte Stimmung, sozialer Rückzug. Aktivitätenplanung besprochen. Konflikt am Arbeitsplatz: Rollenspiel für nächstes Mal vorbereiten.",
      },
    ]),
    "Sitzungsnotizen anlegen",
  );
  console.log("  ✓ 3 Sitzungsnotizen");

  // 6) Übungen zuweisen
  const exercises = await must(admin.from("exercises").select("id, title").eq("therapist_id", therapist.id), "Übungen laden");
  const ex = (title) => exercises.find((e) => e.title.startsWith(title))?.id;
  const daysAgoIso = (n) => new Date(Date.now() - n * 86_400_000).toISOString();
  await must(
    admin.from("exercise_assignments").insert([
      {
        exercise_id: ex("Atemübung 4-7-8"), therapist_id: therapist.id, client_id: anna.id,
        note: "Gern zwei Mal am Tag, auch wenn es dir gut geht – so wird sie vertraut.",
        assigned_at: daysAgoIso(14), completed_at: daysAgoIso(12),
        reflection: "Beim dritten Mal ging es schon leichter. Im Supermarkt hat es mir wirklich geholfen.",
      },
      {
        exercise_id: ex("Gedankenprotokoll"), therapist_id: therapist.id, client_id: anna.id,
        note: "Nimm dir eine Situation aus dieser Woche vor, in der die Angst hoch war.",
        assigned_at: daysAgoIso(7),
      },
      { exercise_id: ex("Der sichere Ort"), therapist_id: therapist.id, client_id: anna.id, assigned_at: daysAgoIso(2) },
      {
        exercise_id: ex("5-4-3-2-1-Erdung"), therapist_id: therapist.id, client_id: jonas.id,
        assigned_at: daysAgoIso(10), completed_at: daysAgoIso(8),
        reflection: "Habe es nach der Spätschicht gemacht. Ein bisschen albern, aber ich war danach ruhiger.",
      },
      {
        exercise_id: ex("Wohltuende Aktivität planen"), therapist_id: therapist.id, client_id: jonas.id,
        note: "Plan bitte eine Sache, die du mit einer anderen Person machst.",
        assigned_at: daysAgoIso(10),
      },
    ]),
    "Übungen zuweisen",
  );
  console.log("  ✓ 5 Übungszuweisungen (2 erledigt mit Reflexion)");

  // 7) Termine: freie Zeitfenster an Werktagen ab übermorgen + Buchungen
  const slots = [];
  for (let d = 2; d <= 21; d++) {
    const date = addDays(today, d);
    const wd = weekday(date);
    if (wd === 0 || wd === 6) continue;
    for (const time of ["09:00", "10:00", "14:00", "16:00"]) {
      const start = vienna(date, time);
      slots.push({ therapist_id: therapist.id, starts_at: start.toISOString(), ends_at: new Date(start.getTime() + minutes(50)).toISOString() });
    }
  }
  // Ein Termin in ca. 20 Stunden (Stornieren nicht mehr möglich) für Jonas
  const soon = new Date(Math.ceil((Date.now() + 20 * 3_600_000) / minutes(15)) * minutes(15));
  slots.push({ therapist_id: therapist.id, starts_at: soon.toISOString(), ends_at: new Date(soon.getTime() + minutes(50)).toISOString(), client_id: jonas.id, booked_at: new Date().toISOString() });
  // Vergangener Termin von Anna
  const past = vienna(addDays(today, -7), "10:00");
  slots.push({ therapist_id: therapist.id, starts_at: past.toISOString(), ends_at: new Date(past.getTime() + minutes(50)).toISOString(), client_id: anna.id, booked_at: new Date(past.getTime() - 3 * 86_400_000).toISOString() });

  const insertedSlots = await must(admin.from("appointment_slots").insert(slots).select("id, starts_at, client_id"), "Zeitfenster anlegen");
  // Anna bucht den ersten freien Termin (mehr als 24 h entfernt -> stornierbar)
  const annaSlot = insertedSlots.filter((s) => !s.client_id).sort((a, b) => a.starts_at.localeCompare(b.starts_at))[1];
  await must(
    admin.from("appointment_slots").update({ client_id: anna.id, booked_at: new Date().toISOString() }).eq("id", annaSlot.id),
    "Termin für Anna buchen",
  );
  console.log(`  ✓ ${insertedSlots.length} Zeitfenster (3 gebucht)`);

  // 8) Krisenpläne
  await must(
    admin.from("crisis_plans").insert([
      {
        client_id: anna.id,
        warning_signs: "Ich schlafe mehrere Nächte kaum.\nIch sage Treffen ab und gehe nicht mehr einkaufen.\nHerzrasen und der Gedanke „ich halte das nicht aus“.",
        helpful_actions: "4-7-8-Atmung, kaltes Wasser über die Handgelenke.\nRaus an die frische Luft, eine Runde um den Block.\nMusik: Playlist „Ruhig“.\nLea anrufen.",
        contacts: [
          { name: "Lea (Freundin)", phone: "+43 660 0000001", note: "meist abends erreichbar" },
          { name: "Bruder Max", phone: "+43 660 0000002", note: "" },
        ],
        updated_by: therapist.id,
      },
      {
        client_id: jonas.id,
        warning_signs: "Ich ziehe mich zurück und gehe nicht mehr ans Telefon.",
        helpful_actions: "Radfahren. Mit Tobias schreiben.",
        contacts: [{ name: "Tobias", phone: "+43 660 0000003", note: "Freund" }],
        updated_by: jonas.id,
      },
    ]),
    "Krisenpläne anlegen",
  );
  console.log("  ✓ 2 Krisenpläne");

  console.log(`
✅ Fertig! Demo-Zugänge (Passwort für alle: ${DEMO_PASSWORD})

   Therapeut:in  ${DEMO.therapist.email}
   Klient:in     ${DEMO.anna.email}
   Klient:in     ${DEMO.jonas.email}

   Offener Einladungscode zum Ausprobieren: ${invites[2].code}
`);
}

main().catch((err) => {
  console.error("❌ Unerwarteter Fehler:", err);
  process.exit(1);
});
