# INNER COMPASS – Testbericht / Grenzen

**Stand:** 23. November 2026 · Entwicklungsprüfung, **keine iPhone-Abnahme**.

## Automatisch erfolgreich geprüft

- `npm test`: **24/24** Node.js-Logikprüfungen erfolgreich.
- `python tests/browser_check.py`: mehrere Chromium-Interaktionstests erfolgreich, **0 JavaScript-Ausnahmefehler**. Die Testumgebung blockiert Netzwerk-Navigation zu localhost; der Test lädt daher die unveränderten HTML/CSS-Dateien und kombiniert die drei JavaScript-Module **für die Testausführung** in die Browserseite. Der ausgelieferte Code bleibt unverändert als native ES-Module.
- Desktop-Start, Menüeinträge, Micro-Flow (Emotionsauswahl → Intensität → Bedürfnisse → editierbare Zusammenfassung), standardmäßig fehlende KI-Übertragung.
- Ausdrückliche lokale Speicherung und Wiederfinden eines Eintrags nach simuliertem erneuten Seitenaufbau; selektive Löschung.
- Journaling: Entwurf → editierbare Vorschau → bewusstes Verwerfen ohne persistenten Eintrag.
- iPhone-große Browseransicht (390 px): Hauptnavigation, horizontale Breite ohne unerwünschtes Scrollen, Reflexion ohne Daten zu speichern verwerfen, Hilferuf-Links öffnen lassen.
- Regelbasierte Szenarien: unklare Angst, Scham nach Fehler, Wut bei Grenzverletzung, Einsamkeit, Taubheit, Überforderung, mehrere Gefühle, Freude, Beziehungskonflikt, Selbstkritik, unverträgliche Übung, KI- und Speicherverweigerung, ungültige Importdaten, kein Online-Modell, Sitzungsabbruch und nicht-diagnostische Sicherheitsschnittstelle.

**Screenshots** in `tests/`: `desktop.png`, `iphone.png`, `result.png`, `iphone-reflection.png`. Sie stammen aus dem Entwicklungsbrowser, nicht aus iOS. SVG-Bildpfade können in den Screenshots durch die lokale Test-Injektion fehlen; beim tatsächlichen Hosting liegt das Logo unter `assets/compass.svg`.

## Nicht abschließend geprüft – ausdrücklich offen

1. Tatsächliches iPhone-Modell / iOS-Version und Bereitstellung von `Use Model`, Apple Intelligence, Drittanbieter-Integrationen, Siri, Apple Watch oder Fokus-Aktionen.
2. Installation des Shortcuts auf dem iPhone; es existiert kein exportierter/signierter `.shortcut`-Link.
3. **PWA-Installation und echter Service-Worker-Offline-Betrieb** auf iOS nach HTTPS-Hosting. JavaScript-Logik selbst läuft ohne Netzwerk, aber Offline-Caching muss gerätespezifisch getestet werden.
4. Safari vs. Home-Screen-Web-App: gemeinsame/isolierte Speicherverhalten und Speicherbeständigkeit muss im konkreten Browserprofil geprüft werden; keine Synchronisierungszusage.
5. Tastatur-Diktat, Sprachausgabe, Screenreader, alternative Geräte-Einstellungen und Dutzende mögliche iOS-Locale-Kombinationen.
6. Klinische Wirksamkeit, Diagnosegüte, Krisenerkennung oder therapeutische Eignung; diese Ansprüche werden **nicht** erhoben.

## So kannst du selbst prüfen

Nach dem HTTPS-Upload in Safari und anschließend in der Home-Screen-Version einen **Micro-Check-in** ausführen, bewusst nicht speichern und unter „Einträge“ prüfen, dass nichts erschien. Dann einen zweiten Check-in ausdrücklich speichern, App schließen, neu öffnen, Eintrag betrachten, JSON exportieren und ein Einzelexemplar löschen. Mit Flugmodus die installierte App nach einem vorangegangenen Onlinebesuch neu öffnen. In Kurzbefehle ausschließlich die Aktionen prüfen, die auf deinem iOS-Gerät tatsächlich angezeigt werden; keine Testanrufe an Notrufnummern absetzen.

Für automatisierte Entwicklungstests:

```sh
npm test
python tests/browser_check.py
```
