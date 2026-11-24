// =============================================================================
// Zwischenraum – RLS-Test über die echte API (mit den Demo-Konten)
//
//   npm run seed       (einmalig, legt die Demo-Konten an)
//   npm run test:rls
//
// Meldet sich wie die App mit dem ÖFFENTLICHEN Schlüssel als Anna, Jonas und
// als Therapeut:in an und prüft, was jede Person sehen und ändern darf.
// Der geheime Schlüssel wird nur verwendet, um die erwarteten Zahlen zu
// ermitteln. Alle Teständerungen werden am Ende zurückgesetzt.
// =============================================================================
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !publicKey || !secretKey) {
  console.error("\n❌ Bitte NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY und SUPABASE_SECRET_KEY in .env.local setzen.\n");
  process.exit(1);
}

const PASSWORD = "Zwischenraum-Demo-2026";
const EMAILS = {
  therapist: "demo-therapeutin@example.com",
  anna: "demo-anna@example.com",
  jonas: "demo-jonas@example.com",
};

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, secretKey, opts);

async function signIn(email) {
  const client = createClient(url, publicKey, opts);
  const { data, error } = await client.auth.signInWithPassword({ email, password: PASSWORD });
  if (error) {
    console.error(`\n❌ Anmeldung als ${email} fehlgeschlagen: ${error.message}\n   Wurde "npm run seed" ausgeführt?\n`);
    process.exit(1);
  }
  return { client, id: data.user.id };
}

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok: Boolean(ok), detail });
}
const count = async (q) => {
  const { count: c, error } = await q;
  if (error) throw new Error(error.message);
  return c ?? 0;
};

async function main() {
  const anna = await signIn(EMAILS.anna);
  const jonas = await signIn(EMAILS.jonas);
  const therapist = await signIn(EMAILS.therapist);
  const anon = createClient(url, publicKey, opts);

  // Erwartete Werte (mit geheimem Schlüssel, ohne RLS)
  const annaTotal = await count(admin.from("journal_entries").select("id", { count: "exact", head: true }).eq("client_id", anna.id));
  const jonasTotal = await count(admin.from("journal_entries").select("id", { count: "exact", head: true }).eq("client_id", jonas.id));
  const sharedTotal = await count(
    admin.from("journal_entries").select("id", { count: "exact", head: true }).in("client_id", [anna.id, jonas.id]).eq("is_shared", true),
  );

  // --- Anna -----------------------------------------------------------------
  {
    const c = anna.client;
    const { data: own } = await c.from("journal_entries").select("id, client_id");
    check("Anna sieht genau ihre eigenen Einträge", own?.length === annaTotal && own.every((e) => e.client_id === anna.id), `${own?.length}/${annaTotal}`);

    const { data: foreign } = await c.from("journal_entries").select("id").eq("client_id", jonas.id);
    check("Anna sieht keine Einträge von Jonas", foreign?.length === 0);

    const { error: insErr } = await c.from("journal_entries").insert({ client_id: jonas.id, mood: 1, content: "Test" });
    check("Anna kann keinen Eintrag für Jonas anlegen", Boolean(insErr));

    const { data: jonasEntry } = await admin.from("journal_entries").select("id, mood").eq("client_id", jonas.id).limit(1).single();
    const { data: upd } = await c.from("journal_entries").update({ mood: 1 }).eq("id", jonasEntry.id).select("id");
    check("Anna kann Einträge von Jonas nicht ändern", (upd ?? []).length === 0);

    const { data: del } = await c.from("journal_entries").delete().eq("client_id", jonas.id).select("id");
    check("Anna kann Einträge von Jonas nicht löschen", (del ?? []).length === 0);

    const { data: notes } = await c.from("session_notes").select("id");
    check("Anna sieht keine Sitzungsnotizen", notes?.length === 0);

    const { error: roleErr } = await c.from("profiles").update({ role: "therapist" }).eq("id", anna.id);
    check("Anna kann ihre Rolle nicht ändern", Boolean(roleErr));

    const { data: profiles } = await c.from("profiles").select("id");
    const ids = (profiles ?? []).map((p) => p.id).sort();
    check("Anna sieht nur ihr Profil und das der Therapeut:in", ids.length === 2 && ids.includes(therapist.id) && !ids.includes(jonas.id));

    const { data: plans } = await c.from("crisis_plans").select("client_id");
    check("Anna sieht nur ihren eigenen Krisenplan", plans?.length === 1 && plans[0].client_id === anna.id);

    const { data: assigns } = await c.from("exercise_assignments").select("client_id");
    check("Anna sieht nur ihre eigenen Übungen", (assigns ?? []).length > 0 && assigns.every((a) => a.client_id === anna.id));

    const { data: slots } = await c.from("appointment_slots").select("client_id").not("client_id", "is", null);
    check("Anna sieht nur ihre eigenen Buchungen", (slots ?? []).every((s) => s.client_id === anna.id));

    const { data: inv } = await c.from("invitations").select("id");
    check("Anna sieht keine Einladungscodes", inv?.length === 0);
  }

  // --- Jonas ----------------------------------------------------------------
  {
    const c = jonas.client;
    const { data: own } = await c.from("journal_entries").select("client_id");
    check("Jonas sieht genau seine eigenen Einträge", own?.length === jonasTotal && own.every((e) => e.client_id === jonas.id));
    const { data: plan } = await c.from("crisis_plans").select("client_id").eq("client_id", anna.id);
    check("Jonas sieht Annas Krisenplan nicht", plan?.length === 0);
    const { data: upd } = await c.from("crisis_plans").update({ warning_signs: "x" }).eq("client_id", anna.id).select("client_id");
    check("Jonas kann Annas Krisenplan nicht ändern", (upd ?? []).length === 0);
  }

  // --- Therapeut:in -----------------------------------------------------------
  let toggledId = null;
  {
    const c = therapist.client;
    const { data: entries } = await c.from("journal_entries").select("id, is_shared");
    check(
      "Therapeut:in sieht nur freigegebene Einträge",
      entries?.length === sharedTotal && entries.every((e) => e.is_shared),
      `${entries?.length}/${sharedTotal}`,
    );

    const { error: insErr } = await c.from("journal_entries").insert({ client_id: anna.id, mood: 5 });
    check("Therapeut:in kann keine Tagebucheinträge anlegen", Boolean(insErr));

    const { data: notes } = await c.from("session_notes").select("id");
    check("Therapeut:in sieht ihre eigenen Sitzungsnotizen", (notes ?? []).length > 0);

    // Anna zieht eine Freigabe zurück -> Therapeut:in sieht den Eintrag nicht mehr
    const { data: sharedOne } = await anna.client.from("journal_entries").select("id").eq("is_shared", true).limit(1).single();
    toggledId = sharedOne.id;
    await anna.client.from("journal_entries").update({ is_shared: false }).eq("id", toggledId);
    const { data: after } = await c.from("journal_entries").select("id").eq("id", toggledId);
    check("Nach dem Zurückziehen ist der Eintrag für die Therapeut:in unsichtbar", after?.length === 0);
  }

  // --- Ohne Anmeldung -------------------------------------------------------------
  {
    const { data, error } = await anon.from("journal_entries").select("id");
    check("Ohne Anmeldung keine Tagebucheinträge", Boolean(error) || data?.length === 0);
    const { data: p, error: pe } = await anon.from("profiles").select("id");
    check("Ohne Anmeldung keine Profile", Boolean(pe) || p?.length === 0);
  }

  // Aufräumen
  if (toggledId) await admin.from("journal_entries").update({ is_shared: true }).eq("id", toggledId);

  console.log("\nRLS-Test über die API\n");
  for (const r of results) console.log(`${r.ok ? "✅" : "❌"} ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed} von ${results.length} Prüfungen bestanden.\n`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error("❌ Unerwarteter Fehler:", err);
  process.exit(1);
});
