// INNER COMPASS – kuratierte, bewusst nicht-diagnostische Sprach- und Übungsdaten.
export const EMOTION_GROUPS = [
 {id:'sad',name:'Traurigkeit & Abschied',icon:'🌧️',kind:'emotion',terms:['traurig','betrübt','niedergeschlagen','wehmütig','melancholisch','bekümmert','entmutigt','verletzt','schmerzlich berührt','trauernd','bedrückt','verloren','sehnsüchtig','hoffnungslos wirkend','erschüttert']},
 {id:'fear',name:'Angst & Unsicherheit',icon:'🌫️',kind:'emotion',terms:['ängstlich','besorgt','beunruhigt','nervös','furchtsam','verängstigt','alarmiert','angespannt','unsicher','zögerlich','scheu','panisch','bedroht','bange','schreckhaft']},
 {id:'anger',name:'Ärger & Widerstand',icon:'🔥',kind:'emotion',terms:['ärgerlich','wütend','zornig','gereizt','genervt','frustriert','empört','erbost','bitter','verärgert','aufgebracht','entrüstet','ungeduldig','gekränkt','nachtragend']},
 {id:'shame',name:'Scham & Bloßstellung',icon:'🫥',kind:'emotion',terms:['beschämt','peinlich berührt','bloßgestellt','demütigt','kleinlaut','verlegen','entblößt','unzulänglich fühlend','gehemmt','befangen']},
 {id:'guilt',name:'Schuld & Bedauern',icon:'🪶',kind:'emotion',terms:['schuldig','reumütig','bedauernd','zerknirscht','gewissensbelastet','betroffen','verantwortlich fühlend','selbstvorwurfsvoll']},
 {id:'lonely',name:'Einsamkeit & Vermissen',icon:'🌙',kind:'emotion',terms:['einsam','allein gelassen','isoliert','ungesehen','unverbunden','verlassen','ausgeschlossen','vermisst','liebesbedürftig','heimwehkrank']},
 {id:'envy',name:'Neid & Eifersucht',icon:'🌿',kind:'emotion',terms:['neidisch','eifersüchtig','missgünstig','vergleichend','besitzergreifend','rivalisierend','zurückgesetzt','bedroht in einer Bindung']},
 {id:'disappoint',name:'Enttäuschung & Verlust',icon:'🥀',kind:'emotion',terms:['enttäuscht','desillusioniert','ernüchtert','getäuscht','resigniert','desolat','entsetzt','desinteressiert','desillusioniert wirkend']},
 {id:'confusion',name:'Verwirrung & Zwiespalt',icon:'🌀',kind:'emotion',terms:['verwirrt','ratlos','hin- und hergerissen','ambivalent','überrascht','perplex','skeptisch','zweifelnd','orientierungslos','unsicher über Gefühle','unentschlossen']},
 {id:'stress',name:'Stress & Überforderung',icon:'🌊',kind:'state',terms:['überfordert','überlastet','gestresst','ausgelaugt','erschöpft','getrieben','innerlich unruhig','überreizt','gehetzt','unter Druck','blockiert','rastlos','hilflos','ausgebrannt wirkend']},
 {id:'numb',name:'Taubheit & Distanz',icon:'🪨',kind:'state',terms:['taub','leer','abgeschnitten','emotional entfernt','gleichgültig','dumpf','wie betäubt','abwesend','unberührt','innerlich still','entfremdet']},
 {id:'calm',name:'Ruhe & Erleichterung',icon:'🍃',kind:'emotion',terms:['erleichtert','ruhig','friedlich','gelassen','entspannt','geborgen','unbeschwert','sicher','zufrieden','ausgeglichen','versöhnt','getröstet']},
 {id:'joy',name:'Freude & Lebendigkeit',icon:'☀️',kind:'emotion',terms:['fröhlich','glücklich','heiter','vergnügt','ausgelassen','entzückt','begeistert','erfreut','amüsiert','spielerisch','lebendig','beschwingt','entzückt','übermütig']},
 {id:'gratitude',name:'Dankbarkeit & Wertschätzung',icon:'🌻',kind:'emotion',terms:['dankbar','wertschätzend','gerührt','berührt','beschenkt','anerkennend','demütig im guten Sinn','wohlwollend']},
 {id:'pride',name:'Stolz & Selbstvertrauen',icon:'🏵️',kind:'emotion',terms:['stolz','selbstbewusst','ermutigt','kompetent fühlend','bestärkt','würdevoll','zuversichtlich','selbstachtend','anerkannt']},
 {id:'excite',name:'Vorfreude & Begeisterung',icon:'✨',kind:'emotion',terms:['aufgeregt','voller Vorfreude','inspiriert','energiegeladen','neugierig gespannt','fasziniert','euphorisch','motiviert','hoffnungsvoll','abenteuerlustig']},
 {id:'love',name:'Liebe & Zuneigung',icon:'💗',kind:'emotion',terms:['liebevoll','zugewandt','zärtlich','verbunden','verliebt','mitfühlend','fürsorglich','freundschaftlich verbunden','inniglich','warmherzig','vertrauensvoll']},
 {id:'hope',name:'Hoffnung & Offenheit',icon:'🧭',kind:'emotion',terms:['hoffend','optimistisch','offen','ermutigt','erwartungsvoll','bereit','mutig','entschlossen','zuversichtlich gestimmt']},
 {id:'curiosity',name:'Neugier & Interesse',icon:'🔍',kind:'emotion',terms:['neugierig','interessiert','wissbegierig','staunend','aufmerksam','überrascht im guten Sinn','erkundend','versunken','fasziniert von etwas']},
 {id:'mixed',name:'Gemischte Gefühle',icon:'🎨',kind:'mixed',terms:['gleichzeitig froh und traurig','erleichtert und schuldig','wütend und verletzt','hoffnungsvoll und ängstlich','dankbar und erschöpft','verbunden und eingeengt','stolz und verlegen','liebend und enttäuscht','freudig und nervös','unsicher und neugierig']}
];
export const EMOTION_COUNT = [...new Set(EMOTION_GROUPS.flatMap(g=>g.terms))].length;
export const EXPERIENCE_TYPES = [
 {kind:'Körperempfindung',examples:'Druck auf der Brust, zittrige Hände, Wärme, Schwindel – keine sicheren Hinweise auf eine bestimmte Ursache'},
 {kind:'Interpretation / Urteil',examples:'„Ich bin wertlos“, „Sie respektieren mich nicht“ – wichtige Gedanken, aber nicht automatisch nachgewiesene Tatsachen'},
 {kind:'Zustand / Belastung',examples:'erschöpft, taub, überreizt – beschreiben Erleben oder Belastung, nicht zwingend eine einzelne Emotion'}
];
export const NEED_GROUPS = [
 {id:'physical',name:'Körper & Grundversorgung',icon:'🌾',items:['Schlaf','Ruhe','Nahrung','Wasser','Bewegung','Weniger Reize','Körperlicher Komfort','Erholung']},
 {id:'safety',name:'Sicherheit & Klarheit',icon:'🏡',items:['Vorhersehbarkeit','Rückversicherung','Stabilität','Privatsphäre','Schutz','Klarheit','Verlässlichkeit','Orientierung']},
 {id:'connection',name:'Verbindung',icon:'🤝',items:['Zugehörigkeit','Zuneigung','Gesellschaft','Verstandenwerden','Nähe','Akzeptanz','Gemeinschaft','Gesehenwerden']},
 {id:'autonomy',name:'Autonomie',icon:'🕊️',items:['Freiheit','Wahlmöglichkeiten','Unabhängigkeit','Mitbestimmung','Grenzen','Selbstbestimmung','Eigener Raum','Handlungsfähigkeit']},
 {id:'competence',name:'Wirksamkeit & Wachstum',icon:'🛠️',items:['Fortschritt','Lernen','Zuversicht','Unterstützung','Kompetenz','Bewältigbarkeit','Rückmeldung','Zeit zum Üben']},
 {id:'emotional',name:'Emotionaler Beistand',icon:'💛',items:['Bestätigung','Annahme','Ausdruck','Sanftheit','Geduld','Vergebung','Mitgefühl','Trost']},
 {id:'relational',name:'Beziehungsqualität',icon:'🪢',items:['Vertrauen','Gegenseitigkeit','Ehrlichkeit','Respekt','Kommunikation','Wiedergutmachung','Zuverlässigkeit','Konfliktklärung']},
 {id:'existential',name:'Sinn & Ausrichtung',icon:'🧭',items:['Sinn','Zweck','Richtung','Authentizität','Werte','Stimmigkeit','Beitrag','Integrität']},
 {id:'restorative',name:'Regeneration & Freude',icon:'🌷',items:['Spiel','Alleinzeit','Kreativität','Freude','Einfachheit','Pausen','Natur','Leichtigkeit']}
];
export const GOALS = ['Verstehen','Beruhigen','Mitgefühl','Handeln','Verbindung','Ausdrücken','Ausruhen','Akzeptieren'];
export const CONTEXTS = ['Arbeit / Lernen','Beziehung / Familie','Gesundheit / Körper','Alltag / Organisation','Selbstbild / Leistung','Veränderung / Ungewissheit','Verlust / Abschied','Etwas Schönes','Unklar / anderes'];
export const STYLE_OPTIONS = ['Sanft & umsorgend','Bodenständig & realistisch','Praktisch & unterstützend','Warm & ermutigend','Minimalistisch'];
export const MODE_INFO = [
 {id:'micro',title:'Micro',time:'30–60 Sek.',detail:'Gefühl, Intensität, Bedürfnis, freundliche Reaktion'},
 {id:'standard',title:'Standard',time:'3–5 Min.',detail:'Kontext, Bedürfnisse und ein nächster Schritt'},
 {id:'deep',title:'Tief',time:'10–20 Min.',detail:'Fakten, Deutungen, Werte, Selbstkritik und Handlung'},
 {id:'open',title:'Offen',time:'Ohne Zeitlimit',detail:'Eine passende Frage nach der anderen – regelbasiert'}
];
export const MENU_GROUPS = [
 {name:'Hier & jetzt',items:[['daily','🌱','Emotionaler Check-in','Ein sanfter Start'],['understand','🧠','Gefühle verstehen','Was beschäftigt mich?'],['compassion','❤️','Selbstmitgefühl','Freundlich und ehrlich'],['overwhelm','🌊','Ich bin überfordert','Weniger ist jetzt genug'],['needs','🧭','Was brauche ich?','Bedürfnisse behutsam klären'],['coping','🛠️','Strategie finden','Etwas Passendes auswählen']]},
 {name:'Tiefe & Beziehung',items:[['thought','💭','Schwieriger Gedanke','Fakten und Deutung trennen'],['critic','🪞','Innerer Kritiker','Verantwortung ohne Härte'],['relationship','🤝','Beziehung verstehen','Auch Grenzen sind Fürsorge'],['journal','📓','Geführt schreiben','Ohne Leistungsdruck'],['positive','🌤️','Schöne Gefühle würdigen','Gutes darf bleiben']]},
 {name:'Rhythmus & Überblick',items:[['morning','🌅','Morgenkompass','Eine sanfte Intention'],['evening','🌙','Abendreflexion','Den Tag loslassen'],['patterns','📊','Muster entdecken','Nur aus gespeicherten Daten'],['weekly','📅','Wochenrückblick','Beschreibend statt bewertend'],['settings','⚙️','Einstellungen & Privatsphäre','Du entscheidest'],['support','🆘','Sofortige Unterstützung','Kontakte & Orientierung']]}
];
// Über 100 originelle, situationsbezogene Aussagen. Jede Aussage darf abgelehnt oder geändert werden.
export const COMPASSION = {
 sad:[
 'Ich merke, dass mich etwas traurig macht. Das verdient Raum, auch wenn gerade keine Lösung bereitliegt.',
 'Ein Abschied kann nachwirken. Ich muss mein Tempo nicht mit dem anderer Menschen vergleichen.',
 'Heute darf etwas schwer sein. Ich kann mir eine kleine Erleichterung erlauben, ohne das Geschehene kleinzureden.',
 'Dass ich etwas vermisse, zeigt seine Bedeutung für mich. Ich darf mich damit behutsam begleiten.',
 'Ich muss meiner Traurigkeit keinen Sinn aufzwingen. Zuhören ist heute vielleicht genug.',
 'Traurig zu sein nimmt mir nicht meine Fähigkeit zu handeln. Ich kann mit einem kleinen Schritt beginnen.',
 'Manches lässt sich nicht reparieren. Ich kann dem Schmerz trotzdem mit Respekt begegnen.',
 'Ich darf um etwas trauern, das andere vielleicht nicht verstehen. Meine Erfahrung muss nicht begründet werden.'
 ],
 fear:[
 'Ungewissheit ist belastend. Ich kann Vorsicht ernst nehmen, ohne jede Befürchtung als Tatsache zu behandeln.',
 'Meine Sorge versucht vielleicht, mich zu schützen. Ich darf prüfen, was tatsächlich beeinflussbar ist.',
 'Ich muss nicht alle Antworten kennen, um mich jetzt freundlich zu behandeln.',
 'Angst ist eine Erfahrung, kein Beweis dafür, dass das Schlimmste eintreten wird.',
 'Ich darf Sicherheit suchen und trotzdem anerkennen, dass absolute Gewissheit selten möglich ist.',
 'Mein Körper kann alarmiert sein, auch wenn die Ursache unklar bleibt. Ich muss nichts erzwingen.',
 'Vorsicht und Mut können nebeneinander bestehen. Ein kleiner, sicherer Schritt genügt.',
 'Ich kann die Angst bemerken und dann entscheiden, welchem Wert ich heute folgen möchte.'
 ],
 anger:[
 'Mein Ärger kann auf eine verletzte Grenze hinweisen. Ich darf zuhören, bevor ich reagiere.',
 'Es ist verständlich, wütend zu sein, wenn mir Respekt fehlt. Was ich tue, kann ich bewusst wählen.',
 'Ich darf klar Nein sagen, ohne mich für das Gefühl von Ärger zu verurteilen.',
 'Die Wut muss nicht verschwinden, damit ich sachlich für mich einstehen kann.',
 'Vielleicht ist etwas ungerecht. Selbstmitgefühl kann auch bedeuten, Veränderung zu fordern.',
 'Ich kann eine Pause zwischen Gefühl und Handlung lassen, ohne meine Grenze aufzugeben.',
 'Mein Ärger verdient Beachtung und andere Menschen verdienen faire Behandlung. Beides ist möglich.',
 'Ich kann die Energie des Ärgers nutzen, um etwas zu klären statt jemanden zu verletzen.'
 ],
 shame:[
 'Das fühlt sich beschämend an. Ein Fehler beschreibt ein Verhalten, nicht meinen gesamten Wert.',
 'Ich darf Verantwortung übernehmen, ohne mich innerlich herabzusetzen.',
 'Scham möchte mich vielleicht zum Verstecken bringen. Ich kann selbst entscheiden, wem ich mich anvertraue.',
 'Ich muss mich nicht öffentlich bloßstellen, um ehrlich mit mir zu sein.',
 'Auch peinliche Momente gehören zum Menschsein. Sie machen mich nicht zu einem schlechten Menschen.',
 'Eine Entschuldigung kann angemessen sein. Selbstbestrafung ist dafür keine Voraussetzung.',
 'Ich kann mein Verhalten prüfen und trotzdem auf meiner eigenen Seite bleiben.',
 'Dass ich mich unzulänglich fühle, heißt nicht, dass ich als Person unzulänglich bin.'
 ],
 guilt:[
 'Mein Bedauern zeigt, dass mir mein Handeln wichtig ist. Ich kann prüfen, was ich wiedergutmachen kann.',
 'Schuldgefühle sind ein Anlass zur ehrlichen Prüfung, kein endgültiges Urteil über mich.',
 'Ich kann Verantwortung konkret benennen, ohne mich in endlosen Vorwürfen zu verlieren.',
 'Wenn ich jemandem geschadet habe, darf ich um Entschuldigung bitten und aus dem Fehler lernen.',
 'Nicht jedes Schuldgefühl bedeutet, dass ich tatsächlich verantwortlich bin. Fakten helfen bei der Einordnung.',
 'Selbstvergebung ersetzt keine Reparatur. Sie kann mir helfen, wieder konstruktiv zu handeln.',
 'Ich darf bereuen und dennoch auf einen menschlichen Umgang mit mir bestehen.',
 'Ein besserer nächster Schritt ist hilfreicher als hundertmal derselbe innere Vorwurf.'
 ],
 lonely:[
 'Einsamkeit kann weh tun. Mein Bedürfnis nach Verbindung ist berechtigt.',
 'Ich darf mir Nähe wünschen, ohne diesen Wunsch als Schwäche zu betrachten.',
 'Heute fehlt mir vielleicht Kontakt. Das sagt nichts Endgültiges über meine Zugehörigkeit.',
 'Ich kann einen kleinen Kontaktversuch erwägen, ohne mich zu einem großen Gespräch zu zwingen.',
 'Ungesehen zu sein kann schmerzen. Ich darf mich selbst ernst nehmen und um Verständnis bitten.',
 'Manchmal ist Gesellschaft nötig, manchmal eine ruhige Verbindung zu mir selbst. Ich darf unterscheiden.',
 'Ich kann jemanden vermissen und trotzdem gut für meine eigenen Grenzen sorgen.',
 'Nicht jede einsame Stunde braucht eine Erklärung. Freundlichkeit mit mir ist ein Anfang.'
 ],
 envy:[
 'Neid kann sichtbar machen, was mir wichtig ist. Ich muss deswegen niemandem etwas missgönnen.',
 'Eifersucht kann Angst um Verbindung enthalten. Ich darf nach Fakten fragen, bevor ich Vermutungen glaube.',
 'Vergleiche können schmerzen. Das Leben eines anderen ist kein Maßstab für meinen Wert.',
 'Ich darf den Wunsch hinter meinem Neid verstehen, ohne mich dafür zu schämen.',
 'Meine Unsicherheit macht meine Bedürfnisse nicht falsch. Sie gibt mir auch nicht das Recht, andere zu kontrollieren.',
 'Ich kann über Zugehörigkeit sprechen, statt Gedanken über Motive anderer als Gewissheit zu nehmen.',
 'Es ist möglich, mich für andere zu freuen und zugleich etwas für mich selbst zu vermissen.',
 'Neid ist ein Signal, kein Charakterurteil. Was davon für mich wichtig ist, darf ich prüfen.'
 ],
 disappoint:[
 'Diese Enttäuschung ist real. Vielleicht war mir etwas besonders wichtig.',
 'Eine Hoffnung hat sich nicht erfüllt. Ich darf darüber traurig oder ärgerlich sein.',
 'Ich muss nicht sofort eine Lektion aus dieser Erfahrung machen.',
 'Ich kann meine Erwartungen prüfen, ohne meine Bedürfnisse zu verleugnen.',
 'Dass etwas anders kam als gedacht, darf wehtun und trotzdem offenbleiben.',
 'Ich darf einen Moment innehalten, bevor ich entscheide, wie ich weitergehe.',
 'Nicht jede Enttäuschung ist mein Versagen. Manche Umstände entziehen sich meinem Einfluss.',
 'Ich kann würdigen, worauf ich gehofft habe, und meine nächsten Möglichkeiten betrachten.'
 ],
 confusion:[
 'Ich kann mehrere widersprüchliche Gefühle haben. Ich muss sie nicht sofort sortieren.',
 'Nicht zu wissen, was ich fühle, ist eine gültige Antwort.',
 'Ich darf mir Zeit lassen, bevor ich eine Deutung festlege.',
 'Manches wird erst mit Abstand klarer. Heute genügt ein vorsichtiger Blick.',
 'Zwei Bedürfnisse können miteinander konkurrieren. Ich muss keines davon wegdiskutieren.',
 'Unsicherheit über meine Gefühle ist kein persönliches Defizit.',
 'Ich kann meine Gedanken als vorläufige Versuche betrachten, das Erlebte zu verstehen.',
 'Ich darf offenlassen, welche Erklärung am besten passt.'
 ],
 stress:[
 'Ich bin gerade beansprucht. Weniger zu verlangen kann ein verantwortlicher Schritt sein.',
 'Überforderung ist kein Beweis von Schwäche. Vielleicht ist die Last gerade wirklich groß.',
 'Ich darf zuerst Kapazität schaffen, bevor ich mich weiter analysiere.',
 'Heute muss ich nicht alles schaffen. Was ist das Wichtigste – und was kann warten?',
 'Mein Bedürfnis nach Ruhe ist ernst zu nehmen, auch wenn nicht alles erledigt ist.',
 'Ein kleiner Schritt kann genug sein. Ich muss das Ganze nicht sofort lösen.',
 'Ich darf Unterstützung erbitten, statt alles allein zu tragen.',
 'Wenn sogar Nachdenken zu viel ist, darf ich aufhören und später zurückkommen.'
 ],
 numb:[
 'Gerade spüre ich vielleicht wenig. Auch das darf sein, ohne dass ich Gefühle erzwingen muss.',
 'Abstand zum eigenen Erleben kann irritierend sein. Ich kann behutsam bei dem bleiben, was gerade da ist.',
 'Ich muss meinem Zustand keine dramatische Bedeutung geben, um ihn ernst zu nehmen.',
 'Ich darf einen einfachen äußeren Anker wählen, wenn inneres Spüren gerade nicht passt.',
 'Wenn Worte fehlen, ist Schweigen eine erlaubte Form von Selbstfürsorge.',
 'Ich kann nach Grundbedürfnissen schauen, ohne etwas Bestimmtes fühlen zu müssen.',
 'Es ist in Ordnung, wenn meine Antwort heute nur „ich weiß nicht“ lautet.',
 'Ein wenig Distanz verdient Neugier statt Selbstvorwürfe.'
 ],
 calm:[
 'Dieser Moment ist ruhiger. Ich darf ihn genießen, ohne ihn festhalten zu müssen.',
 'Erleichterung braucht keine zusätzliche Leistung, um berechtigt zu sein.',
 'Ich darf wahrnehmen, was mir gutgetan hat, ohne daraus eine Pflicht zu machen.',
 'Frieden für einen Moment ist wertvoll, auch wenn nicht alles geklärt ist.',
 'Ich kann die Ruhe würdigen, ohne befürchten zu müssen, dass sie sofort wieder verschwindet.',
 'Es ist erlaubt, gerade nichts reparieren zu wollen.',
 'Wenn sich etwas leichter anfühlt, darf ich diesen Unterschied einfach bemerken.',
 'Auch stille Zufriedenheit ist eine vollständige Erfahrung.'
 ],
 joy:[
 'Ich darf diesen schönen Moment erleben, ohne ihn durch Produktivität rechtfertigen zu müssen.',
 'Freude ist kein Auftrag, sie perfekt zu nutzen. Ich kann sie einfach spüren.',
 'Ich darf stolz auf etwas Schönes sein, auch wenn andere gerade Schwieriges erleben.',
 'Es ist in Ordnung, mich zu freuen und zugleich andere Gefühle mitzutragen.',
 'Nicht jeder gute Moment muss dokumentiert oder optimiert werden.',
 'Diese Freude ist eine Erfahrung, die ich freundlich anerkennen darf.',
 'Ein kleines Vergnügen zählt auch dann, wenn mein Tag nicht besonders war.',
 'Ich darf mir Lebendigkeit erlauben, ohne sie festzuhalten.'
 ],
 gratitude:[
 'Ich darf dankbar sein und dennoch unerfüllte Bedürfnisse haben.',
 'Wertschätzung muss schwierige Aspekte nicht verdecken.',
 'Etwas Gutes hat mich berührt. Ich kann es würdigen, ohne mich zu etwas verpflichtet zu fühlen.',
 'Dankbarkeit darf spontan sein, nicht erzwungen.',
 'Ich kann anerkennen, was jemand beigetragen hat, und meine Grenzen behalten.',
 'Es ist genug, diesen freundlichen Moment bemerkt zu haben.',
 'Auch leise Wertschätzung hat Raum.',
 'Ich darf etwas genießen, ohne daraus eine Lebenslektion machen zu müssen.'
 ],
 pride:[
 'Ich darf anerkennen, was mir gelungen ist. Das ist kein Gegensatz zu Bescheidenheit.',
 'Meine Anstrengung zählt, auch wenn das Ergebnis nicht perfekt ist.',
 'Ich kann mich über einen Fortschritt freuen, ohne andere abzuwerten.',
 'Stolz darf sich auf kleine Schritte beziehen.',
 'Ich habe etwas ausprobiert. Ich darf den Mut darin wahrnehmen.',
 'Mein Wert hängt nicht von Leistung ab; trotzdem darf mich Leistung freuen.',
 'Ich kann Erfolg würdigen, ohne sofort die nächste Messlatte zu setzen.',
 'Dieser Moment von Selbstachtung darf ohne Entschuldigung da sein.'
 ],
 excite:[
 'Vorfreude darf lebendig sein. Ich muss sie nicht vor möglichen Enttäuschungen schützen.',
 'Ich darf begeistert sein und dennoch vorsichtig planen.',
 'Neugier kann eine hilfreiche Richtung zeigen, ohne dass ich schon alles wissen muss.',
 'Meine Energie verdient einen guten Umgang statt dauernder Ausnutzung.',
 'Ich kann etwas Neues willkommen heißen und zugleich nervös sein.',
 'Es ist schön, dass mich etwas bewegt. Ich muss es nicht sofort in ein Ziel verwandeln.',
 'Ich kann mit meiner Begeisterung freundlich umgehen und Pausen mitdenken.',
 'Das Schöne daran darf auch einfach nur schön sein.'
 ],
 love:[
 'Diese Verbundenheit ist bedeutsam. Sie darf neben meinen eigenen Grenzen bestehen.',
 'Ich darf jemanden mögen, ohne für alle Gefühle dieser Person verantwortlich zu sein.',
 'Zuneigung kann sanft und zugleich klar sein.',
 'Ich muss Nähe nicht durch Selbstaufgabe beweisen.',
 'Ich darf Liebe zeigen und um Gegenseitigkeit bitten.',
 'Ein warmes Gefühl ist kein Versprechen, alles ertragen zu müssen.',
 'Ich kann Verbundenheit genießen, ohne sie kontrollieren zu wollen.',
 'Auch Fürsorge für mich gehört zu meinen Beziehungen.'
 ],
 hope:[
 'Hoffnung darf vorsichtig sein. Ich muss nicht sicher sein, damit sie Platz hat.',
 'Ein kleiner möglicher Schritt kann neben einer schwierigen Gegenwart stehen.',
 'Ich darf Möglichkeiten sehen, ohne Schwierigkeiten kleinzureden.',
 'Zuversicht und Zweifel müssen sich nicht ausschließen.',
 'Ich kann mich an meinen Werten orientieren, auch wenn das Ergebnis offen ist.',
 'Hoffnung ist keine Garantie; sie darf dennoch Kraft geben.',
 'Ich darf mir Entwicklung wünschen, ohne mich heute abzuwerten.',
 'Ein offenes Morgen verlangt keine perfekte Haltung im Heute.'
 ],
 curiosity:[
 'Neugier darf ohne sofortige Antwort bestehen.',
 'Ich kann interessiert sein, ohne mich zur Entscheidung zu drängen.',
 'Mein Fragen ist wertvoll, auch wenn ich noch keine Schlussfolgerung habe.',
 'Ich darf Unbekanntes erkunden und dabei freundlich mit meinen Grenzen bleiben.',
 'Staunen muss nicht nützlich sein, um gutzutun.',
 'Ich kann eine Sichtweise ausprobieren, ohne sie sofort zu übernehmen.',
 'Ich muss nicht alles analysieren, was mich berührt.',
 'Neugier kann mein Verständnis erweitern, ohne Selbstoptimierung zu werden.'
 ],
 mixed:[
 'Mehrere Gefühle können zugleich wahr sein. Ich muss mich nicht auf eines festlegen.',
 'Ich darf erleichtert sein und trotzdem etwas vermissen.',
 'Freude und Sorge können nebeneinander Platz haben.',
 'Widersprüchliche Gefühle sind kein Zeichen, dass ich falsch reagiere.',
 'Ich kann verschiedene Bedürfnisse bemerken, bevor ich entscheide.',
 'Ich darf jemanden lieben und über etwas enttäuscht sein.',
 'Auch ambivalente Erfahrungen verdienen einen behutsamen Umgang.',
 'Es ist möglich, etwas zu wollen und es gleichzeitig zu fürchten.'
 ]
};
export const COMPASSION_COUNT = Object.values(COMPASSION).flat().length;

// Achtung: Interventionsvorschläge sind Angebote, keine medizinischen Anweisungen.
// Format: [id, Titel, Gruppe, Ziel, Situationen, Dauer, Schritte, Anpassung, Grenze, Abbruchkriterium, Abschlusssatz, Ziel-Tags, Aufwand]
const RAW_STRATEGIES = [
 ['orient','Orientierung im Raum','Grounding','Gegenwart wahrnehmen','Überlastung, diffuse Anspannung','1 Min',['Finde drei neutrale Gegenstände.','Nenne still ihre Farben.','Bemerke, wo du dich gerade befindest.'],'Augen offen lassen; nur einen Gegenstand wählen.','Keine Garantie für sofortige Entlastung.','Wenn Beobachten verstärkt belastet.','Ein kleiner Anker darf genügen.','Beruhigen,Akzeptieren','niedrig'],
 ['54321','5–4–3–2–1','Grounding','Auf äußere Reize fokussieren','Stress, Grübeln','2–4 Min',['Nenne fünf Dinge, die du siehst.','Vier, die du fühlen kannst.','Drei Geräusche, zwei Gerüche und einen Geschmack – soweit angenehm.'],'Kürze auf 3–2–1 oder überspringe Sinne.','Kann bei Reizüberflutung ungeeignet sein.','Wenn es dich stärker überreizt.','Du darfst jederzeit aufhören.','Beruhigen','mittel'],
 ['feet','Boden unter den Füßen','Grounding','Orientierung durch Kontakt','Innere Unruhe','30 Sek.',['Stell die Füße bequem auf.','Nimm den Kontakt zum Untergrund wahr.','Benenne einen Gegenstand in deiner Umgebung.'],'Nur den Raum anschauen, falls Körperfokus unerwünscht.','Körperkontakt kann unangenehm sein.','Wenn Körperaufmerksamkeit belastet.','Du musst nichts Bestimmtes fühlen.','Beruhigen,Akzeptieren','niedrig'],
 ['name3','Drei Dinge im Jetzt','Grounding','Zeit und Ort verankern','Benommenheit, Stress','1 Min',['Nenne den heutigen Wochentag.','Benenne deinen aktuellen Aufenthaltsort allgemein.','Suche etwas Vertrautes in der Umgebung.'],'Nur einen Schritt auswählen.','Nicht mit Sicherheit oder Gefahrenprüfung verwechseln.','Wenn du dich dadurch unwohl fühlst.','Dein Tempo ist ausreichend.','Beruhigen','niedrig'],
 ['sensorychoice','Einen Sinn wählen','Grounding','Sanfte Außenorientierung','Hohe innere Belastung','1–3 Min',['Wähle Sehen oder Hören.','Suche etwas Neutral-Angenehmes.','Bleibe einige Atemzüge oder Sekunden dabei.'],'Keine Augen schließen erforderlich.','Nicht jeder Sinn ist gerade angenehm.','Wenn Reize unangenehm werden.','Du entscheidest, was gut tut.','Beruhigen','niedrig'],
 ['warmdrink','Warmes oder kühles Getränk','Selbstberuhigung','Angenehmen Reiz nutzen','Anspannung, Müdigkeit','3 Min',['Bereite ein geeignetes Getränk zu.','Nimm Temperatur und Geschmack wahr.','Trinke in deinem Tempo.'],'Stattdessen Wasser oder einfach sitzen.','Temperatur und medizinische Einschränkungen beachten.','Wenn unangenehm oder nicht verfügbar.','Auch einfache Fürsorge zählt.','Beruhigen,Ausruhen','niedrig'],
 ['blanket','Wohlige Umgebung','Selbstberuhigung','Komfort schaffen','Erschöpfung, Traurigkeit','2–5 Min',['Prüfe Temperatur, Licht und Geräusche.','Passe eine Sache an.','Gönne dir eine kleine Pause.'],'Nur Kopfhörer absetzen oder Licht ändern.','Äußere Umstände sind nicht immer veränderbar.','Wenn Veränderung mehr Stress macht.','Dein Wohlbefinden darf wichtig sein.','Ausruhen,Beruhigen','niedrig'],
 ['touch','Mitfühlende Geste','Selbstberuhigung','Freundliche Zuwendung','Scham, Angst, Traurigkeit','1 Min',['Frage dich, ob Berührung angenehm wäre.','Lege optional eine Hand auf den Arm oder umschließe eine Tasse.','Sprich einen freundlichen Satz.'],'Ohne Berührung oder nur gedanklich.','Berührung kann unangenehm oder triggernd sein.','Bei Unbehagen sofort stoppen.','Freundlichkeit braucht keine Geste.','Mitgefühl','niedrig'],
 ['music','Vertrautes Klangstück','Selbstberuhigung','Emotionale Begleitung','Traurigkeit, Anspannung','3–5 Min',['Wähle vertraute Musik oder Ruhe.','Achte auf Lautstärke.','Bemerke, ob es dir gerade hilft.'],'Auch Stille ist gültig.','Musik kann intensive Erinnerungen auslösen.','Wenn es belastender wird.','Du darfst anders entscheiden.','Beruhigen,Ausdrücken','niedrig'],
 ['breathgentle','Natürlich atmen lassen','Atmung','Nicht-erzwungene Pause','Milde Anspannung','1–2 Min',['Lass die Atmung ihren Rhythmus finden.','Spüre nur, falls angenehm, eine Ausatmung.','Richte den Blick wieder nach außen.'],'Körperfokus vollständig auslassen.','Atembeobachtung kann Angst steigern.','Bei Schwindel, Luftnot oder Unwohlsein.','Es ist kein Test, richtig zu atmen.','Beruhigen','niedrig'],
 ['exhale','Bequeme Ausatmung','Atmung','Sanft verlängertes Ausatmen testen','Leichte Nervosität','1–2 Min',['Atme bequem ein, ohne tief zu ziehen.','Lass die Ausatmung optional etwas länger werden.','Kehre zur normalen Atmung zurück.'],'Nur still sitzen oder Blick schweifen lassen.','Nicht bei Atemnot erzwingen.','Wenn Schwindel oder Unwohlsein entsteht.','Dein eigener Rhythmus ist maßgeblich.','Beruhigen','niedrig'],
 ['breathecount','Ruhiger Atemrhythmus','Atmung','Fokus anbieten','Leichte Unruhe','1 Min',['Wenn gewünscht, zähle beim Einatmen leise bis drei.','Atme bequem aus, ohne Zwang.','Beende jederzeit.'],'Ohne Zählen oder ohne Atemübung.','Nicht passend bei Atemfokus-Angst.','Bei Anspannung, Schwindel oder Atemnot.','Du musst nichts kontrollieren.','Beruhigen','niedrig'],
 ['mindnote','Wahrnehmen ohne Etikett','Achtsamkeit','Nicht werten','Gemischte Gefühle','2 Min',['Bemerke, was gerade da ist.','Verzichte möglichst auf gut/schlecht.','Wende dich einer kleinen Alltagshandlung zu.'],'Nur einen Satz notieren.','Kann in akuter Überforderung zu intensiv sein.','Wenn innerer Fokus belastet.','Du darfst unvollständig bleiben.','Akzeptieren,Verstehen','niedrig'],
 ['sound','Geräusche wahrnehmen','Achtsamkeit','Aufmerksamkeitswechsel','Grübeln','1 Min',['Finde ein neutrales Geräusch.','Bemerke Veränderungen ohne Bewertung.','Lass die Aufmerksamkeit danach frei.'],'Ohne bewusstes Schließen der Augen.','Bei hoher Reizempfindlichkeit ungünstig.','Wenn ein Geräusch stört.','Du kannst den Fokus wechseln.','Akzeptieren,Beruhigen','niedrig'],
 ['slowwalk','Achtsamer kurzer Gang','Achtsamkeit','Sanfte Bewegung und Orientierung','Festgefahrensein','3–8 Min',['Gehe, wenn sicher, ein paar Schritte.','Achte auf die Umgebung.','Kehre ohne Leistungsziel zurück.'],'Auch im Sitzen Fensterblick.','Nur in sicherer Umgebung; Mobilität beachten.','Bei Schmerzen, Schwindel oder Gefahr.','Wenige Schritte können reichen.','Beruhigen,Handeln','mittel'],
 ['allow','Gefühle Raum geben','Akzeptanz','Erfahrung nicht bekämpfen','Traurigkeit, Unruhe','1–3 Min',['Benenne: „Das ist gerade da.“','Prüfe, ob du es für einen Moment nicht wegdrücken musst.','Entscheide dann bewusst, was du brauchst.'],'Nur den ersten Satz nutzen.','Akzeptanz bedeutet nicht, Schaden hinzunehmen.','Wenn es zu intensiv wird.','Du darfst fühlen und handeln.','Akzeptieren,Mitgefühl','niedrig'],
 ['wave','Die Welle beobachten','Akzeptanz','Veränderlichkeit beobachten','Starke wechselnde Gefühle','2–5 Min',['Schau, ob die Intensität sich verändert.','Notiere eine Beobachtung.','Wechsle bei Bedarf zu einem äußeren Anker.'],'Nicht bei hohem Stress, wenn zu viel.','Gefühle müssen nicht abklingen.','Wenn Beobachtung verstärkt belastet.','Es ist okay, wenn es gleich bleibt.','Akzeptieren','mittel'],
 ['both','Zwei Wahrheiten','Akzeptanz','Ambivalenz aushalten','Gemischte Gefühle','2 Min',['Vervollständige: „Ein Teil von mir …“','Ergänze: „Und ein anderer Teil …“','Lass beide zunächst stehen.'],'Nur einen Satz.','Kein Zwang zu harmonischer Lösung.','Wenn es unangenehm wird.','Widersprüche dürfen existieren.','Verstehen,Akzeptieren','niedrig'],
 ['label','Ein Gefühl präzise benennen','Kognitive Flexibilität','Emotionsdifferenzierung','Diffuse Emotionen','2 Min',['Wähle ein ungefähres Gefühlswort.','Prüfe eine nahe Alternative.','Entscheide selbst, was besser passt.'],'„Ich weiß nicht“ ist möglich.','Etiketten sind keine Diagnose.','Wenn Benennung zu eng oder unpassend wird.','Deine Beschreibung hat Vorrang.','Verstehen','niedrig'],
 ['facts','Fakten und Deutungen','Kognitive Flexibilität','Interpretationen prüfen','Konflikte, Selbstzweifel','3–5 Min',['Notiere beobachtbare Fakten.','Notiere deine Deutung getrennt.','Frage, was du noch nicht weißt.'],'Stichworte genügen.','Legitime Grenzverletzungen nicht relativieren.','Wenn Analyse zum Grübeln wird.','Klarheit darf unvollständig sein.','Verstehen,Handeln','mittel'],
 ['defusion','„Ich bemerke den Gedanken …“','Kognitive Flexibilität','Abstand zu Gedanken','Selbstkritik, Sorge','1–2 Min',['Formuliere den Gedanken.','Stelle „Ich bemerke den Gedanken, dass …“ davor.','Prüfe, ob Abstand hilfreich ist.'],'Nur gedanklich.','Ein Gedanke kann zugleich reale Informationen enthalten.','Wenn es sich falsch oder entfremdend anfühlt.','Du musst nichts schönreden.','Verstehen,Akzeptieren','niedrig'],
 ['evidence','Evidenz freundlich prüfen','Kognitive Flexibilität','Behauptungen kalibrieren','Selbstvorwürfe, Befürchtungen','4 Min',['Schreibe den genauen Gedanken.','Was spricht dafür? Was dagegen?','Formuliere eine faire, nicht zwingend positive Version.'],'Nur eine Gegenfrage.','Reale Gefahren nicht bagatellisieren.','Wenn es zur Selbstdebatte wird.','Eine faire Sicht genügt.','Verstehen','mittel'],
 ['reframe','Alternative Lesarten','Kognitive Flexibilität','Mehrere Möglichkeiten offenhalten','Unklarheit über Motive','3 Min',['Nenne deine erste Interpretation.','Suche zwei weitere plausible Möglichkeiten.','Markiere, was sich prüfen lässt.'],'Eine Alternative genügt.','Andere Lesarten sind Hypothesen, keine Fakten.','Wenn es zu Rechtfertigungen führt.','Du darfst bei deinem Eindruck bleiben.','Verstehen','mittel'],
 ['microaction','Eine 2-Minuten-Handlung','Aktivierung','Niedrige Hürde schaffen','Antriebslosigkeit, Blockade','2 Min',['Wähle eine sehr kleine Aufgabe.','Begrenze sie auf zwei Minuten.','Beende sie auch dann, wenn mehr möglich wäre.'],'20 Sekunden genügen.','Nicht als Maßstab des Selbstwerts verwenden.','Wenn du Erholung brauchst.','Klein ist hier vollständig genug.','Handeln','niedrig'],
 ['daylight','Kurz ans Tageslicht','Aktivierung','Sanfte Aktivität','Müdigkeit, gedrückte Stimmung','3–10 Min',['Prüfe, ob ein sicherer Gang möglich ist.','Schau nach draußen oder gehe kurz hinaus.','Kehre ohne Leistungsziel zurück.'],'Fensterblick genügt.','Wetter, Sicherheit und Gesundheit beachten.','Wenn es nicht guttut.','Eine Pause ist kein Rückschritt.','Handeln,Ausruhen','mittel'],
 ['pleasure','Kleine angenehme Handlung','Aktivierung','Raum für Freude schaffen','Freudlosigkeit, Erschöpfung','5–10 Min',['Wähle etwas niedrigschwellig Angenehmes.','Plane einen realistischen Zeitpunkt.','Erlaube dir, es ohne Optimierung zu tun.'],'Ein Lied oder eine Teepause reicht.','Nicht als Pflicht zur guten Laune.','Wenn es sich nach Druck anfühlt.','Freude muss nicht erzwungen werden.','Handeln,Ausruhen','niedrig'],
 ['nextstep','Das kleinste Problemstück','Problemlösen','Handlungsfähigkeit ordnen','Viele offene Aufgaben','3–5 Min',['Schreibe das Problem in einem Satz.','Wähle einen beeinflussbaren Teil.','Definiere einen kleinen nächsten Schritt.'],'Nur priorisieren, ohne zu handeln.','Nicht jedes Problem ist allein lösbar.','Wenn es überfordert.','Du musst nicht alles auf einmal lösen.','Handeln','mittel'],
 ['options','Drei Optionen','Problemlösen','Wahlmöglichkeiten sehen','Entscheidungsdruck','4 Min',['Sammle drei Wege, einschließlich Nichtstun/Vertagen.','Notiere je einen Vorteil und Preis.','Wähle nur, wenn du bereit bist.'],'Zwei Optionen reichen.','Nicht bei akuter Gefahr als Ersatz für Hilfe.','Wenn Abwägen zum Kreisen wird.','Eine Pause kann eine Option sein.','Handeln,Verstehen','mittel'],
 ['askhelp','Praktische Hilfe konkretisieren','Problemlösen','Unterstützung erreichbar machen','Überlastung','3 Min',['Was genau wäre hilfreich?','Wer könnte dafür geeignet sein?','Entwirf eine kurze Bitte.'],'Nur die Bitte formulieren.','Niemand ist zur Hilfe verpflichtet.','Wenn Kontakt unsicher ist.','Du darfst um Unterstützung bitten.','Handeln,Verbindung','mittel'],
 ['freewrite','Drei Minuten frei schreiben','Ausdruck','Gedanken entlastend ordnen','Diffuse Belastung','3 Min',['Schreibe ohne Formvorgabe.','Stoppe nach kurzer Zeit.','Wähle, ob du den Text aufbewahren willst.'],'Ein Satz oder Stichworte.','Langes Schreiben kann Grübeln fördern.','Wenn das Schreiben dich hineinzieht.','Du darfst den Text wegwerfen.','Ausdrücken,Verstehen','mittel'],
 ['unsent','Brief ohne Empfänger','Ausdruck','Unausgesprochenes klären','Konflikte, Kummer','5–10 Min',['Beginne mit „Was ich dir sagen möchte …“','Schreibe frei, ohne zu senden.','Entscheide erst später, ob etwas davon mitgeteilt werden soll.'],'Nur Stichworte.','Unmittelbares Versenden kann Folgen haben.','Wenn Erinnerungen überwältigen.','Du musst nichts abschicken.','Ausdrücken','mittel'],
 ['voice','Private Sprachnotiz','Ausdruck','Gedanken aussprechen','Viele ungeordnete Gedanken','2–5 Min',['Wähle die Diktierfunktion deiner Tastatur oder sprich ohne Aufnahme.','Benenne deine Gefühle frei.','Lösche oder behalte bewusst.'],'Nur innerlich formulieren.','Diktat kann geräte- oder dienstabhängig verarbeitet werden.','Wenn Datenschutzbedenken entstehen.','Du bestimmst, was gespeichert wird.','Ausdrücken','niedrig'],
 ['compbreak','Mitgefühl in drei Schritten','Mitgefühl','Anerkennen – Verbundenheit – Freundlichkeit','Scham, Stress, Schmerz','1–3 Min',['„Das ist gerade schwer.“','„Schwierigkeiten gehören zum menschlichen Leben.“','„Was wäre jetzt ein freundlicher Schritt?“'],'Zweiten Satz überspringen, wenn er nicht passt.','Nicht als Pflicht zur Beruhigung.','Wenn eine Formulierung falsch wirkt.','Du darfst deine eigenen Worte finden.','Mitgefühl','niedrig'],
 ['kindletter','Ein mitfühlender Brief','Mitgefühl','Anderen inneren Ton finden','Selbstkritik, Scham','5–10 Min',['Schreibe die Situation ehrlich auf.','Antworte wie eine faire, warmherzige Person.','Benenne Verantwortung und Unterstützung.'],'Nur drei Sätze.','Kein erzwungenes Verzeihen.','Wenn das Schreiben verstärkt belastet.','Freundlichkeit und Ehrlichkeit passen zusammen.','Mitgefühl,Ausdrücken','mittel'],
 ['fairvoice','Eine faire Gegenstimme','Mitgefühl','Innere Härte abschwächen','Perfektionismus','2 Min',['Zitiere den selbstkritischen Satz.','Prüfe seinen sachlichen Kern.','Formuliere dieselbe Botschaft respektvoll.'],'Nur das letzte Wort ersetzen.','Nicht als zwanghafte positive Affirmation.','Wenn weitere Selbstanalyse anstrengend wird.','Du kannst klar sein, ohne hart zu werden.','Mitgefühl,Verstehen','niedrig'],
 ['human','Gemeinsame Menschlichkeit','Mitgefühl','Isolation relativieren','Peinliche Fehler, Einsamkeit','1–2 Min',['Erinnere dich: Menschen erleben Irrtümer und Verletzlichkeit.','Prüfe, ob dieser Gedanke zu deiner Situation passt.','Finde einen persönlichen freundlichen Satz.'],'Bei Widerstand weglassen.','Keine Gleichsetzung unterschiedlicher Erfahrungen.','Wenn es sich minimierend anfühlt.','Dein Erleben bleibt einzigartig.','Mitgefühl','niedrig'],
 ['reachout','Eine sichere Person kontaktieren','Verbindung','Unterstützung suchen','Einsamkeit, Kummer','2–10 Min',['Wähle jemanden, der meist respektvoll reagiert.','Formuliere eine konkrete, freiwillige Bitte.','Akzeptiere, wenn gerade niemand verfügbar ist.'],'Kurze Nachricht statt Anruf.','Nicht jede Beziehung ist sicher.','Wenn Kontakt Risiko birgt.','Verbindung darf Grenzen haben.','Verbindung','mittel'],
 ['cowork','Einfach zusammen sein','Verbindung','Weniger Isolation','Antriebslosigkeit','5–20 Min',['Frage nach ruhiger Gesellschaft.','Erkläre, dass keine Lösung nötig ist.','Beende den Kontakt, wenn genug.'],'Gemeinsamer Spaziergang oder Textnachricht.','Verfügbarkeit nicht voraussetzen.','Wenn du dich unwohl fühlst.','Du musst nichts darstellen.','Verbindung,Ausruhen','mittel'],
 ['appreciate','Anerkennung ausdrücken','Verbindung','Positive Bindung würdigen','Dankbarkeit, Freude','2 Min',['Denke an eine konkrete hilfreiche Geste.','Formuliere ein ehrliches Dankeschön.','Sende es nur, wenn passend.'],'Nur innerlich würdigen.','Kein Kontakt aus Pflichtgefühl.','Wenn der Kontakt unerwünscht oder unsicher ist.','Wertschätzung darf frei bleiben.','Verbindung','niedrig'],
 ['boundary','Grenze in einem Satz','Grenzen','Eigene Bedürfnisse schützen','Respektlosigkeit, Ärger','3 Min',['Formuliere eine beobachtbare Situation.','Sage, was für dich nicht okay ist.','Nenne, was du künftig tun wirst.'],'Erst für dich aufschreiben.','Bei Bedrohung Sicherheit vor Konfrontation.','Wenn ein Gespräch gefährlich wäre.','Du darfst dich schützen.','Handeln','mittel'],
 ['pausemessage','Antwort nicht sofort senden','Grenzen','Impuls und Entscheidung trennen','Heftiger Streit','2–10 Min',['Entwirf die Antwort als Notiz.','Lass sie kurz liegen.','Prüfe später Ton und Grenzen.'],'Einfach Handy weglegen.','Dringende Sicherheitsfragen nicht vertagen.','Wenn Vertagen neue Gefahr erzeugt.','Eine Pause kann klug sein.','Handeln,Beruhigen','niedrig'],
 ['privacy','Privatsphäre bewusst wählen','Grenzen','Offenbarung selbst bestimmen','Scham, Beziehungsdruck','2 Min',['Überlege, was du teilen willst.','Bestimme, wem du es teilen möchtest.','Formuliere eine Grenze zu Details.'],'Du darfst gar nichts teilen.','Nicht jedes Gegenüber respektiert Grenzen.','Wenn du dich bedroht fühlst, suche reale Hilfe.','Deine Geschichte gehört dir.','Handeln,Mitgefühl','niedrig'],
 ['dear','DEAR-ähnliche Gesprächsstruktur','Kommunikation','Klar und respektvoll bitten','Konflikt, schwierige Bitte','5–8 Min',['Beschreibe den Sachverhalt ohne Motivzuschreibung.','Benenne Gefühl und Wunsch.','Bitte konkret; bleibe offen für Rückmeldung.'],'Nur ersten Satz formulieren.','Kein Ersatz für Schutz vor Gewalt.','Wenn das Gegenüber droht.','Klarheit ist kein Angriff.','Handeln,Verbindung','mittel'],
 ['listen','Aktives Zuhören mit Grenze','Kommunikation','Verstehen und Selbstschutz verbinden','Missverständnis','3–5 Min',['Fasse die Perspektive der anderen Person versuchsweise zusammen.','Bitte um Korrektur.','Benenne dann deinen Standpunkt.'],'Nur eine Verständnisfrage.','Keine Pflicht, Beschimpfungen auszuhalten.','Wenn Respekt fehlt oder es unsicher wird.','Deine Perspektive zählt ebenfalls.','Verbindung,Handeln','mittel'],
 ['repair','Wiedergutmachung planen','Kommunikation','Verantwortlich handeln','Eigener Fehler','4–6 Min',['Benenne das konkrete Verhalten.','Überlege seine mögliche Wirkung.','Entwirf Entschuldigung und realistische Reparatur.'],'Nur eigenes Handeln prüfen.','Vergebung ist nicht kontrollierbar.','Wenn Kontakt riskant ist.','Lernen und Selbstachtung sind vereinbar.','Handeln,Mitgefühl','mittel'],
 ['restpermission','Eine Pause erlauben','Ruhe','Belastung reduzieren','Erschöpfung, Überforderung','2 Min',['Prüfe, was heute warten darf.','Räume dir eine kurze Pause ein.','Erinnere dich: Ausruhen ist kein Fehlverhalten.'],'Nur 30 Sekunden.','Strukturelle Belastungen brauchen ggf. weitere Hilfe.','Wenn Ruhe derzeit unsicher ist.','Du darfst Ruhe brauchen.','Ausruhen','niedrig'],
 ['screenoff','Bildschirm-Pause','Ruhe','Reize reduzieren','Überreizung','5–15 Min',['Lege das Gerät an einen sicheren Ort.','Wähle ruhige Umgebung oder eine einfache Tätigkeit.','Kehre bewusst zurück.'],'Eine Minute genügt.','Nicht bei benötigter Erreichbarkeit.','Wenn Pause mehr Stress erzeugt.','Deine Aufmerksamkeit ist kostbar.','Ausruhen,Beruhigen','niedrig'],
 ['basicneeds','Grundversorgung prüfen','Ruhe','Körperliche Faktoren beachten','Reizbarkeit, Müdigkeit','2 Min',['Frage: Habe ich genug gegessen, getrunken, geschlafen?','Wähle eine erreichbare Unterstützung.','Vermeide voreilige psychologische Schlüsse.'],'Nur eine Frage.','Keine medizinische Diagnostik.','Bei gesundheitlichen Symptomen fachliche Hilfe suchen.','Kleine Fürsorge ist bedeutend.','Ausruhen,Handeln','niedrig'],
 ['values','Ein Wert als Richtung','Werte','Handeln nach Wichtigem','Innere Konflikte','3–5 Min',['Welcher Wert ist hier berührt?','Was wäre eine kleine Handlung in dessen Richtung?','Wähle nur, was machbar und sicher ist.'],'Nur einen Wert benennen.','Werte sind kein Zwang zur Selbstaufopferung.','Wenn es zu einer neuen Pflicht wird.','Eine Richtung genügt.','Verstehen,Handeln','mittel'],
 ['tinycommit','Sanfte Verpflichtung','Werte','Kleinen Schritt realisieren','Unsicherheit, Veränderung','3 Min',['Notiere einen freiwilligen Schritt unter fünf Minuten.','Lege einen passenden Zeitpunkt fest.','Prüfe später, ob er noch stimmig ist.'],'Ohne Termin.','Nicht jedes Ziel ist heute sinnvoll.','Wenn die Verpflichtung belastet.','Du darfst Pläne ändern.','Handeln','niedrig'],
 ['meaning','Was war mir wichtig?','Werte','Persönliche Bedeutung verstehen','Trauer, Enttäuschung','3–6 Min',['Was genau hat mich berührt?','Welcher Wert oder Wunsch steckt darin?','Was soll künftig mehr Raum bekommen?'],'Nur die erste Frage.','Kein Zwang, Sinn in Leid zu finden.','Wenn du gerade keinen Sinn suchen möchtest.','Nicht alles muss eine Lehre sein.','Verstehen,Akzeptieren','mittel'],
 ['savor','20 Sekunden würdigen','Positive Gefühle','Gutes bewusst wahrnehmen','Freude, Erleichterung','20–60 Sek.',['Halte bei einem angenehmen Moment kurz inne.','Benenne, was daran gut ist.','Lass ihn weiterziehen, wenn er endet.'],'Nur lächeln oder registrieren.','Nicht als Pflicht zur Dankbarkeit.','Wenn es Druck erzeugt.','Gutes darf unperfekt sein.','Akzeptieren','niedrig'],
 ['strength','Eine Stärke im Kontext','Positive Gefühle','Realistische Selbstanerkennung','Stolz, Freude','2–3 Min',['Erinnere dich an eine konkrete Handlung.','Was hast du dazu beigetragen?','Würdige das ohne Übertreibung.'],'Nur einen Satz.','Nicht alles liegt an persönlicher Stärke.','Wenn es zur Leistungsbewertung wird.','Du darfst Erfolge würdigen.','Verstehen','niedrig'],
 ['sharejoy','Freude teilen – freiwillig','Positive Gefühle','Guten Moment verbinden','Freude, Stolz','2–5 Min',['Wähle einen vertrauensvollen Menschen.','Teile einen konkreten guten Moment.','Oder behalte ihn bewusst für dich.'],'Nur privat notieren.','Nicht jede Person reagiert unterstützend.','Wenn du dich unter Druck fühlst.','Freude braucht kein Publikum.','Verbindung,Ausdrücken','niedrig']
];
export const STRATEGIES = RAW_STRATEGIES.map(([id,title,group,purpose,when,duration,steps,adaptation,limitations,stop,closing,tags,energy])=>({id,title,group,purpose,when,duration,steps,adaptation,limitations,stop,closing,tags:tags.split(','),energy}));
export const JOURNALS = [
 ['daily','Tägliche Gefühlsreflexion',['Was war heute emotional präsent?','Was ging dem voraus?','Was könnte ich gebraucht haben?','Was möchte ich mir freundlich sagen?']],
 ['conversation','Schwieriges Gespräch',['Was wurde tatsächlich gesagt oder getan?','Wie habe ich es interpretiert?','Welche Gefühle und Bedürfnisse sind betroffen?','Was wäre eine klare, respektvolle nächste Äußerung?']],
 ['letter','Mitfühlender Brief an mich',['Was hat wehgetan?','Wie würde eine faire und warmherzige Stimme darauf antworten?','Welche Verantwortung ist wirklich meine?','Welche Unterstützung wäre freundlich und realistisch?']],
 ['thought','Gedankenprotokoll',['Welcher Gedanke tauchte automatisch auf?','Welche Beobachtungen sprechen dafür und dagegen?','Welche alternative, faire Formulierung wäre möglich?','Welche Handlung entspricht meinen Werten?']],
 ['shame','Scham verstehen',['Was löste die Scham aus?','Was sagt sie über mich – und was ist nur ein Urteil?','Muss ich etwas klären oder reparieren?','Wie kann ich würdevoll mit mir umgehen?']],
 ['anger','Ärger und Grenze',['Was ist konkret passiert?','Welche Grenze oder welcher Wert scheint berührt?','Was könnte meine Wut schützen wollen?','Was wäre eine sichere, klare Reaktion?']],
 ['anxiety','Sorgen erkunden',['Was befürchte ich?','Was weiß ich tatsächlich und was ist offen?','Was liegt in meinem Einfluss?','Welche kleine Unterstützung brauche ich jetzt?']],
 ['forgive','Selbstvergebung',['Welchen konkreten Fehler bedaure ich?','Welche Folgen kann ich anerkennen?','Welche Wiedergutmachung ist angemessen und möglich?','Welche Schuldzuweisung darf ich loslassen?']],
 ['values','Werte erkunden',['Was war in letzter Zeit wirklich wichtig?','Wann war ich meinen Werten nahe?','Wo gab es einen Konflikt?','Was wäre ein kleiner stimmiger Schritt?']],
 ['needs','Bedürfnisse erforschen',['Was fällt mir schwer?','Welches Bedürfnis könnte dahinterstehen?','Welche Strategie wünsche ich mir – ist sie die einzige?','Wie könnte ich das Bedürfnis respektieren?']],
 ['gratitude','Dankbarkeit ohne Pflicht',['Was war heute hilfreich oder schön?','Was genau daran hat mich berührt?','Was war zugleich schwierig?','Möchte ich etwas davon würdigen?']],
 ['positive','Schöner Moment',['Was ist passiert?','Wie hat sich das Erleben angefühlt?','Welcher Wert oder welche Verbindung war darin sichtbar?','Wie darf ich den Moment einfach stehen lassen?']],
 ['unsent','Ungesendeter Brief',['An wen – auch an mich selbst – richte ich mich?','Was blieb unausgesprochen?','Was wünsche ich mir?','Was davon möchte ich bewusst nicht senden?']],
 ['decision','Schwierige Entscheidung',['Welche Wahlmöglichkeiten habe ich?','Welche Werte und Bedürfnisse betreffen sie?','Welche Unsicherheiten bleiben?','Was wäre eine ausreichend gute Entscheidung?']],
 ['weekly','Sanfter Wochenrückblick',['Welche Gefühle kehrten wieder?','Was war besonders belastend?','Was hat mich unterstützt?','Welchen freundlichen Gedanken nehme ich mit?']],
 ['innercritic','Innere Kritik entschärfen',['Was sagt meine innere Kritik wortwörtlich?','Was befürchte ich ohne diese Kritik?','Was ist sachlich richtig oder übertrieben?','Wie kann ich Verantwortung ohne Abwertung ausdrücken?']],
 ['morning','Morgenausrichtung',['Wie geht es mir heute?','Was ist heute bedeutsam?','Was könnte schwierig werden?','Welche Unterstützung und Intention wünsche ich mir?']],
 ['evening','Abends loslassen',['Was habe ich heute gefühlt?','Was war schwierig und was wichtig?','Wo war ich mir gegenüber freundlich?','Was darf für heute ruhen?']]
].map(([id,title,questions])=>({id,title,questions}));
export const DIFFERENCES = [
 ['Scham / Schuld','Scham richtet sich eher gegen das eigene Selbst („Mit mir stimmt etwas nicht“); Schuld betrifft eher ein konkretes Verhalten („Ich habe etwas getan“). Beides kann gemischt vorkommen.'],
 ['Eifersucht / Neid','Eifersucht betrifft oft eine befürchtete Bedrohung einer Beziehung; Neid eher etwas, das eine andere Person hat oder erlebt.'],
 ['Traurigkeit / Enttäuschung','Traurigkeit ist oft ein Gefühl des Verlusts oder Schmerzes; Enttäuschung betrifft häufig eine unerfüllte Erwartung.'],
 ['Ärger / Groll','Ärger kann eine unmittelbare Reaktion sein; Groll hält sich oft länger mit einem Gefühl anhaltender Kränkung.'],
 ['Angst / Unsicherheit','Angst enthält meist eine wahrgenommene Gefahr; Unsicherheit kann auch schlicht fehlende Information bedeuten.'],
 ['Einsamkeit / Alleinsein','Einsamkeit ist meist schmerzhaft erlebter Mangel an Verbindung; Alleinsein kann gewählt und wohltuend sein.']
];
export const EVIDENCE = [
 {name:'Selbstmitgefühl (Neff / Mindful Self-Compassion)',level:'Gut untersucht, keine Garantie',feature:'Dreischritt: Wahrnehmen, gemeinsame Menschlichkeit, Selbstfreundlichkeit',url:'https://www.annualreviews.org/content/journals/10.1146/annurev-psych-032420-031047/'},
 {name:'Selbstmitgefühlsinterventionen',level:'Meta-analytische Evidenz',feature:'Kontextbezogene, freiwillige Compassion-Übungen',url:'https://doi.org/10.1007/S12671-019-01134-6'},
 {name:'Compassion-Focused Therapy (Gilbert)',level:'Vielversprechend; Studiengrenzen',feature:'Umgang mit Selbstkritik und beruhigender innerer Haltung',url:'https://pubmed.ncbi.nlm.nih.gov/36649790/'},
 {name:'CBT und ACT',level:'Etablierte Verfahren, digitale Einzelübungen nicht gleich Therapie',feature:'Fakten/Interpretationen, Defusion, Werte, Handeln',url:'https://www.ncbi.nlm.nih.gov/books/NBK279297/'},
 {name:'DBT-Fertigkeiten',level:'Aus etablierten klinischen Manualen adaptiert',feature:'Orientierung, Impulspause, kommunikative Bitte',url:'https://www.guilford.com/books/DBT-Skills-Training-Manual/Marsha-Linehan/9781462516995'},
 {name:'Emotionsbenennung',level:'Experimentelle, kontextabhängige Evidenz',feature:'Mehrere Gefühlswörter und differenzierte Einordnung',url:'https://pubmed.ncbi.nlm.nih.gov/21534661/'},
 {name:'Adaptive Zuordnung & persönliches Musterfeedback',level:'Exploratives Produktdesign, nicht klinisch validiert',feature:'Regelbasiertes Matching und beschreibende Rückblicke',url:''}
];
