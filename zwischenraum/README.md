# Zwischenraum

**Ein ruhiger, sicherer Ort zwischen den Therapiesitzungen.**
Zwischenraum verbindet Klient:innen und Psychotherapeut:innen: mit privatem Tagebuch, Übungen, Terminbuchung und einem gemeinsamen Krisenplan.

> ⚠️ **Testversion nur mit Demo-Daten.** Bitte keine echten Gesundheitsdaten eingeben. Zwischenraum ist kein Medizinprodukt und kein Notfalldienst.

---

## Inhalt

1. [Was die App kann](#was-die-app-kann)
2. [Demo-Zugänge](#demo-zugänge)
3. [Schritt für Schritt: Installation](#schritt-für-schritt-installation)
   1. [Supabase-Projekt anlegen (Region Frankfurt)](#1-supabase-projekt-anlegen-region-frankfurt)
   2. [Migration und Seed ausführen](#2-migration-und-seed-ausführen)
   3. [Umgebungsvariablen setzen](#3-umgebungsvariablen-setzen)
   4. [Lokal starten](#4-lokal-starten)
   5. [Auf GitHub hochladen und über Vercel veröffentlichen](#5-auf-github-hochladen-und-über-vercel-veröffentlichen)
4. [Sicherheit und Datenschutz](#sicherheit-und-datenschutz)
5. [RLS-Tests](#rls-tests)
6. [Datenmodell](#datenmodell)
7. [Ordnerstruktur](#ordnerstruktur)
8. [Für später vorbereitet: KI-Zusammenfassungen und Benachrichtigungen](#für-später-vorbereitet)
9. [Häufige Probleme](#häufige-probleme)

---

## Was die App kann

| Bereich | Klient:in | Therapeut:in |
|---|---|---|
| **Konto** | Registrierung nur mit Einladungscode → automatisch genau einer Therapeut:in zugeordnet | Registrierung frei; erzeugt pro Klient:in einen Einladungscode (einmalig verwendbar, 14 Tage gültig) |
| **Tagebuch** | Datum, Stimmung 1–10, Freitext, Themen (Tags). Jeder Eintrag ist **standardmäßig privat**; Schalter „Mit Therapeut:in teilen“ gibt ihn frei oder zieht die Freigabe zurück. Stimmungsverlauf der letzten 30 Tage als Liniendiagramm. | Sieht **nur freigegebene** Einträge, deren Stimmungsverlauf und Trend |
| **Dashboard** | – | Liste der eigenen Klient:innen mit letzter (sichtbarer) Aktivität, Ø-Stimmung, Trend, Mini-Diagramm, nächstem Termin; Detailansicht mit Tabs |
| **Sitzungsnotizen** | – (unsichtbar) | Private Notizen pro Klient:in, nur für die Verfasser:in lesbar |
| **Termine** | Freie Zeitfenster buchen, bis 24 h vorher stornieren, kommende Termine sehen | Zeitfenster anlegen (auch wöchentlich wiederholt), gebuchte Termine sehen, absagen |
| **Übungen** | Zugewiesene Übungen lesen, als erledigt markieren, kurze Reflexion schreiben | Übungsbibliothek pflegen (6 Beispiel-Übungen sind automatisch vorhanden), Übungen zuweisen, Reflexionen lesen |
| **Krisenhilfe** | Immer erreichbar über den roten Button „Krisenhilfe“. Notrufnummern Österreich (112, 144, 142) und persönlicher Krisenplan (Warnzeichen, was hilft, Kontaktpersonen) | Krisenplan gemeinsam mit der Klient:in befüllen |

Die Oberfläche ist auf Deutsch, für Handys optimiert, per Tastatur bedienbar (inkl. „Zum Inhalt springen“), mit gut sichtbarem Fokus, ausreichenden Kontrasten und beschrifteten Formularfeldern. Diagramme haben zusätzlich eine Tabellenansicht für Screenreader.

**Die 6 Beispiel-Übungen:** Atemübung 4-7-8 · 5-4-3-2-1-Erdung · Gedankenprotokoll · Progressive Muskelentspannung (Kurzform) · Der sichere Ort · Wohltuende Aktivität planen.

---

## Demo-Zugänge

Nach `npm run seed` (siehe Schritt 2) gibt es diese Konten. **Passwort für alle: `Zwischenraum-Demo-2026`**

| Rolle | E-Mail | Was du siehst |
|---|---|---|
| Therapeut:in | `demo-therapeutin@example.com` | Mag.a Maria Huber mit 2 Klient:innen, Notizen, Terminen, Übungen |
| Klient:in | `demo-anna@example.com` | Anna: 10 Einträge (6 geteilt), 3 Übungen (1 erledigt), gebuchter Termin, ausgefüllter Krisenplan |
| Klient:in | `demo-jonas@example.com` | Jonas: 10 Einträge (5 geteilt), 2 Übungen, Termin in weniger als 24 h (zeigt die Storno-Sperre) |

Das Seed-Skript gibt am Ende außerdem einen **offenen Einladungscode** aus, mit dem du die Registrierung als neue Klient:in ausprobieren kannst.

---

## Schritt für Schritt: Installation

Du brauchst:

- einen kostenlosen Account bei **[Supabase](https://supabase.com)** (Datenbank + Anmeldung),
- einen kostenlosen Account bei **[GitHub](https://github.com)** und **[Vercel](https://vercel.com)** (Veröffentlichung),
- auf deinem Computer **[Node.js](https://nodejs.org)** in Version 20 oder neuer (die „LTS“-Version herunterladen und installieren).

> 💡 Befehle wie `npm install` gibst du in einem **Terminal** ein (macOS: Programm „Terminal“; Windows: „Eingabeaufforderung“ oder „PowerShell“). Wechsle vorher mit `cd` in den Ordner `zwischenraum`, z. B. `cd Downloads/inner-compass/zwischenraum`.

### 1. Supabase-Projekt anlegen (Region Frankfurt)

1. Melde dich bei [supabase.com](https://supabase.com) an und klicke auf **„New project“**.
2. Vergib einen Namen, z. B. `zwischenraum-test`, und ein sicheres **Datenbank-Passwort** (in einem Passwort-Manager speichern).
3. Wähle bei **Region** die Option **„Central EU (Frankfurt)“** (`eu-central-1`). Das ist wichtig, damit die Daten in der EU bleiben.
4. Klicke auf **„Create new project“** und warte, bis das Projekt bereit ist (1–2 Minuten).
5. **Für die Testversion empfohlen:** Unter **Authentication → Sign In / Providers → Email** den Schalter **„Confirm email“** ausschalten. Dann kann man sich sofort nach der Registrierung anmelden. (Bleibt er an, bekommen neue Konten eine Bestätigungs-E-Mail. Der eingebaute E-Mail-Versand von Supabase ist aber stark begrenzt.)
6. Unter **Authentication → URL Configuration**:
   - **Site URL**: vorerst `http://localhost:3000` (nach Schritt 5 durch deine Vercel-Adresse ersetzen),
   - **Redirect URLs**: `http://localhost:3000/auth/callback` hinzufügen (später auch `https://DEINE-APP.vercel.app/auth/callback`).

### 2. Migration und Seed ausführen

**a) Datenbank einrichten (Migration)**

1. Öffne im Supabase-Dashboard links den **SQL Editor** und klicke auf **„New query“**.
2. Öffne auf deinem Computer die Datei `supabase/migrations/20261124000001_schema.sql`, kopiere den **gesamten Inhalt** in den SQL Editor und klicke auf **„Run“**. Es sollte „Success“ erscheinen.
3. Wiederhole das mit `supabase/migrations/20261124000002_rls.sql`, also **neue Query, Inhalt einfügen, „Run“**.
4. **RLS prüfen:** Neue Query, Inhalt von `supabase/tests/rls_test.sql` einfügen und auf „Run“ klicken. Du siehst eine Tabelle mit 46 Prüfungen, und **jede Zeile muss „bestanden“ zeigen**. Der Test legt nur vorübergehend Testdaten an und rollt sie automatisch wieder zurück.

> Alternative für Fortgeschrittene: Mit der [Supabase CLI](https://supabase.com/docs/guides/cli) `supabase link` und dann `supabase db push` ausführen, denn der Ordner `supabase/migrations` ist kompatibel.

**b) Demo-Daten anlegen (Seed)**

Zuerst Schritt 3 erledigen (Umgebungsvariablen), dann im Ordner `zwischenraum`:

```bash
npm install
npm run seed
```

Am Ende erscheinen die Demo-Zugänge. Du kannst `npm run seed` jederzeit erneut ausführen: Die drei Demo-Konten werden dabei gelöscht und frisch angelegt, andere Konten bleiben unberührt.

**c) Optional: RLS-Test über die echte API**

```bash
npm run test:rls
```

Meldet sich als Anna, Jonas und Therapeut:in an (wie die App, mit dem öffentlichen Schlüssel) und prüft 21 Zugriffsregeln.

### 3. Umgebungsvariablen setzen

1. Kopiere im Ordner `zwischenraum` die Datei `.env.example` und nenne die Kopie **`.env.local`**.
2. Hole dir die Werte im Supabase-Dashboard über den Button **„Connect“** oben bzw. unter **Project Settings → API Keys**:

| Variable | Wert | Wo verwendet |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Projekt-URL, z. B. `https://abcd1234.supabase.co` | App + Skripte |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **Publishable key** (`sb_publishable_…`), bei älteren Projekten der **anon**-Schlüssel | App + Skripte |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` (lokal) bzw. deine Vercel-Adresse | Link in Bestätigungs-E-Mails |
| `SUPABASE_SECRET_KEY` | **Secret key** (`sb_secret_…`), bei älteren Projekten **service_role** | **Nur** `npm run seed` und `npm run test:rls` auf deinem Computer |

> 🔐 Der **Secret key** umgeht alle Schutzregeln. Er gehört **nur** in deine lokale `.env.local`, die nie hochgeladen wird (steht in `.gitignore`). Trage ihn **nicht** in Vercel ein: Die App selbst braucht ihn nicht.

### 4. Lokal starten

```bash
npm install
npm run dev
```

Öffne danach [http://localhost:3000](http://localhost:3000) und melde dich mit einem Demo-Zugang an.

Weitere Befehle:

| Befehl | Zweck |
|---|---|
| `npm run build` | Produktions-Build prüfen |
| `npm run typecheck` | TypeScript prüfen |
| `npm run test:rls:local` | RLS-Test gegen eine lokale PostgreSQL-Datenbank (ohne Supabase, z. B. für CI) |

> Datenschutz-Tipp: Next.js sammelt beim Entwickeln anonyme Nutzungsstatistiken. Mit `npx next telemetry disable` schaltest du das einmalig ab. (Die fertige App enthält keinerlei Tracking.)

### 5. Auf GitHub hochladen und über Vercel veröffentlichen

**GitHub**

1. Lege auf [github.com/new](https://github.com/new) ein neues Repository an (am besten **Private**).
2. Lade den Code hoch, z. B. mit [GitHub Desktop](https://desktop.github.com) („Add existing repository“ → „Publish repository“) oder im Terminal:
   ```bash
   git init
   git add .
   git commit -m "Zwischenraum Testversion"
   git branch -M main
   git remote add origin https://github.com/DEIN-NAME/zwischenraum.git
   git push -u origin main
   ```
   Prüfe vorher, dass **`.env.local` nicht** mit hochgeladen wird. Sie ist in `.gitignore` eingetragen.

**Vercel**

1. Melde dich bei [vercel.com](https://vercel.com) mit deinem GitHub-Konto an und klicke auf **„Add New… → Project“**.
2. Wähle dein Repository aus und klicke auf **„Import“**.
3. **Root Directory:** Liegt die App wie hier im Unterordner `zwischenraum`, wähle bei „Root Directory“ **`zwischenraum`** aus. Framework „Next.js“ wird automatisch erkannt.
4. Unter **„Environment Variables“** eintragen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`: deine spätere Adresse, z. B. `https://zwischenraum-test.vercel.app`

   (**Nicht** den Secret key!)
5. Klicke auf **„Deploy“**. Nach 1–2 Minuten ist die App online.
6. Zurück in Supabase unter **Authentication → URL Configuration**: **Site URL** auf deine Vercel-Adresse setzen und `https://DEINE-APP.vercel.app/auth/callback` bei den **Redirect URLs** ergänzen.
7. Bitte **nicht** „Vercel Analytics“ oder „Speed Insights“ aktivieren: Die App soll frei von Tracking bleiben.

Die Datei `vercel.json` legt fest, dass die Server-Funktionen in **Frankfurt (`fra1`)** laufen, also in derselben Region wie die Datenbank.

---

## Sicherheit und Datenschutz

**Row Level Security (RLS) auf allen Tabellen.** Die Datenbank selbst entscheidet, wer was sehen darf, auch wenn jemand die App umgeht und die API direkt aufruft.

| Regel | Umsetzung |
|---|---|
| Klient:innen sehen nur eigene Daten | Policies mit `client_id = auth.uid()` |
| Therapeut:innen sehen nur ihre zugeordneten Klient:innen | Hilfsfunktion `is_therapist_of(client_id)` |
| Tagebucheinträge nur, wenn freigegeben | Policy `is_shared and is_therapist_of(client_id)` |
| Sitzungsnotizen nur für die Verfasser:in | Policy `therapist_id = auth.uid()`, keine Policy für Klient:innen |
| Niemand kann Rolle oder Zuordnung ändern | Spaltenrechte: nur `display_name` ist änderbar |
| Klient:innen können nur „erledigt“ und Reflexion ändern | Spaltenrechte auf `exercise_assignments` |
| Buchen nur bei der eigenen Therapeut:in, Storno nur > 24 h vorher | geprüfte Datenbankfunktionen `book_slot()` / `cancel_booking()` |
| Registrierung als Klient:in nur mit gültigem Code | Trigger `handle_new_user()` bricht sonst die Registrierung ab |
| Nicht angemeldete Besucher:innen | haben gar keine Tabellenrechte |

**Weitere Maßnahmen**

- **Serverseitige Rollenprüfung** bei jeder Seite und jeder Aktion (`requireRole()` in `lib/auth.ts`), zusätzlich prüfen die Aktionen die Zuordnung zur Klient:in. Alle Datenbankzugriffe laufen auf dem Server, der Browser spricht nie direkt mit Supabase.
- **Keine Secrets im Code:** Die App verwendet nur den öffentlichen Schlüssel. Der geheime Schlüssel wird nur von den lokalen Skripten genutzt.
- **Kein Tracking, keine Drittanbieter-Skripte:** Die Schrift (Atkinson Hyperlegible Next) wird lokal ausgeliefert. Eine strenge **Content-Security-Policy** mit Nonce erlaubt nur eigene Skripte. Dazu kommen Header gegen Clickjacking, MIME-Sniffing und Referrer-Weitergabe sowie `noindex`.
- **Rückmeldungen über feste Schlüssel** (`?m=gespeichert`), nie freier Text in der URL. So lassen sich keine gefälschten Meldungen einschleusen.
- **Datenminimierung:** E-Mail-Adressen liegen nur bei Supabase Auth und nicht in den App-Tabellen. Das interne Kürzel zu einem Einladungscode sieht nur die Therapeut:in.

**Vor einem Echtbetrieb wären unter anderem nötig:** Prüfung der Therapeut:innen-Konten (derzeit kann sich jede Person als Therapeut:in registrieren), Datenschutz-Folgenabschätzung (DSGVO Art. 35), Auftragsverarbeitungsverträge mit Supabase und Vercel, eigener E-Mail-Versand (SMTP), Zwei-Faktor-Anmeldung, Backups und Löschkonzept, rechtliche Prüfung (Medizinprodukterecht, Berufsrecht).

---

## RLS-Tests

Es gibt drei Varianten, alle prüfen die Regeln mit **zwei Demo-Klient:innen**:

| Test | Wie | Was |
|---|---|---|
| `supabase/tests/rls_test.sql` | Im Supabase SQL Editor ausführen | 46 Prüfungen direkt in der Datenbank: Registrierung mit Code, Klient:in A ↔ B, Therapeut:in, fremde Therapeut:in, ohne Anmeldung. Rollt alle Testdaten zurück. |
| `npm run test:rls` | Lokal, gegen dein Supabase-Projekt | 21 Prüfungen über die echte API mit den Demo-Konten |
| `npm run test:rls:local` | Lokal oder in CI mit PostgreSQL 15+ | Führt die Migrationen in einer frischen Datenbank aus (mit einem Supabase-Ersatz in `supabase/tests/local/`) und dann `rls_test.sql` |

Der GitHub-Workflow `.github/workflows/zwischenraum-ci.yml` führt bei jedem Push Typprüfung, Build und `test:rls:local` aus.

---

## Datenmodell

```
auth.users (Supabase)
   │ 1:1 (Trigger handle_new_user)
   ▼
profiles ───────────────┐ role: therapist | client
   │ therapist_id ◄──────┘ (Klient:in → genau eine Therapeut:in)
   │
   ├── invitations            Code, Kürzel, gültig bis, eingelöst von
   ├── journal_entries        Datum, Stimmung 1–10, Text, Tags, is_shared, shared_at
   ├── session_notes          nur Verfasser:in
   ├── appointment_slots      Zeitfenster; client_id gesetzt = gebucht (keine Überschneidungen)
   ├── exercises              Bibliothek je Therapeut:in
   │     └── exercise_assignments   Hinweis, erledigt am, Reflexion
   ├── crisis_plans           Warnzeichen, was hilft, Kontakte (JSON)
   │
   ├── ai_summaries           ⏳ vorbereitet (nur Struktur)
   └── notifications          ⏳ vorbereitet (nur Struktur)
```

Alle Zeitpunkte werden in UTC gespeichert und in österreichischer Zeit (Europe/Vienna) angezeigt.

---

## Ordnerstruktur

```
zwischenraum/
├── app/                         Seiten (Next.js App Router)
│   ├── page.tsx                 Startseite
│   ├── anmelden/                Anmeldung
│   ├── registrieren/            Auswahl, /praxis (Therapeut:in), /einladung (Klient:in mit Code)
│   ├── auth/callback/           Ziel des E-Mail-Bestätigungslinks
│   ├── konto/                   Name ändern, Abmelden
│   ├── krise/                   Krisenhilfe (öffentlich) + /bearbeiten (Krisenplan)
│   ├── tagebuch/                Klient:in: Liste + Diagramm, /neu, /[id] bearbeiten
│   ├── uebungen/                Klient:in: zugewiesene Übungen, /[id] erledigen + Reflexion
│   ├── termine/                 Klient:in: buchen und stornieren
│   └── praxis/                  Therapeut:in
│       ├── page.tsx             Dashboard (Klient:innen-Liste)
│       ├── klient-innen/[id]/   Überblick, /notizen, /uebungen, /krisenplan
│       ├── termine/             Zeitfenster verwalten
│       ├── uebungen/            Bibliothek, /neu, /[id]
│       ├── einladungen/         Einladungscodes
│       └── actions.ts           Server Actions der Therapeut:innen
├── components/                  UI-Bausteine (Diagramm, Formulare, Navigation …)
├── lib/                         Auth/Rollenprüfung, Supabase-Client, Datum, Validierung
├── proxy.ts                     Sitzung erneuern, Schutz der Bereiche, Content-Security-Policy
├── supabase/
│   ├── migrations/              Schema + Indizes, RLS-Policies + Rechte
│   └── tests/                   rls_test.sql (+ lokaler Supabase-Ersatz für CI)
├── scripts/
│   ├── seed.mjs                 Demo-Daten
│   ├── test-rls.mjs             RLS-Test über die API
│   └── test-rls-local.sh        RLS-Test gegen lokales PostgreSQL
├── .env.example                 Vorlage für Umgebungsvariablen
└── vercel.json                  Region Frankfurt
```

---

## Für später vorbereitet

Diese Funktionen sind **nicht umgesetzt**. Datenmodell und Code sind aber so angelegt, dass sie ohne Umbau ergänzt werden können.

### KI-Zusammenfassungen von Einträgen und Sitzungen

- **Tabelle `ai_summaries`** ist angelegt (Klient:in, Therapeut:in, Quelle `shared_journal_entries` oder `session_notes`, verwendete Einträge `source_ids`, Zeitraum, Text, Modell). RLS erlaubt bereits **nur der zugeordneten Therapeut:in das Lesen**. Schreibrechte gibt es für App-Nutzer:innen bewusst keine.
- **Einwilligung:** `profiles.ai_consent_at` ist vorbereitet. Eine Zusammenfassung darf nur erzeugt werden, wenn die Klient:in zugestimmt hat.
- **Wo es andockt:** eine Server Action bzw. ein Route Handler (z. B. `app/praxis/klient-innen/[id]/zusammenfassung/`) oder eine Supabase Edge Function, die
  1. die Rolle prüft (`requireRole("therapist")` + `getOwnClient`),
  2. **mit der Sitzung der Therapeut:in** die Einträge lädt, sodass RLS automatisch nur **geteilte** Einträge liefert,
  3. den Text an ein KI-Modell mit EU-Datenverarbeitung schickt,
  4. das Ergebnis serverseitig (Service-Rolle, nur dort) in `ai_summaries` speichert.
- Anzeige: im Tab „Überblick“ der Klient:innen-Detailansicht (`app/praxis/klient-innen/[id]/page.tsx`).

### Benachrichtigungen an Therapeut:innen

- **Tabelle `notifications`** ist angelegt (Empfänger:in, Art: `entry_shared`, `slot_booked`, `slot_cancelled`, `exercise_completed`, `exercise_assigned`, Nutzdaten, gelesen am). RLS: nur Empfänger:in liest und markiert als gelesen. **Einstellungen** sind in `profiles.notification_prefs` vorbereitet.
- **Wo es andockt:**
  - `journal_entries.shared_at` wird bereits beim Teilen gesetzt. Ein zusätzlicher Datenbank-Trigger kann daraus einen `entry_shared`-Eintrag erzeugen.
  - `book_slot()` / `cancel_booking()` sind die zentralen Stellen für `slot_booked` / `slot_cancelled`.
  - `completeAssignment` in `app/uebungen/actions.ts` bzw. ein Trigger auf `exercise_assignments.completed_at` liefert `exercise_completed`.
  - Versand per E-Mail/Push über eine Supabase Edge Function (Database Webhook auf `notifications`), Anzeige als Glocke im `SiteHeader`.
- Wichtig bleibt: Die Krisenseite weist ausdrücklich darauf hin, dass **keine automatische Benachrichtigung** erfolgt. Daran sollen auch spätere Benachrichtigungen nichts ändern, sie sind kein Notfallkanal.

---

## Häufige Probleme

| Problem | Lösung |
|---|---|
| „Supabase ist nicht konfiguriert“ | `.env.local` fehlt oder ist unvollständig (Schritt 3). Nach Änderungen `npm run dev` neu starten. |
| Registrierung: „Einladungscode ungültig“ | Code ist schon verwendet, älter als 14 Tage oder vertippt. Neuen Code unter „Einladungen“ erstellen. |
| Nach der Registrierung kommt keine E-Mail | In Supabase „Confirm email“ ausschalten (Schritt 1.5) oder eigenes SMTP einrichten. |
| `npm run seed`: „Bitte … SUPABASE_SECRET_KEY …“ | Secret key in `.env.local` eintragen. |
| SQL Editor: „relation … already exists“ | Die Migrationen sind wiederholbar. Fehler entstehen nur, wenn eine Datei unvollständig kopiert wurde. Datei erneut komplett einfügen. |
| Vercel-Build schlägt fehl, „No Next.js version detected“ | Root Directory auf `zwischenraum` stellen (Schritt 5.3). |
