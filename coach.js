/** INNER COMPASS v2 — local, non-diagnostic coaching engine. No network requests. */
import {STRATEGIES,GOALS} from './data.js';
import {getCategoryFor,matchStrategies,createSession} from './engine.js';

const ADDITIONAL_STRATEGIES=[
 {id:'meditationopen',title:'Sanfte 3-Minuten-Meditation',group:'Achtsamkeit',purpose:'Einige Augenblicke aufmerksam und ohne Leistungsziel verweilen.',when:'Unruhe, Unsicherheit, Müdigkeit oder Wunsch nach einer Pause',duration:'3 Min',energy:'niedrig',tags:['Beruhigen','Akzeptieren','Ausruhen'],steps:['Wähle einen Ort, an dem du dich ausreichend sicher fühlst. Die Augen dürfen offen bleiben.','Schau auf einen neutralen Gegenstand oder höre auf ein entferntes Geräusch. Du musst den Atem nicht verändern.','Wenn Gedanken auftauchen, bemerke sie und kehre behutsam zu dem äußeren Anker zurück.','Nach ungefähr drei Minuten entscheide frei, ob du aufhören, weitermachen oder etwas anderes tun möchtest.'],adaptation:'Auch 20 Sekunden sind genug. Bei unangenehmem Innenfokus einfach im Raum umsehen.',limitations:'Meditation ist nicht für jede Person oder Situation angenehm; keine garantierte Entspannung.',stop:'Unbehagen, Dissoziation oder Unruhe zunehmen. Schau dich um und wähle eine andere Unterstützung.',closing:'Du musst nichts erreichen, damit dieser Moment zählen darf.'},
 {id:'kindvoice',title:'Eine glaubwürdige, freundliche Selbstansprache',group:'Mitgefühl',purpose:'Selbstkritik nicht mit einer erzwungenen positiven Behauptung beantworten.',when:'Scham, Selbstvorwürfe, Unsicherheit oder Fehler',duration:'1–2 Min',energy:'niedrig',tags:['Mitgefühl','Verstehen'],steps:['Notiere einen Satz, der gerade hart in dir klingt.','Formuliere eine wahrhaftige Alternative ohne Übertreibung: „Das ist schwierig. Ich kann Verantwortung übernehmen, ohne mich abzuwerten.“','Sprich oder lies den Satz einmal, nur wenn er sich stimmig anfühlt.','Falls er falsch klingt, mache ihn kleiner: „Ich probiere, respektvoller mit mir zu sprechen.“'],adaptation:'Nur lesen oder die Worte in Gedanken umformen. Keine laute Affirmation nötig.',limitations:'Positive Aussagen, an die du nicht glaubst, können unangenehm sein. Authentizität ist wichtiger als Optimismus.',stop:'Der Satz Druck, Scham oder Widerstand verstärkt.',closing:'Freundlichkeit kann nüchtern und glaubwürdig sein.'},
 {id:'walk15',title:'Spaziergang ohne Leistungsziel',group:'Aktivierung',purpose:'Ein wenig Bewegung und eine Ortsveränderung erlauben.',when:'Grübeln, Anspannung, Einsamkeit oder Wunsch nach einem kleinen Übergang',duration:'5–15 Min',energy:'mittel',tags:['Handeln','Beruhigen','Ausruhen'],steps:['Prüfe, ob ein kurzer Gang gerade sicher und praktisch möglich ist.','Wähle eine kleine Strecke; Tempo und Entfernung sind egal.','Nimm eine Sache wahr, die du am Weg bemerkst. Du musst nicht über das Problem nachdenken.','Kehre zurück, wann immer du möchtest, und frage dich ohne Bewertung: „War das hilfreich?“'],adaptation:'Auch bis zum Fenster, einmal um den Block oder ein paar Schritte in der Wohnung.',limitations:'Ein Spaziergang löst nicht automatisch Konflikte oder Sorgen. Wetter, Umgebung und Mobilität beachten.',stop:'Die Umgebung unsicher ist oder du dich körperlich unwohl fühlst.',closing:'Bewegung darf Fürsorge sein, keine Pflicht.'},
 {id:'movegentle',title:'Freie Bewegung oder leichter Sport',group:'Aktivierung',purpose:'Über Bewegungsfreude oder kurze Aktivität einen eigenen Zugang finden.',when:'Innere Unruhe, Ärger, überschüssige Energie oder Lust auf Aktivität',duration:'5–20 Min',energy:'mittel',tags:['Handeln','Beruhigen'],steps:['Frage dich, auf welche Form von Bewegung du wirklich Lust hast – oder ob du lieber pausierst.','Wähle etwas Vertrautes und zu deiner Situation Passendes: Musik anmachen und tanzen, locker gehen oder eine kurze Sporteinheit.','Beginne sanft und achte auf deine eigenen Grenzen.','Beende es freiwillig; du musst dich nicht auspowern, um Fürsorge zu verdienen.'],adaptation:'Bei wenig Energie ist kurzes Strecken, Wippen zur Musik oder gar keine Bewegung ebenso okay.',limitations:'Nicht als medizinische Trainingsanleitung verstehen. Körperliche Beschwerden oder individuelle Einschränkungen gehen vor.',stop:'Schmerzen, Schwindel, deutliche Atemnot oder ein unangenehmes Belastungsgefühl auftreten.',closing:'Du darfst in Bewegung kommen, ohne etwas leisten zu müssen.'},
 {id:'caremoment',title:'Dir bewusst etwas Gutes tun',group:'Ruhe',purpose:'Ein schlichtes, selbstgewähltes Zeichen von Fürsorge ermöglichen.',when:'Erschöpfung, Traurigkeit, Scham oder nach einem anstrengenden Tag',duration:'2–10 Min',energy:'niedrig',tags:['Ausruhen','Mitgefühl','Beruhigen'],steps:['Frage: „Was wäre jetzt eine kleine freundliche Geste, die mir wirklich guttut?“','Wähle eine Möglichkeit: Tee, angenehmes Licht, Lieblingslied, frische Luft, eine Decke oder einfach fünf Minuten nichts.','Prüfe, ob du damit gerade etwas Wichtiges aufschiebst. Beides darf wahr sein: Fürsorge und Verantwortung.','Gönne dir die kleine Geste ohne sie in eine Belohnung für Leistung zu verwandeln.'],adaptation:'Wenn nichts davon passt, kann auch „ich lasse mich gerade in Ruhe“ die gewählte Geste sein.',limitations:'Eine kleine Geste ersetzt nicht nötige äußere Veränderungen oder Unterstützung.',stop:'Sie sich wie eine weitere Pflicht anfühlt.',closing:'Fürsorge braucht keinen perfekten Grund.'},
 {id:'meditationcomp',title:'Kurze Mitgefühls-Meditation',group:'Mitgefühl',purpose:'Schmerz anerkennen und einen glaubwürdigen freundlichen Satz finden.',when:'Scham, Traurigkeit, schwierige Gefühle oder Selbstkritik',duration:'3–5 Min',energy:'niedrig',tags:['Mitgefühl','Akzeptieren'],steps:['Wähle eine bequeme Position. Die Augen können offen bleiben.','Benenn innerlich vorsichtig: „Das ist gerade schwer.“','Erinnere dich: „Solche Momente gehören zum Menschsein; ich bin damit nicht moralisch falsch.“','Finde einen Satz wie „Ich möchte mit mir respektvoll umgehen“ – oder lass ihn weg, wenn er nicht passt.','Schau dich um und entscheide, ob du jetzt Ruhe oder einen kleinen Schritt brauchst.'],adaptation:'Du kannst den inneren Satz nur lesen oder gleich zu einer sachlichen kleinen Handlung übergehen.',limitations:'Nicht jede Person empfindet geführte Selbstzuwendung als angenehm.',stop:'Das Verweilen bei Gefühlen belastender wird.',closing:'Du darfst dir freundlich begegnen und trotzdem ehrlich bleiben.'},
 {id:'slowchoice',title:'Ein sanfter Drei-Wege-Check',group:'Problemlösen',purpose:'Ohne Druck zwischen Akzeptieren, Handeln und Verbindung unterscheiden.',when:'Verwirrung, Ambivalenz oder Entscheidungsmüdigkeit',duration:'2 Min',energy:'niedrig',tags:['Verstehen','Handeln'],steps:['Formuliere in einem Satz, was heute am meisten Gewicht hat.','Frage dich: „Muss ich es gerade annehmen, etwas ändern oder Hilfe holen?“','Notiere eine mögliche Option pro Weg, ohne sie zu bewerten.','Wähle eine Option oder entscheide bewusst, noch nicht zu entscheiden.'],adaptation:'Nur die drei Worte lesen: annehmen – handeln – verbinden.',limitations:'Komplexe Entscheidungen brauchen unter Umständen mehr Zeit oder Informationen.',stop:'Du merkst, dass das Abwägen in Grübeln umkippt.',closing:'Nicht entscheiden ist manchmal eine verantwortliche Zwischenentscheidung.'}
];
if(!STRATEGIES.some(x=>x.id==='meditationopen')) STRATEGIES.push(...ADDITIONAL_STRATEGIES);

const PRIMARY={
 Verstehen:['label','facts','slowchoice','values','defusion'],
 Beruhigen:['meditationopen','orient','sound','slowwalk','walk15'],
 Mitgefühl:['kindvoice','compbreak','meditationcomp','caremoment','kindletter'],
 Handeln:['microaction','walk15','movegentle','nextstep','boundary'],
 Verbindung:['reachout','cowork','appreciate','listen'],
 Ausdrücken:['freewrite','voice','unsent'],
 Ausruhen:['caremoment','restpermission','screenoff','meditationopen'],
 Akzeptieren:['allow','meditationopen','both','mindnote']
};
const BY_EMOTION={
 fear:['orient','meditationopen','kindvoice'],anger:['boundary','walk15','pausemessage','movegentle'],
 shame:['kindvoice','compbreak','meditationcomp'],guilt:['repair','kindvoice','caremoment'],
 sad:['caremoment','slowwalk','reachout'],lonely:['reachout','walk15','cowork'],
 stress:['restpermission','caremoment','meditationopen'],numb:['orient','daylight','slowchoice'],
 joy:['savor','sharejoy','savorwalk'],pride:['strength','savor'],calm:['savor','sound'],
 confusion:['slowchoice','facts','label'],mixed:['both','slowchoice','label']
};
const SENTENCES={
 fear:'Ungewissheit kann sehr anstrengend sein. Wir müssen sie nicht sofort wegmachen.',
 anger:'Deine Wut könnte auf etwas Wichtiges hinweisen. Was du daraus machst, darfst du selbst entscheiden.',
 shame:'Ein Fehler und dein Wert als Mensch sind nicht dasselbe. Du darfst ehrlich hinschauen, ohne dich kleinzumachen.',
 guilt:'Verantwortung und Selbstfreundlichkeit können nebeneinander bestehen.',
 sad:'Traurigkeit braucht nicht immer eine schnelle Lösung.',
 lonely:'Der Wunsch nach Verbindung ist ein menschliches Bedürfnis, kein Zeichen von Schwäche.',
 stress:'Vielleicht ist gerade Entlastung hilfreicher als noch mehr Analyse.',
 numb:'Es ist in Ordnung, wenn du im Moment wenig oder nichts benennen kannst.',
 joy:'Du darfst ein gutes Gefühl erleben, ohne es produktiv nutzen zu müssen.',
 confusion:'Es können mehrere Gefühle und Deutungen zugleich stimmen oder noch offen sein.'
};
const WHY={
 Verstehen:'Weil du eher Klarheit als sofortige Beruhigung suchst.',
 Beruhigen:'Weil du dir gerade etwas mehr Ruhe oder Orientierung wünschst.',
 Mitgefühl:'Weil dir ein freundlicher, ehrlicher Umgang mit dir selbst wichtig ist.',
 Handeln:'Weil ein kleiner, selbst gewählter Schritt hilfreicher sein könnte als weiteres Nachdenken.',
 Verbindung:'Weil Unterstützung auch von außen kommen darf.',
 Ausdrücken:'Weil Gefühle manchmal Raum brauchen, ohne analysiert zu werden.',
 Ausruhen:'Weil Erholung ein legitimes Bedürfnis ist.',
 Akzeptieren:'Weil nicht alles sofort verändert oder gelöst werden muss.'
};
const isAllowed=(x,s)=>!((s.disliked||[]).includes(x.id)||s.avoidBreath&&x.group==='Atmung'||s.avoidBody&&['touch','feet','breathgentle','exhale','breathecount'].includes(x.id)||s.avoidTouch&&x.id==='touch');
export function newCoachSession(goal='Mitgefühl',timeAvailable='5 Min.',energy='niedrig',emotion=''){
 const s=createSession('coping','micro');s.values.goal=GOALS.includes(goal)?goal:'Mitgefühl';s.values.timeAvailable=timeAvailable;s.values.energy=energy;s.values.emotions=emotion?[emotion]:[];return s;
}
/** All suggested exercises are from the audited local catalog; suggestions are hypotheses. */
export function recommendCoach(s,settings={},max=3){
 const v=s?.values||{},goal=GOALS.includes(v.goal)?v.goal:'Mitgefühl',category=getCategoryFor(v.emotions||[]);
 const first=[...(PRIMARY[goal]||[]),...(BY_EMOTION[category]||[])];
 if(v.intensity>=8 || v.capacity==='gering'||settings.lowEnergy)first.unshift('restpermission','orient','caremoment');
 if(v.energy==='niedrig')first.unshift(goal==='Verstehen'?'label':'caremoment');
 if(v.needs?.includes('Grenzen'))first.unshift('boundary');
 if(v.needs?.includes('Ruhe'))first.unshift('restpermission');
 if(v.needs?.includes('Gesellschaft')||v.needs?.includes('Zugehörigkeit'))first.unshift('reachout');
 const fallback=matchStrategies(s||newCoachSession(),settings,12).map(x=>x.id);
 if(v.focus)first.unshift(v.focus);
 const options=[...new Set([...first,...fallback])];
 const fitsTime=x=>v.timeAvailable!=='1 Min.'||!/(?:5|10|15|20)/.test(x.duration);
 const lowEnergy=x=>!(v.energy==='niedrig'||settings.lowEnergy)||x.energy==='niedrig';
 let result=[];
 for(const id of options){const x=STRATEGIES.find(z=>z.id===id);if(!x||!isAllowed(x,settings)||(!(v.focus===x.id)&&(!fitsTime(x)||!lowEnergy(x))))continue;
  if(result.some(y=>y.group===x.group))continue;result.push(x);if(result.length>=max)break;}
 if(result.length<max){for(const id of options){const x=STRATEGIES.find(z=>z.id===id);if(!x||!isAllowed(x,settings)||!fitsTime(x)||!lowEnergy(x)||result.some(y=>y.id===id))continue;result.push(x);if(result.length>=max)break;}}
 return result.slice(0,max);
}
export function coachMessage(s,settings={}){
 const v=s?.values||{},category=getCategoryFor(v.emotions||[]),emotion=v.central||v.emotions?.[0],need=v.needs?.[0],goal=v.goal||'Mitgefühl';
 const opening=emotion?`Du hast „${emotion}“ beschrieben${typeof v.intensity==='number'?` (Intensität ${v.intensity}/10)`:''}.`:'Vielleicht ist gerade noch nicht klar, wie du dich fühlst – das ist in Ordnung.';
 const concern=SENTENCES[category]||'Du darfst deinem Erleben Aufmerksamkeit geben, ohne sofort eine Erklärung finden zu müssen.';
 return {opening,compassion:concern,reason:WHY[goal]||WHY.Mitgefühl,need:need?`„${need}“ hast du als mögliches Bedürfnis genannt. Ob es passt, entscheidest du.`:'Es ist auch okay, dein Bedürfnis noch nicht zu kennen.'};
}
/** Defensively parse AI results. Untrusted strings are never rendered as HTML. */
export function validateCoachReply(raw,allowedIds=[]){
 if(!raw||typeof raw!=='object'||typeof raw.reflection!=='string'||typeof raw.question!=='string'||!Array.isArray(raw.option_ids)||typeof raw.why!=='string'||typeof raw.safety!=='boolean')throw new Error('Die KI-Antwort hatte ein unerwartetes Format.');
 const clean=s=>String(s).trim().slice(0,1500);
 const permitted=new Set(allowedIds);
 return {reflection:clean(raw.reflection),question:raw.safety?'':clean(raw.question).slice(0,350),why:raw.safety?'':clean(raw.why).slice(0,450),safety:raw.safety,option_ids:raw.safety?[]:[...new Set(raw.option_ids.filter(x=>typeof x==='string'&&permitted.has(x)))].slice(0,3)};
}
export function allowedEndpoint(value){
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&u.hostname!=='localhost'&&u.hostname.includes('.')&&u.pathname==='/coach';}catch{return false;}
}
