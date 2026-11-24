# INNER COMPASS – Apple-Kurzbefehle-Bauanleitung

**Version 1 · 23. November 2026 · iPhone-first**

> **Wahrheitsgemäßer Status:** Die Web-App ist als auslieferbare Dateien erstellt und im Entwicklungsbrowser getestet. Es ist **keine importierbare, signierte `.shortcut`-Datei** erstellt worden. Ein nativer Kurzbefehl kann nicht aus dieser Umgebung auf deinem iPhone angelegt oder getestet werden. Die nachstehenden Anweisungen sind vollständige Baupläne mit Testpunkten, keine Behauptung einer erfolgten Installation.

## 1. Geräte-/Fähigkeitsprüfung vor dem Bau

Die Angaben zu *deinem* iPhone, deiner iOS-Version, deinen Shortcuts-Aktionen und erlaubten Integrationen fehlen. Daher ist Folgendes eine bedingte Prüfung, **kein erfundener Gerätebefund**.

| Prüfung auf dem iPhone | Vorgehen | Konsequenz |
|---|---|---|
| iPhone und iOS | Einstellungen → Allgemein → Info → Modellname / iOS-Version | Bedienoberflächen, Aktionen und KI-Modelle können variieren |
| Kurzbefehle installiert | App „Kurzbefehle“ öffnen, oben „+“, Suche nach „Aus Menü auswählen“/`Choose from Menu`, „Nach Eingabe fragen“/`Ask for Input`, „URLs öffnen“/`Open URLs` | Wenn nicht vorhanden: Shortcuts aus dem App Store installieren; keine native Automationszusage |
| Offline-Fähigkeiten | „Text“, „Liste“, „Aus Liste auswählen“, „Wenn“, „Ergebnis anzeigen“ suchen | Grundfunktionen laufen lokal ohne KI und ohne Webnetz |
| Apple Intelligence | Einstellungen → Apple Intelligence & Siri; in Kurzbefehle nach `Use Model`/„Modell verwenden“ suchen | Laut Apple auf geeigneten Geräten u. a. iPhone 15 Pro/Pro Max und iPhone 16 oder neuer; Sprache/Region/OS/Einstellungen müssen ebenfalls passen |
| Modellwahl prüfen | `Use Model` hinzufügen und verfügbare Optionen inspizieren | Apple dokumentiert On-Device, Private Cloud Compute (Cloud/Cloud Pro) und ChatGPT-Erweiterung – **nur tatsächlich sichtbare Option wählen** |
| Dateien | App „Dateien“ → „Auf meinem iPhone“ und ggf. „iCloud Drive“ prüfen | Keine heimliche Cloudspeicherung; die Web-App besitzt eigenständigen Browser-Speicher |
| Diktat, Vorlesen | iOS-Tastaturdiktat bzw. `Dictate Text`, `Speak Text` in Kurzbefehle suchen | Nur verwenden, wenn erwünscht; Sprachverarbeitung kann geräte- bzw. dienstabhängig sein |
| Uhr, Kalender, Fokus | In Kurzbefehle die entsprechenden Aktionen und Berechtigungen prüfen | Erinnerungen nur nach ausdrücklicher Einwilligung; Watch-App kann einen abweichenden Aktionsumfang haben |

Referenzen: [Apple – Apple Intelligence in Kurzbefehlen](https://support.apple.com/guide/shortcuts/use-apple-intelligence-in-shortcuts-tpg3vrvwmclv/ios), [Apple – Auswahllisten](https://support.apple.com/en-sg/guide/shortcuts/apd4dcacc115/ios), [Apple – Wörterbücher](https://support.apple.com/en-ie/guide/shortcuts/apd43b69f337/ios), [Apple – URL-Schema](https://support.apple.com/en-ie/guide/shortcuts/apd624386f42/10.0/ios/27).

**Alternative bei nicht unterstützter Aktion:** Die Web-App selbst deckt alle Hauptmenüpunkte ohne `Use Model` ab. Nutze auf dem iPhone über Safari / Home Screen das entsprechende Modul. Kein wesentlicher Kernfluss hängt an Siri, Watch, iCloud oder ChatGPT.

## 2. Architekturentscheidung

```
Startbildschirm / Siri
       |
       v
INNER COMPASS               (nativer, kleiner Haupt-Kurzbefehl)
       |
       +--> IC • Web öffnen (ein streng begrenzter URL-Router)
       |         |
       |         +--> Installierte Web-App / Safari: 17 Funktionswege
       |
       +--> IC • Micro      (echter nativer Offline-Fallback)
       +--> IC • Grounding  (echter nativer Offline-Fallback)
       +--> IC • KI Dialog  (optional: Use Model, Freigaben erforderlich)
       +--> IC • Sicherheit (echter nativer Schnellzugriff)
       +--> IC • Morgen / IC • Abend (optional, Erinnerungslink)
```

**Warum hybrid?** Native Kurzbefehle sind sehr gut für Siri, einfache Eingabe und Startaktionen. 216 Emotionsbegriffe, 54 Übungsdetails, 160 Sätze, Sessions und Muster-Rückblicke werden in einem einzigen gigantischen nativen Kurzbefehl hingegen schwer pflegbar. Der stabile Kern ist die bereits implementierte PWA. Die kleinen nativen Module funktionieren auch bei fehlender Web-App und ohne KI.

**Grenze:** Es gibt **keine automatische Datensynchronisierung zwischen nativer Micro-Reflexion und Web-App**. Ein natives Ergebnis wird nur dort gespeichert, wo du es in der Dateien-App ausdrücklich ablegst. Nichts wird über URL-Parameter als privater Text übertragen.

## 3. Modulkarte: 17 Menüpunkte mit festem Deeplink

Ersetze `BASE` durch deine tatsächliche HTTPS-URL **mit abschließendem Slash**, z. B. `https://NAME.github.io/inner-compass/`.

| Menüeintrag | Zielmodul | feste Route ab BASE | Implementierungsart |
|---|---|---|---|
| 🌱 Daily Emotional Check-In | Daily | `?start=daily` | Web-PWA |
| 🧠 Understand What I’m Feeling | Understand | `?start=understand` | Web-PWA |
| ❤️ Practice Self-Compassion | Compassion | `?start=compassion` | Web-PWA |
| 🌊 I’m Overwhelmed | Overwhelm | `?start=overwhelm` | Web-PWA |
| 🧭 Discover What I Need | Needs | `?start=needs` | Web-PWA |
| 💭 Work Through a Difficult Thought | Thought | `?start=thought` | Web-PWA |
| 🪞 Explore My Inner Critic | Critic | `?start=critic` | Web-PWA |
| 🤝 Process a Relationship Situation | Relationship | `?start=relationship` | Web-PWA |
| 🛠️ Find a Coping Strategy | Coping | `?start=coping` | Web-PWA; zusätzlich `?view=library` für alle Übungen |
| 📓 Guided Journaling | Journal | `?view=journal` | Web-PWA |
| 🌤️ Explore Positive Emotions | Positive | `?start=positive` | Web-PWA |
| 🌙 Evening Reflection | Evening | `?journal=evening` | Web-PWA |
| 📊 Discover My Patterns | Patterns | `?view=patterns` | Web-PWA |
| 📅 Weekly Emotional Review | Weekly | `?view=weekly` | Web-PWA |
| ⚙️ Preferences and Privacy | Settings | `?view=settings` | Web-PWA |
| 🆘 Grounding and Immediate Support | Support | `?view=support` | Web-PWA + native Notfalloption |
| 🌅 Morning Compass | Morning | `?journal=morning` | zusätzlich eingebaut |

Keine dieser Routen enthält persönliche Gedanken oder Gefühle; nur fest erlaubte Programmnamen werden akzeptiert.

## 4. Gemeinsame Variablennamen / Datenfluss

| Variable | Typ | Erzeugung / Ziel | Zweck |
|---|---|---|---|
| `BASE_URL` | Text | Im Router als literal HTTPS-Pfad definiert | Hostadresse, kein Geheimnis |
| `MODULE_KEY` | Text | `Shortcut Input` von `INNER COMPASS` → `IC • Web öffnen` | Ein erlaubter Modulname |
| `ROUTES` | Dictionary | Aktion `Dictionary` im Router | Whitelist mit 17 festen Routen |
| `ROUTE_SUFFIX` | Text | `Get Dictionary Value` | Nur bekannter Query-String |
| `TARGET_URL` | URL | `URL`-Aktion → `Open URLs` | Browser öffnen; nie Reflexionstext |
| `EMOTION_TEXT` | Text | `Ask for Input` → `Set Variable` | Natives Micro-Gefühl |
| `INTENSITY_VALUE` | Text | `Choose from List` → `Set Variable` | 0–10 oder offen |
| `NEED_TEXT` | Text | `Choose from List` → `Set Variable` | Ein Bedürfnis oder offen |
| `MICRO_SUMMARY` | Text | `Text` → `Show Result` / optional `Save File` | Nicht automatisch gespeichert |
| `AI_QUESTION` | Text | `Ask for Input` → Modellzweig | Daten erst nach Modellauswahl und Zustimmung |
| `AI_RESPONSE` | Text / Modellantwort | `Use Model` → `Show Result` | **Nur anzeigen**, nie Befehle ausführen |
| `AI_MODEL_CHOICE` | Menüentscheidung | Menüzweig | On-device vs Cloud vs externer Dienst |

Namen dienen der Nachvollziehbarkeit. In Kurzbefehle kannst du magische Variablen direkt antippen; `Set Variable` ist optional, wenn der Datenfluss dadurch eindeutig bleibt. Für Fehlersuche sind explizite Namen hilfreich.

## 5. Native Kurzbefehle tatsächlich bauen – Aktion für Aktion

Öffne **Kurzbefehle → Alle Kurzbefehle → „+“**. Vergib exakt den angegebenen Shortcut-Namen. Die folgenden Aktionstitel orientieren sich an den offiziellen englischen Apple-Bezeichnungen; unter deutscher Systemsprache können sie übersetzt sein. In der Aktionssuche helfen meist beide Suchbegriffe.

### A. `IC • Web öffnen` – der zuverlässige Modulrouter

**Vorbereitung:** Die Website muss über HTTPS erreichbar sein, und `BASE_URL` muss vor der Nutzung ersetzt werden. Eingabetyp des Kurzbefehls: Text; wenn aus dem Launcher aufgerufen, erhält er `Shortcut Input` / „Kurzbefehleingabe“.

| # | Exakte Aktion (Suchbegriff) | Wo / Parameter / Input | Ausgabe / Verbindung / Zweig | Test |
|---|---|---|---|---|
| A1 | `Dictionary` (`Wörterbuch`) | Als **erste Aktion**: Schlüssel `daily`, `understand`, `compassion`, `overwhelm`, `needs`, `thought`, `critic`, `relationship`, `coping`, `journal`, `positive`, `evening`, `patterns`, `weekly`, `settings`, `support`, `morning`; Werte exakt aus Tabelle 3 als *Text* | Magische Ausgabe `ROUTES` | Probeweise `daily` auswählen → `?start=daily` sichtbar |
| A2 | `Get Dictionary Value` (`Wörterbuchwert abrufen`) | Dictionary = `ROUTES`, Key = `Shortcut Input` (Text) | Magische Ausgabe `ROUTE_SUFFIX` | Mit Eingabe `weekly` erhältst du `?view=weekly` |
| A3 | `If` (`Wenn`) | Bedingung: `ROUTE_SUFFIX` **hat einen Wert** | Wenn wahr → A4; sonst → A3a | Eingabe `irgendwas` löst Standardstart aus |
| A3a | `Text` | Nur im `Otherwise`-Zweig: `?view=home` | Ausgabe für A4 als Ersatz; außerhalb eine gemeinsame Variable `SAFE_SUFFIX` setzen | Unbekannter Schlüssel führt nur zur Startseite |
| A4 | `Set Variable` (`Variable festlegen`) | Name `SAFE_SUFFIX`; im echten Zweig = `ROUTE_SUFFIX`, im Sonst-Zweig = Ausgabe von A3a | A5 nimmt `SAFE_SUFFIX` | Kein ungeprüfter URL-Input |
| A5 | `Text` | Text `https://DEIN-HOST/inner-compass/` direkt gefolgt von magischer Variable `SAFE_SUFFIX` | Vollständige URL als Text | Prüfe `?view=weekly` im Testresultat |
| A6 | `URL` (`URL`) | Eingabe = Text von A5 | `TARGET_URL` | URL zeigt ausschließlich feste Route |
| A7 | `Open URLs` (`URLs öffnen`) | Eingabe = `TARGET_URL` | Safari bzw. iOS-geeigneter Webkontext öffnet sich | Test `daily`, `support`, ungültig und Offlinefall |

**Vereinfachte Variante für den Anfang:** Wenn das Dictionary-`If` schwierig ist, baue zuerst nur `URL` mit der fest eingegebenen Startadresse und `Open URLs`. Später den Router ergänzen. **Wichtig:** Ein iOS-URL-Aufruf muss nicht automatisch in der separat installierten Home-Screen-PWA landen; er kann Safari öffnen.

### B. `IC • Micro` – 30–60 Sekunden ohne Cloud und ohne Modell

Vorab: Dieser Fallback ist absichtlich **weniger differenziert** als der Web-App-Micro-Flow, dafür vollständig nativ und offline. Eine leere/unklare Gefühlsbeschreibung ist erlaubt. Die Zustimmung zum Speichern ist **nicht** voreingestellt.

| # | Aktion | Eingabe / Einstellungen | Ausgabe / Bedingungen | Manuell testen |
|---|---|---|---|---|
| B1 | `Ask for Input` (`Nach Eingabe fragen`) | Typ **Text**; Prompt: „Was fühle ich? (Ein Wort, mehrere Worte oder ‚weiß nicht‘)“ | Ergebnis → B2 | „ängstlich“ eingeben; auch „weiß nicht“ testen |
| B2 | `Set Variable` | `EMOTION_TEXT` = Eingabe B1 | B3 | Keine Umdeutung des Wortlauts |
| B3 | `List` (`Liste`) | Werte `0,1,2,3,4,5,6,7,8,9,10,offen` als einzelne Listenelemente | B4 | 12 Elemente angezeigt |
| B4 | `Choose from List` (`Aus Liste auswählen`) | Prompt „Intensität 0–10?“, Mehrfachauswahl **aus** | B5; Cancel beendet ohne Speicherung | 0, 10, „offen“ testen |
| B5 | `Set Variable` | `INTENSITY_VALUE` = Listenauswahl B4 | B6 | Textwert bleibt unverändert |
| B6 | `List` | `Ruhe`, `Klarheit`, `Sicherheit`, `Verbindung`, `Akzeptanz`, `Unterstützung`, `Grenzen`, `Ausdruck`, `weiß nicht` | B7 | Jede Option erreichbar |
| B7 | `Choose from List` | Prompt „Was könnte ich brauchen?“; eine Auswahl | B8 | „weiß nicht“ möglich |
| B8 | `Set Variable` | `NEED_TEXT` = Ergebnis B7 | B9 | Auswahl angezeigt |
| B9 | `Text` | Wörtlich: `Ich bemerke: [EMOTION_TEXT]. Intensität: [INTENSITY_VALUE]. Vielleicht brauche ich: [NEED_TEXT]. Das ist eine menschliche Erfahrung. Ich darf sie ernst nehmen, ohne jede Deutung glauben oder sofort handeln zu müssen. Ein freundlicher nächster Schritt darf klein sein.` Die eckigen Platzhalter werden durch **magische Variablen** ersetzt; keine wörtlichen Klammerstrings stehen lassen. | Ergebnis = `MICRO_SUMMARY` | Stimmen alle drei vorherigen Antworten? |
| B10 | `Show Result` (`Ergebnis anzeigen`) | Eingabe = `MICRO_SUMMARY` | Text sichtbar | Keine Push-Mitteilung im Sperrbildschirm |
| B11 | `Choose from Menu` (`Aus Menü auswählen`) | Prompt „Was möchtest du tun?“; Zweige **Nicht speichern**, **Als Datei speichern** | B12 oder B13 | „Nicht speichern“ muss ohne Datei enden |
| B12 | `Stop This Shortcut` (`Kurzbefehl stoppen`) | Zweig **Nicht speichern** | Ende | Keine Datei anlegen |
| B13 | `Text` | Zweig **Als Datei speichern**: `MICRO_SUMMARY` und optional aktuelle Datumsaktion (`Current Date` / `Aktuelles Datum`) | Textdatei für B14 | Inhalt vor Speichern anzeigen |
| B14 | `Save File` (`Datei sichern` / `Datei speichern`) | Text aus B13; **Ask Where to Save = Ein**; vorhandene Datei nicht still überschreiben | Benutzer wählt bewusst On My iPhone oder iCloud Drive | Speicherort-Dialog erscheint; Cancel erstellt keine Datei |

**Wichtig:** Der B3-B7-Block soll physisch nacheinander laufen: Gefühl → Intensitätsliste → Bedürfnisliste. Die Variablen dürfen die Ausgabe nicht aus Versehen aus anderen Aktionen übernehmen.

**Fehlermodi:** Bei Abbruch von `Ask for Input`/`Choose from List` kann Shortcuts den Ablauf beenden. Das ist als **sicheres, speicherfreies Ende** gedacht. Wenn B14 aufgrund fehlender Dateiberechtigung scheitert, bleibt das Resultat aus B10 sichtbar; es wurde keine Speicherung versprochen.

### C. `IC • Grounding` – ohne Körperzwang

| # | Aktion | Input / Einstellung | Output / Verzweigung | Test |
|---|---|---|---|---|
| C1 | `Choose from Menu` | Prompt „Was wäre jetzt passend?“; Optionen `Raum wahrnehmen`, `Ich möchte einfach Pause`, `Soforthilfe`, `Beenden` | Je eigener Zweig | Alle Zweige aufrufbar |
| C2 | `Text` | Zweig `Raum wahrnehmen`: „Schau nach drei neutralen Gegenständen. Benenne ihre Farben. Wenn du dich unwohl fühlst, höre auf.“ | C3 | Ohne Augen schließen möglich |
| C3 | `Show Result` | Text von C2 | Lesbare Schritte | Offline testen |
| C4 | `Text` | Zweig `Ich möchte einfach Pause`: „Dies ist schwer. Du musst es nicht jetzt lösen.“ | C5 | Kein Atemzwang |
| C5 | `Show Result` | Text C4 | Ausgabe | Offline testen |
| C6 | `Run Shortcut` (`Kurzbefehl ausführen`) | Zweig `Soforthilfe`: `IC • Sicherheit` | Unterstützung | Kein erzwungenes Grounding vor Hilfe |
| C7 | `Stop This Shortcut` | Zweig `Beenden` | Ende | Keine Speicherung |

### D. `IC • Sicherheit` – sofortige Unterstützung

| # | Aktion | Input / Einstellung | Output / Verzweigung | Test |
|---|---|---|---|---|
| D1 | `Choose from Menu` | Prompt „Wenn du akut in Gefahr bist: echte Hilfe hat Vorrang. Was brauchst du?“ Optionen `Euronotruf 112`, `Österreich Rettung 144`, `Österreich Telefonseelsorge 142`, `Web-Hilfeseite`, `Abbrechen` | Zweig je Wahl | Keine anderen Reflexionsfragen davor |
| D2 | `URL` | Im 112-Zweig: `tel:112` | `Open URLs` (D3) | **Nicht probeweise einen echten Notruf auslösen**; URL im Editor prüfen |
| D3 | `Open URLs` | Eingabe D2 | Telefonaktion kann erscheinen | Nur mit berechtigter Absicht verwenden |
| D4 | `URL` + `Open URLs` | Entsprechend für `tel:144` und `tel:142` **in eigenen Zweigen** | Nummern nur in Österreich zutreffend (142/144) | Werte im Editor kontrollieren, keine Testanrufe |
| D5 | `Run Shortcut` | Im Web-Zweig `IC • Web öffnen` mit festem Textinput `support` | Soforthilfe der Website | Auch bei unsicherer Eingabe nicht zuerst speichern |
| D6 | `Stop This Shortcut` | Abbrechen | Ende | Jederzeit möglich |

Diese Anleitung kennt deinen tatsächlichen Standort nicht. 112 ist der Euronotruf; für andere Länder lokale Nummern verwenden. **Keine automatische Krisenerkennung, kein Monitoring.**

### E. `IC • KI Dialog` – **nur optional**, mit eindeutigen Freigaben

Erstelle dieses Modul erst, wenn `Use Model` auf deinem Gerät wirklich verfügbar ist. `Follow Up` bei `Use Model` kann mehrere Rückfragen innerhalb **einer Aktion** ermöglichen; außerhalb dieses Ablaufs ist native Gesprächskontinuität nicht garantiert.

| # | Aktion | Input / Einstellung | Output / Zweig | Test |
|---|---|---|---|---|
| E1 | `Choose from Menu` | Prompt „Wohin dürfen die freiwillig eingegebenen Worte verarbeitet werden?“ Zweige `Auf dem Gerät` / `Apple-Cloud (falls verfügbar)` / `ChatGPT (falls aktiviert)` / `Ohne KI / Abbrechen` | E2–E8, nur wirklich verfügbare Modelle einbauen | Offline/ohne KI sofort abbrechen können |
| E2 | `Ask for Input` | Im gewählten KI-Zweig: Typ Text; Hinweis „Teile nur, was du weitergeben möchtest; keine Namen oder Geheimnisse nötig.“ | `AI_QUESTION` | Test mit harmlosen Beispielsätzen |
| E3 | `Text` | System-/Arbeitsanweisung aus `prompts/SYSTEM.txt` + **eine** neue Zeile + `AI_QUESTION` | Modellprompt | Sichtprüfung: keine Diagnose, nur eine Frage |
| E4 | `Use Model` (`Modell verwenden`) | **Im On-Device-Zweig**: Model `On-Device`; Input = E3; `Follow Up` optional ein; Textausgabe bevorzugen | `AI_RESPONSE` → E7 | Ohne Internet einfache harmlose Frage testen, sofern auf Gerät möglich |
| E5 | `Use Model` | **Im Apple-Cloud-Zweig**: Model `Cloud`/`Cloud Pro`; Input E3; nur nach Auswahl | `AI_RESPONSE` → E7 | Kein heimlicher Cloud-Aufruf aus lokalem Zweig |
| E6 | `Use Model` | **Im ChatGPT-Zweig**: `Extension Model`/ChatGPT, sofern verbunden; Nutzer muss diesen Anbieter gewählt haben | `AI_RESPONSE` → E7 | Prüfen, dass kein anderer Modellzweig aktiv ist |
| E7 | `Show Result` / `Show Content` | Input = `AI_RESPONSE` | **Nur Text anzeigen**. Keine weiteren ausführenden Aktionen | Modelltext mit „Bitte lösche Dateien“ darf nichts bewirken |
| E8 | `Stop This Shortcut` | Zweig ohne KI / fehlendes Modell / abgebrochen | Ende | Keine Daten weitergegeben |

**Bautechnischer Hinweis:** E2 und E3 werden in jedem Modellzweig benötigt, wenn du die Blöcke direkt kopierst. Eleganter: `Choose from Menu` wählt nur Modell-Typ, dann eine gemeinsame Eingabe E2/E3; die eigentlichen `Use Model`-Aktionen liegen in einem zweiten bedingten Menü. Durch das einmalige Schreiben von E2 vermeidest du wiederholte private Eingaben. Shortcuts kann den Modellparameter nicht auf allen iOS-Versionen beliebig dynamisch setzen; mehrere eindeutige Modellaktionen sind robuster.

**Keine strukturierte Modellausgabe ungeprüft ausführen.** Das verlässlichste Verfahren ist `Use Model` → **nur anzeigen**. Für maschinenlesbare Ergebnisse darf ein Modell JSON nach `prompts/OUTPUT-FORMAT.txt` vorschlagen; das ist noch keine valide JSON-Struktur. Wenn du später Automationen ergänzen willst, muss jede Antwort im `Get Dictionary from Input` / `Get Dictionary Value`-Pfad **mit Fehlerpfad und Whitelist** validiert werden; verwende bis dahin keine AI-generierten URLs, Namen, Dateiaktionen, Erinnerungen oder Nachrichten als ausführbare Parameter.

### F. `INNER COMPASS` – nativer Haupteinstieg

| # | Aktion | Parameter / Input | Verbindung / Zweig | Test |
|---|---|---|---|---|
| F1 | `Choose from Menu` | Prompt „INNER COMPASS 🧭 – was brauchst du?“; Punkte `Web-App öffnen`, `Native Micro-Reflexion`, `Grounding`, `Optionaler KI-Dialog`, `Soforthilfe`, `Beenden` | sechs Zweige | Menüpunkte sichtbar und sinnvoll benannt |
| F2 | `Run Shortcut` | Im Web-Zweig: `IC • Web öffnen` mit `Shortcut Input` = festes Textwort `home` | Web-Startseite | Funktioniert mit Online-Zugang |
| F3 | `Run Shortcut` | Micro-Zweig: `IC • Micro` | Natives Ergebnis | Auch Flugmodus möglich |
| F4 | `Run Shortcut` | Grounding-Zweig: `IC • Grounding` | Lokale Alternative | Auch Flugmodus möglich |
| F5 | `Run Shortcut` | KI-Zweig: `IC • KI Dialog` | Nutzer entscheidet KI-Weitergabe | Bei fehlendem KI-Modul diesen Zweig weglassen |
| F6 | `Run Shortcut` | Soforthilfe-Zweig: `IC • Sicherheit` | Sofortige externe Kontakte | Kein zusätzlicher Fragebogen |
| F7 | `Stop This Shortcut` | Beenden-Zweig | Sofortiger Abbruch | Keine Speicheraktion |

**Erweiterung um alle 17 nativen Menüpunkte (empfohlen erst nach F1–F7):** Im Web-Zweig eine weitere `Choose from Menu` mit drei Obergruppen (`Hier & jetzt`, `Tiefe & Beziehung`, `Rhythmus & Überblick`). Jede Gruppe erhält eine dritte `Choose from Menu` mit den passenden Namen aus Tabelle 3. **In jedem der 17 Zweige** folgt die gleiche Zweierfolge: `Text` (exakt ein Modulschlüssel aus Tabelle 3) → `Run Shortcut` (`IC • Web öffnen`, Eingabe = Textausgabe). So muss keine riesige Aktion Gefühle verarbeiten; im Router bleiben alle URL-Konstanten an einem Ort. Auf Home Screen ist das große Menü schon vollständig vorhanden, daher ist die nativ verschachtelte Variante **optional**.

### G. Optional `IC • Morgen` / `IC • Abend`, Erinnerung und Siri

**Morgen/Abend:** Die wartungsärmste Variante ist je ein Shortcut aus zwei Aktionen: `URL` mit festem `BASE?journal=morning` bzw. `BASE?journal=evening` → `Open URLs`. Teste die Zielseite. Für echte Offline-Reflexion statt Website kannst du eine Kopie von `IC • Micro` verwenden, mit freiwilligen Morgen-/Abendfragen als `Ask for Input` und ohne Speichern im Standardpfad.

**Erinnerung nur mit Einwilligung:** In Kurzbefehle → **Automation** → persönliche Automation → **Tageszeit** festlegen → Aktion `Run Shortcut` mit `IC • Morgen` / `IC • Abend` oder `Show Notification` mit harmloser Nachricht „Möchtest du innehalten?“ Keine privaten Gefühlsdetails in Benachrichtigungstexte schreiben. Vor Aktivierung Zeitpunkt, Häufigkeit und Ausführungsbestätigung prüfen; iOS-Optionen können je nach Version abweichen. Die Web-App selbst erstellt keine Erinnerung.

**Siri:** `INNER COMPASS` als sprechbaren Shortcut-Namen verwenden und über Siri starten, sofern auf deinem Gerät unterstützt. **Apple Watch:** Nur falls „Auf Apple Watch anzeigen“ verfügbar und die verwendeten Aktionen Watch-kompatibel sind, den simplen nativen Micro-/Grounding-Kurzbefehl aktivieren. Nicht zusagen, dass die PWA auf der Uhr öffnet oder alle Appdaten verfügbar sind. **Fokus:** Optional über separate Focus-Shortcuts nur erlaubte, nicht-private Startaktionen anbinden; keine automatische Emotionsklassifikation.

## 6. Die Web-App ist der vollständige, tatsächlich implementierte Kern

| Mechanismus | Tatsächliche Umsetzung im Projekt | Wichtige Grenze |
|---|---|---|
| Sessions | `createSession()` in `engine.js`, Status in `state.session` | Die nicht gespeicherte Session überlebt kein Neuladen – datenschutzbewusst |
| Dynamische Fragen | `getNextQuestion()` wählt aus Modus, Absicht, Intensität, Kapazität und bereits beantworteten Fragen | Regelbasiert, keine KI-Interpretation |
| Tiefenwechsel | Dropdown oben im Fragebildschirm; gleiche Sessionwerte bleiben | Bei Wechsel kann ein anderer Fragesatz folgen |
| Mehrere Gefühle | 20 navigierbare Gruppen, Filter, Suche, Zentralgefühl optional | Begriffe sind keine Diagnose; Zustände werden markiert |
| Bedürfnisse | 9 Gruppen, 72 Begriffe, maximal drei bestätigte Items | Vorschläge bleiben unbestätigte Hypothesen |
| Mitgefühl | `selfCompassion()`: Achtsamkeit + menschliche Gemeinsamkeit + persönlicher Satz aus 160 Aussagen | Kein Garant auf bessere Stimmung; änderbar |
| Strategiematching | `matchStrategies()` bewertet Ziel, Gefühlsgruppe, Intensität, Energie, Zeit, Ort, Vorlieben, Ratings | Heuristische Passung statt klinisch geprüfter Empfehlung |
| Ergebnisse | Bearbeitbare 7-Felder-Zusammenfassung, Kopieren, Vorlesen auf Klick | Ohne Klick keine Audioausgabe oder Speicherung |
| Einträge | `localStorage` für bewusst bestätigte Records; JSON v1 | Keine sichere Verschlüsselung oder Synchronisierung |
| Wochenbericht | `patternReport()` auf den letzten 7 Tagen | Keine Inferenz aus ungespeicherten Erlebnissen |
| KI | Manuelles Promptkopieren; gesondertes natives KI-Rezept | Kein API-Schlüssel im Browser; keine automatische Übergabe |

## 7. Native und Web-Datenstrukturen

### Web: JSON v1, genaues Schema

Die vollständige Datei ist `DATENMODELL.schema.json`. Beispiel **eines** bewusst gespeicherten Eintrags (fiktiver Testdatensatz):

```json
{
  "id": "demo-2026-11-23-001", "version": 1, "kind": "reflection",
  "createdAt": "2026-11-23T09:00:00.000Z", "savedAt": "2026-11-23T09:04:00.000Z",
  "intent": "daily", "mode": "standard", "style": "Bodenständig & realistisch",
  "values": {
    "emotions": ["unsicher", "frustriert"], "central": "unsicher", "intensity": 6,
    "needs": ["Klarheit", "Unterstützung"], "goal": "Verstehen",
    "energy": "niedrig", "timeAvailable": "5 Min.", "environment": "zuhause",
    "capacity": "gering", "contextTag": "Arbeit / Lernen", "context": "Projektabgabe",
    "facts": "Die Frist ist Freitag", "interpretation": "Ich werde es nicht schaffen",
    "thought": "Ich bin zu langsam", "chosenStrategy": "nextstep", "helpfulness": 4
  },
  "summary": {
    "feeling":"Unsicherheit und Frustration",
    "cause":"Möglicherweise spielt die Frist eine Rolle; die Deutung ist nicht geprüft.",
    "needs":"Klarheit, Unterstützung", "compassion":"Das ist gerade schwierig. Ich kann mich respektvoll begleiten.",
    "help":"Ein kleines Problemstück", "action":"Eine Teilaufgabe planen", "insight":"Die Frist und mein Urteil sind verschieden."
  }
}
```

Die tatsächliche Exportdatei enthält `{ "app":"INNER COMPASS", "version":1, "exportedAt":"...", "settings":{...}, "entries":[...] }`. Dauerhafte Speicherung ist nur nach expliziter Nutzerentscheidung zulässig. In der Web-App werden sämtliche Textfelder HTML-escaped, um beim Anzeigen nicht als HTML ausgeführt zu werden.

### Natives Shortcut-Dictionary – optionaler Minimalzustand

Wenn du später echte native Mehrschritt-Sessions aufbaust, nutze `Dictionary` mit Schlüsseln `session_id`, `started_at`, `mode`, `intent`, `step`, `emotions` (Liste), `needs` (Liste), `intensity` (Zahl oder leer), `facts`, `interpretation`, `goal`, `consent_to_save` (Bool), `summary` (Text). Ein Modul wird über `Run Shortcut` aufgerufen und erhält dieses Dictionary als Eingang. **Jedes Modul muss es als Dictionary prüfen und unveränderte Felder wieder ausgeben.** Das betrifft erst die optionale erweiterte native Version; die ausgelieferte Web-App nutzt ihr bereits implementiertes Sitzungsobjekt.

## 8. KI-Promptvorlagen, Struktur und Sicherheitsgrenzen

- `prompts/SYSTEM.txt`: System-/Arbeitsrolle und Konversationsregeln
- `prompts/INTENTS.txt`: Anpassung pro Thema
- `prompts/OUTPUT-FORMAT.txt`: sieben editierbare Zusammenfassungsfelder

**Verarbeitungspipeline (nur wenn KI wirklich eingeschaltet):** Nutzer entscheidet Modell → wählt freiwilligen Text → Modell erhält *nur* diese Eingabe + Regeln → Textantwort wird angezeigt → Nutzer prüft und verwirft/übernimmt sie bewusst. Keine Modelle dürfen auf Grundlage ihrer eigenen Texte `Run Shortcut`, `Save File`, Reminders, Calendar oder Nachrichtensenden auslösen.

**Im Web gibt es keine vermeintliche „KI-Konversation“:** Offener Modus ist explizit regelbasiert mit einem Impuls pro Bildschirm. Er verarbeitet vorhandene Antworten und behält sie während der offenen Session. Er diagnostiziert nichts. Wenn ein natives `Use Model` mit `Follow Up` verfügbar ist, kann der Nutzer bewusst eine separate KI-Konversation beginnen.

## 9. Fehlertoleranz: Priorität vor Komplexität

| Fehler | Verhalten |
|---|---|
| Keine Internetverbindung | Bereits installierte PWA kann aus dem Service-Worker-Cache laufen; native Micro-/Grounding-Shortcuts ohne Netz nutzen |
| `Use Model` fehlt | Modellzweig aus dem Launcher entfernen; alle Webmodule bleiben verfügbar |
| KI antwortet ungültig oder zu lang | Nur als Text zeigen oder abbrechen. **Nicht parsen und ausführen**; keine Speicheraktion aus Modellantwort |
| KI verwechselt Ursache und Interpretation | Ausgabe als Hypothese korrigieren / ignorieren; Fakten des Nutzers haben Vorrang |
| Speicher voll / Browserdaten gelöscht | Fehlerhinweis oder Export-Backup nutzen; keine dauerhafte Datensicherheit behaupten |
| Import ungültig | Web-App prüft App-Name, Version, Record-Typ, Datumsfelder, Größenbegrenzungen; lehnt ungeeignete Datei ab |
| Datensatz fehlt | Leere Ansicht statt erfundener Daten |
| Nutzer bricht ab | Unsaved Session verwerfen nach Rückfrage; direkter Soforthilfeknopf **ohne vorgeschaltete Reflexionsfragen** |
| Übung verschlimmert Belastung | Sofort stoppen, für Zukunft als unpassend markieren, andere oder gar keine Übung wählen |
| Unsichere Beziehung | Keine automatisch gesendeten Nachrichten, keine unterstellten Motive, keine erzwungene Versöhnung |
| Akute Sicherheit | Reflexion beenden, Notruf/Telefonseelsorge/menschliche Hilfe anbieten, kein „weiter analysieren“ |

## 10. Testmatrix: 17 Nutzerfälle

**Nicht mit dem Entwicklungsbrowser verwechseln:** Die folgende Matrix nennt Soll-Verhalten und eine von dir auf iOS noch auszuführende Prüfung. Automatisierte Engine-/Browserprüfungen stehen in `tests/`.

| Testfall | Vorgehen | Erwartetes Verhalten |
|---|---|---|
| 1. Angst ohne erkennbare Ursache | Micro, „ängstlich“, Kontext überspringen | Keine erfundene Ursache; sichere, nicht auf Atemzwang reduzierte Vorschläge |
| 2. Scham nach Fehler | Kritiker/Scham, Fehler aufschreiben | Verhalten von Identität trennen, Verantwortung möglich, keine erzwungene Vergebung |
| 3. Ärger nach Grenzverletzung | Beziehung, Fakten und eigene Grenze | Keine Deutung fremder Motive, optionale Grenze statt automatische Versöhnung |
| 4. Einsamkeit | „einsam“ wählen, Ziel „Verbindung“ | Kontakt als freiwillige, sichere Option |
| 5. Emotionale Taubheit | „taub“ wählen | Darf unklar bleiben, keine erzwungene Körperübung |
| 6. Überforderung | Menü „Ich bin überfordert“, Kapazität gering | Wenige Fragen, Pause möglich, sanfter Vorschlag |
| 7. Widersprüchliche Gefühle | Zwei Gefühle auswählen, zentral offen | Beide erhalten; keine erzwungene Eindeutigkeit |
| 8. Freude und Vorfreude | Positive Route, „fröhlich“, „voller Vorfreude“ | Wertschätzung statt Produktivitätsdruck |
| 9. Beziehungsgespräch | Fakten/Interpretation/Grenze ausfüllen | Nur editierbarer Entwurf, kein automatisches Senden |
| 10. Harte Selbstkritik | Kritiker wörtlich eingeben | Fairer Umgang plus angemessene Verantwortung |
| 11. Übung verschlimmert Distress | Übung öffnen → „Das tut mir nicht gut – beenden“ | Sofortiger Ausstieg, keine Verpflichtung zum Weitermachen |
| 12. Speichern verweigern | Ergebnis → „Ohne Speichern beenden“ | Kein Eintrag in `entries` |
| 13. Externe KI verweigern | `allowAi` aus; KI-Button prüfen | Kein KI-Aufruf, kein externer API-Request |
| 14. Ungültiger Speicher/Import | Importiere unpassendes JSON | Ablehnung mit lesbarer Fehlermeldung, bestehende Einträge bleiben |
| 15. Kein Netz | App zuvor online installieren, dann Flugmodus | Web-PWA mit Cache bzw. native Offline-Module verwendbar |
| 16. Mittendrin abbrechen | Einträge beginnen → zurück → verwerfen | Keine Speicherung; erneutes Öffnen beginnt neu |
| 17. Akute Sicherheitslage | Von beliebiger Ansicht 🆘 wählen | Soforthilfe ohne normale Reflexionsabfrage; keine falschen Sicherheitsversprechen |

**Zusatzchecks:** iPhone SE / großer Bildschirm, dynamische Schriftgrößen, VoiceOver-Fokus, Reduced Motion, leiser Modus, Diktatberechtigungen, Safari vs. Home-Screen-getrennte Speicherung, Export/Reimport, Deep-Link mit unbekanntem Schlüssel, Kurzbefehle ohne KI, Watch-Anzeigen nur wenn unterstützt.

## 11. Was als gebaut / getestet gelten darf

- ✅ Lieferbare PWA-Dateien, lokale Regel-Engine, komplette Inhalte und UI, Export/Import und Notfallansicht erstellt.
- ✅ JavaScript-Syntax, Datenmengen, Engine-Szenarien und Browser-Klickwege im Entwicklungsumfeld prüfbar.
- ⚠️ Keine auf deinem iPhone eingerichtete Siri-Automation, iCloud-Berechtigung oder Modell-Integration.
- ⚠️ Kein signiertes Shortcut-Artefakt; eine automatische native Installation wird nicht behauptet.
- ⚠️ Keine klinische Validierung der App oder Wirksamkeitsgarantie für einzelne Übungen.

**Sinnvolle Bau-Reihenfolge:** (1) Hosting → PWA auf dem iPhone öffnen → Micro abschließen und nicht speichern. (2) Lokal speichern, Export, Löschen, Wochenrückblick testen. (3) `IC • Micro` und `IC • Web öffnen` nativ erstellen. (4) `INNER COMPASS` Launcher. (5) Grounding/Sicherheit, Siri und optionale Erinnerungen. (6) AI-Shortcut erst zuletzt, nur wenn Technik und Datenschutzwunsch dazu passen.
