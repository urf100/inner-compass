# INNER COMPASS 🧭

**Lokale, wissenschaftlich informierte Selbstreflexion als installierbare iPhone-Web-App (PWA)**

Stand: 23. November 2026 · Sprache: Deutsch · Keine Kontopflicht · Keine externe KI-Abhängigkeit

## Inhalt dieser Lieferung

- `index.html`, `style.css`, `app.js`, `engine.js`, `data.js`: fertige interaktive Web-App.
- `manifest.webmanifest`, `sw.js`, `assets/`: Home-Screen-Installation und Offline-Cache.
- `KURZBEFEHLE-BAUANLEITUNG.md`: konkrete native Kurzbefehle-Rezepte mit Modulen, Variablen, Aktionen, Testfällen und KI-Fallback.
- `DATENMODELL.schema.json`: prüfbare Export-Struktur, ergänzend die Aufzeichnungen im Dokument.
- `PSYCHOLOGIE-UND-QUELLEN.md`: Zuordnung der Funktionen zu Forschungsansätzen und Grenzen.
- `tests/`: ausführbare Logik-/Browser-Prüfungen; die Screenshots aus dem Entwicklungsbrowser sind nur Referenz, keine iPhone-Abnahme.

## Features – tatsächlich eingebaut

| Bereich | Umsetzung |
|---|---|
| Startmenü | 17 Wege in drei ruhigen Gruppen, darunter Morgenausrichtung und Soforthilfe |
| Vier Tiefen | Micro / Standard / Tief / Offen; Wechsel während der Reflexion, vorhandene Antworten bleiben |
| Gefühlssprache | 216 unterschiedliche emotionale Begriffe bzw. Zustandsausdrücke, 20 Gruppen; Mehrfachauswahl, ungeklärtes Gefühl möglich |
| Bedürfnisse | 9 Kategorien und 72 konkrete Bedürfnisse; bis zu drei auswählen; nur tentative Vorschläge |
| Selbstmitgefühl | 160 originale Situationen-Sätze plus zusammengesetzter Dreischritt; 5 Tonalitäten |
| Strategien | 54 Übungen, jede mit Ziel, Dauer, Schritten, Anpassung, Risiken, Abbruchkriterium und Abschluss |
| Journaling | 18 geführte Vorlagen mit überspringbaren Fragen und bearbeitbarer Vorschau |
| Muster | Zählungen aus explizit gespeicherten Reflexionen; kein Diagnostizieren und keine erfundenen Korrelationen |
| Woche | 7-Tage-Überblick und freiwillige Wochenintention |
| Datenschutz | Ohne automatische Eintragsspeicherung, kein Analytics-Skript, kein Netz-API-Request, JSON-Export/Import, Einzellöschung, Gesamtlöschung |
| KI | **Optional, nicht direkt in die Web-App eingebaut.** Neutraler Prompt; bewusstes Kopieren; native Apple-Shortcuts-Anleitung für „Use Model“ |
| Vorlesen/Diktieren | Gesprochene Zusammenfassung erst nach Klick und Bestätigung, sofern Browser unterstützt; Eingabe über iOS-Tastaturdiktat |
| Hilfe | Direkt anwählbare Telefonnummern für Europa/Österreich, klar keine Live-Überwachung |

## In fünf Schritten auf dem iPhone

1. Entpacke **das ganze Projekt**. Die Dateien müssen zusammenbleiben. `index.html` alleine reicht nicht.
2. Lade das Projekt auf eine statische **HTTPS-Webseite** hoch, z. B. GitHub Pages, Cloudflare Pages oder Netlify. Es ist kein Serverprogramm, Datenbankzugang oder API-Schlüssel erforderlich. **Keine privaten Journale hochladen.**
3. Rufe die veröffentlichte URL in **Safari auf deinem iPhone** auf und prüfe, ob die Startseite und ein Micro-Check-in funktionieren.
4. Safari → **Teilen** → **Zum Home-Bildschirm** → **Hinzufügen**. Öffne danach INNER COMPASS über das neue Symbol. Die Home-Screen-Web-App kann getrennte lokale Daten gegenüber Safari verwenden.
5. Öffne die App im neuen Symbol **einmal online**, damit der Offline-Cache angelegt wird. Teste danach den Flugmodus und exportiere bei Bedarf deine explizit gespeicherten Einträge.

### Konkreter kostenloser Hostingweg: GitHub Pages

- Erstelle ein neues Repository `inner-compass`, das **nur den hier enthaltenen Code** enthält; die eigene Reflexionsdatei gehört nie ins Repo.
- Lade den Inhalt des Ordners `inner-compass/` in das Wurzelverzeichnis des Repositories.
- Repository-Einstellungen → Pages → Build and deployment → Deploy from branch → `main` → `/ (root)` → Save.
- Verwende anschließend `https://DEIN-BENUTZERNAME.github.io/inner-compass/` (Beispiel, **keine tatsächliche URL**).
- Änderungen am Code können öffentlich sein. Die persönlichen Einträge werden nicht an GitHub gesendet, weil sie nur im Browserprofil gespeichert werden.

Eine öffentlich erreichbare statische Webseite ist **keine private Server-Ablage**, aber Code, Hosting-Anbieter und aufgerufene URLs können übliche Zugriffsmetadaten erhalten. Die App selbst sendet keine Einträge per API oder Tracking.

### Deep Links für Kurzbefehle

Diese Navigation überträgt **ausschließlich einen festen Modulnamen**, niemals Gefühlsdaten:

- `https://DEIN-HOST/inner-compass/?start=daily`
- `...?start=understand`
- `...?start=compassion`
- `...?start=overwhelm`
- `...?start=needs`
- `...?start=thought`
- `...?start=critic`
- `...?start=relationship`
- `...?start=coping`
- `...?start=positive`
- `...?journal=morning`, `...?journal=evening`
- `...?view=library`, `...?view=patterns`, `...?view=weekly`, `...?view=settings`, `...?view=records`, `...?view=support`

Kurzbefehle mit „URL“ und „URLs öffnen“ können diese Links aufrufen. Je nach iOS-Einstellungen kann sich die Website dabei in Safari statt in der installierten Web-App öffnen. **Daher Speicher nicht unbemerkt über beide Kontexte hinweg als synchronisiert ansehen.**

## Datenschutzmodell

**Nicht gespeichert**, solange du nicht „Bewusst lokal speichern“ drückst: gesamte laufende Reflexion, Schreibentwürfe, Überspringen, offene Gesprächsbeiträge.

**Lokale Einstellungen:** Sobald du Einstellungen änderst, schreibt der Browser sie in seinen lokalen Speicher (inkl. Ausschlussliste; Übungsbewertungen nur bei zusätzlicher Option).

**Gespeicherte Reflexionen/Journale:** Im jeweiligen Browserprofil über `localStorage`. Das ist weder mit einer eigenen Passphrase verschlüsselt noch garantiert dauerhaft. Keine Hintergrundsynchronisierung und keine automatische Zusammenführung zwischen iPhone/Computer/Safari/Home-Screen-App. JSON-Exporte sind **nicht verschlüsselt**.

**Daten löschen:** In der App „Privat“ → „Einträge verwalten“ für einzelne Einträge oder „Alle App-Daten löschen“ für den gesamten lokalen App-Bestand. Zusätzlich ggf. Browser-/Website-Daten in iOS-Einstellungen prüfen. Ein zuvor exportiertes JSON wird dadurch **nicht** gelöscht.

**KI:** Ohne direkte API-Verbindung. Der optionale „KI-Prompt“ wird nur nach separater Freigabe in die Zwischenablage kopiert; Kopieren ist noch kein externer Modellaufruf. Auf Wunsch kann ein selbst eingerichteter Apple-Kurzbefehl den Text verarbeiten, mit eigener Datenschutzentscheidung. Niemals einen API-Schlüssel in HTML/JS eintragen.

## Wichtige Grenzen

- Selbstreflexion und Psychoedukation, **kein Medizinprodukt, keine Psychotherapie und keine Krisenüberwachung**.
- Kein fest zugesichertes Speichervolumen, keine E2E-Verschlüsselung, keine iCloud-Synchronisierung.
- Keine direkte Kalender-, Erinnerungs-, Fokus- oder Apple-Watch-Steuerung aus der Website. Dafür ist eine **separat auf deinem Gerät zu erstellende Kurzbefehle-Automation** vorgesehen.
- Die lokale, regelbasierte Gesprächsführung ist kein lernendes Sprachmodell. Die Matching-Heuristik ist nicht klinisch validiert.
- Die Zeitangaben der Reflexion sind Richtwerte, kein Leistungsmaßstab.

## Fehlerbehebung

- **Weiße Seite:** Alle Dateien hochgeladen? Öffne Konsole oder lade neu; JavaScript-Module benötigen auf iOS einen korrekten HTTPS-Host.
- **Offline nicht verfügbar:** Erst auf der HTTPS-Seite online öffnen, dann Home-Screen-App öffnen und Cache testen. `file://` garantiert keine PWA-Funktion.
- **Eintrag scheinbar weg:** Hast du ihn im Safari-Tab gespeichert, öffnest jetzt aber die separat installierte Web-App? Prüfe den ursprünglichen Kontext.
- **Speichern fehlgeschlagen:** Privates Browserfenster oder Speicherrestriktion möglich; das App-Feedback beachten. Nicht von einer erfolgreichen Speicherung ausgehen.
- **iPhone-Diktat:** Systemtastatur und Diktierfunktion aktivieren, auf das Mikrofon der Tastatur tippen. Die Datenverarbeitung durch iOS-Diktat kann Apple-seitig von Konfiguration und Netz abhängen.
- **Apple-Intelligence-Aktion nicht sichtbar:** iPhone-/iOS-/Sprachvoraussetzungen und Einstellungen prüfen; regelbasierte Alternative weiterverwenden.

## Für Entwickler

- Vanilla JavaScript (ES-Module), kein Build-Schritt und keine Drittbibliothek.
- Offlineserviceworker cached ausschließlich eigene Assets. Eine App-Änderung erfordert einen neuen Cache-Namen in `sw.js`, falls Benutzer die aktualisierte Version erhalten sollen.
- Nach Erweiterung der JSON-Struktur `version` und `DATENMODELL.schema.json` migrationsbewusst anpassen.
- Testbefehle: `node tests/engine.test.mjs`, `python tests/browser_check.py` (Playwright/Chromium im Entwicklungsumfeld).

Für die iOS-Nativarchitektur, vollständige Aktionslisten und Testmatrix: **`KURZBEFEHLE-BAUANLEITUNG.md`**.
