import {EMOTION_GROUPS, COMPASSION, NEED_GROUPS, STRATEGIES, GOALS} from './data.js';
export const VERSION = 1;
export const DEFAULT_SETTINGS = Object.freeze({depth:'standard',style:'Bodenständig & realistisch',silent:true,lowEnergy:false,spoken:false,allowAi:false,workerEndpoint:'',disliked:[],ratings:{},rememberRatings:false,avoidBreath:false,avoidBody:false,avoidTouch:false,installedReminder:false});
export function createSession(intent='daily',mode='standard',style=DEFAULT_SETTINGS.style){
 return {id:createId(),kind:'reflection',version:VERSION,createdAt:new Date().toISOString(),intent,mode,style,done:[],skipped:[],values:{emotions:[],central:'',intensity:null,needs:[],energy:'',capacity:'',timeAvailable:'',environment:'',chosenStrategy:'',helpfulness:null,criticFear:'',goal:'',contextTag:'',context:'',facts:'',interpretation:'',thought:'',body:'',critic:'',values:'',relation:'',action:'',kindness:'',duration:'',more:'',positive:'',support:'',contribution:''}};
}
export function createId(){return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID():`ic-${Date.now()}-${Math.random().toString(36).slice(2)}`;}
export function getCategoryFor(emotions=[]){
 const found=emotions.map(word=>EMOTION_GROUPS.find(g=>g.terms.includes(word))).filter(Boolean);
 return found[0]?.id||'confusion';
}
export function getNextQuestion(s,settings={}){
 const v=s.values;
 const high=v.intensity>=8 || v.capacity==='gering' || settings.lowEnergy;
 let ids;
 switch(s.mode){
 case 'micro': ids=['emotions','intensity','needs'];break;
 case 'deep':ids=['emotions','intensity','capacity','resources','contextTag','context','facts','interpretation','thought','body','critic','criticFear','values','needs','goal','action','kindness'];break;
 case 'open':{
  const pool=['emotions','goal'];
  if (high) pool.push('capacity','resources','needs','action','context');
  else if (s.intent==='relationship') pool.push('facts','interpretation','needs','relation','action','kindness','context');
  else if (s.intent==='critic') pool.push('critic','criticFear','thought','facts','needs','kindness','action');
  else pool.push('context','needs','facts','thought','values','action','kindness','body');
  ids=[...new Set(pool)];break;
 }
 default: ids=['emotions','intensity','capacity','resources','contextTag','context','goal','needs','action'];
 }
 const priority={
  needs:['emotions','needs','intensity','goal','action'],
  compassion:['emotions','intensity','needs','kindness'],
  overwhelm:['capacity','emotions','needs','action'],
  thought:['emotions','thought','facts','interpretation','needs','action'],
  critic:['emotions','critic','thought','kindness','needs','action'],
  relationship:['emotions','facts','interpretation','relation','needs','action'],
  positive:['emotions','positive','values','kindness'],
  understand:['emotions','intensity','context','facts','interpretation','needs']
 }[s.intent]||[];
 if(s.mode==='micro'){
   ids= s.intent==='overwhelm'?['capacity','emotions','needs']:['emotions','intensity','needs'];
 }else if(s.mode!=='open'){
   ids=[...new Set([...priority,...ids])];
   if(high && s.mode!=='deep') ids=ids.filter(x=>!['interpretation','facts','thought','body','critic','criticFear'].includes(x));
 }
 if(s.mode==='open' && ids.every(id=>s.done.includes(id))) return 'more';
 return ids.find(id=>!s.done.includes(id))||null;
}
export function selfCompassion(s){
 const v=s.values, cat=getCategoryFor(v.emotions), arr=COMPASSION[cat]||COMPASSION.confusion;
 const seed=[...(v.emotions||[])].join('').length+(v.context||'').length+(v.intensity||0);
 const chosen=arr[seed%arr.length];
 if(v.kindness?.trim())return v.kindness.trim();
 const emotion=v.central||v.emotions?.[0]||'';
 const acknowledg=emotion?`Ich bemerke, dass ich mich gerade ${emotion} fühle.`:'Ich bemerke, dass ich mein Erleben noch nicht klar benennen kann.';
 const common=cat==='joy'||cat==='pride'||cat==='calm'||cat==='love'? 'Auch gute und zarte Erfahrungen gehören zum Menschsein; ich muss sie nicht erst verdienen.':[
  'Schwierige Gefühle gehören zu menschlichen Erfahrungen, auch wenn jede Situation anders ist.',
  'Andere Menschen kennen ebenfalls Unsicherheit und Verletzlichkeit; meine Erfahrung bleibt dennoch meine eigene.',
  'Menschlich zu sein heißt auch, nicht alles souverän lösen zu können.'
 ][seed%3];
 const prefix=s.style==='Minimalistisch'?'':s.style==='Sanft & umsorgend'?'Ich darf behutsam sein. ':s.style==='Praktisch & unterstützend'?'Ich kann einen kleinen, machbaren Schritt prüfen. ':s.style==='Warm & ermutigend'?'Ich muss nicht perfekt reagieren. ':'';
 return `${acknowledg} ${common} ${prefix}${chosen}`;
}
export function describeEmotion(s){
 const e=s.values.emotions||[];
 if(!e.length) return 'Noch nicht klar – und das darf so bleiben.';
 const central=s.values.central;
 const list=e.slice(0,4).join(', ');
 return `${central?central[0].toUpperCase()+central.slice(1):list[0].toUpperCase()+list.slice(1)}${e.length>1?` (daneben: ${e.filter(x=>x!==central).join(', ')||list})`:''}.`;
}
export function summaryOf(s,settings={}){
 const v=s.values;
 const possibilities=[v.contextTag,v.context,v.facts,v.interpretation].filter(Boolean);
 const may=possibilities.length?`Du hast ${v.contextTag?`„${v.contextTag}“ als Kontext genannt. `:''}${v.context?`Deine Beschreibung: „${cut(v.context,145)}“. `:''}${v.facts?`Beobachtet laut deiner Angabe: „${cut(v.facts,130)}“. `:''}${v.interpretation?`Eine mögliche Deutung von dir: „${cut(v.interpretation,110)}“ (nicht geprüft).`:''}`:'Die Ursachen können offenbleiben; es ist keine eindeutige Erklärung nötig.';
 const needs=v.needs.length?v.needs.slice(0,3).join(', '):'Noch offen – keine Vermutung wird festgelegt.';
 const strategies=matchStrategies(s,settings,3);
 const insight= v.facts?.trim()&&v.interpretation?.trim()?'Du hast Beobachtung und Interpretation getrennt – beides kann für den nächsten Schritt relevant sein.':v.needs.length?`Du hast „${v.needs[0]}“ als mögliches Bedürfnis erkannt; ob es passt, entscheidest du.`:'Du durftest dir Zeit nehmen, ohne etwas lösen zu müssen.';
 return {feeling:describeEmotion(s),cause:may,needs,compassion:selfCompassion(s),help:strategies.map(x=>x.title).join(' · ')||'Eine Pause ist ebenfalls möglich.',action:v.action?.trim()||'Eine kurze Pause oder ein freundlicher nächster Schritt – wenn du möchtest.',insight};
}
function cut(x,n){return String(x).length>n?String(x).slice(0,n)+'…':String(x);}
export function matchStrategies(s,settings={},max=3){
 const v=s.values, goal=v.goal||'Verstehen', category=getCategoryFor(v.emotions), disliked=settings.disliked||[], ratings=settings.ratings||{};
 const preferred={fear:['orient','facts','defusion','breathgentle'],anger:['boundary','pausemessage','facts','dear'],shame:['compbreak','fairvoice','kindletter'],guilt:['repair','kindletter'],sad:['allow','reachout','warmdrink'],lonely:['reachout','cowork'],stress:['restpermission','basicneeds','orient'],numb:['orient','basicneeds','name3'],joy:['savor','sharejoy'],love:['appreciate'],pride:['strength'],envy:['facts','values'],confusion:['both','label'],mixed:['both','label']};
 const fav=preferred[category]||['label','compbreak'];
 let scoring=STRATEGIES.filter(x=>!disliked.includes(x.id)&&!(settings.avoidBreath&&x.group==='Atmung')&&!(settings.avoidBody&&['touch','feet','breathgentle','exhale','breathecount'].includes(x.id))&&!(settings.avoidTouch&&x.id==='touch')).map(x=>{
  let score = x.tags.includes(goal)?5:0;
  if(fav.includes(x.id)) score+=6-fav.indexOf(x.id)*.5;
  if(s.intent==='overwhelm' && ['restpermission','orient','basicneeds','screenoff'].includes(x.id))score+=8;
  if(s.intent==='relationship'&&['boundary','dear','pausemessage','listen'].includes(x.id))score+=6;
  if(s.intent==='critic'&&['fairvoice','compbreak','kindletter'].includes(x.id))score+=6;
  if(s.intent==='positive'&&x.group==='Positive Gefühle')score+=8;
  if(v.intensity>=8 && ['orient','name3','restpermission','screenoff'].includes(x.id))score+=8;
  if((v.capacity==='gering'||v.energy==='niedrig'||settings.lowEnergy)&&x.energy==='niedrig')score+=4;
  if(v.timeAvailable==='1 Min.' && /10|15|20/.test(x.duration))score-=4;
  if(x.group==='Atmung' && goal!=='Beruhigen')score-=7;
  if(v.environment==='öffentlich' && ['music','voice','warmdrink','slowwalk'].includes(x.id))score-=7;
  if(typeof ratings[x.id]==='number')score+=(ratings[x.id]-3)*1.5;
  return {x,score};
 }).sort((a,b)=>b.score-a.score);
 const unique=[];
 for(const item of scoring){if(!unique.some(x=>x.group===item.x.group))unique.push(item.x);if(unique.length>=max)break;}
 return unique;
}
export function suggestNeeds(s){
 const cat=getCategoryFor(s.values.emotions);
 const picks={sad:['Trost','Verstandenwerden','Ruhe'],fear:['Klarheit','Schutz','Rückversicherung'],anger:['Grenzen','Respekt','Handlungsfähigkeit'],shame:['Annahme','Mitgefühl','Wiedergutmachung'],guilt:['Wiedergutmachung','Vergebung','Integrität'],lonely:['Zugehörigkeit','Gesellschaft','Verstandenwerden'],stress:['Ruhe','Weniger Reize','Unterstützung'],numb:['Ruhe','Orientierung','Geduld'],joy:['Freude','Gemeinschaft','Spiel'],calm:['Ruhe','Einfachheit','Akzeptanz'],love:['Nähe','Gegenseitigkeit','Vertrauen']};
 const valid=new Set(NEED_GROUPS.flatMap(g=>g.items));
 return (picks[cat]||['Klarheit','Annahme','Handlungsfähigkeit']).filter(n=>valid.has(n)).slice(0,3);
}
export function patternReport(entries,fromDate=null){
 const filtered=entries.filter(e=>e?.version===1 && e.kind==='reflection' && (!fromDate||new Date(e.createdAt)>=fromDate));
 const count=(key,func)=>{
  const map=new Map(); filtered.forEach(r=>(func(r)||[]).forEach(t=>{if(typeof t==='string'&&t.trim())map.set(t,(map.get(t)||0)+1);}));
  return [...map].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,n])=>({name,n}));
 };
 return {n:filtered.length,emotions:count('emotions',r=>r.values?.emotions),needs:count('needs',r=>r.values?.needs),contexts:count('contexts',r=>r.values?.contextTag?[r.values.contextTag]:[]),goals:count('goals',r=>r.values?.goal?[r.values.goal]:[]),kindMoments:filtered.filter(r=>!!r.values?.kindness?.trim()).length,strategies:count('strategies',r=>r.values?.chosenStrategy?[STRATEGIES.find(x=>x.id===r.values.chosenStrategy)?.title].filter(Boolean):[]),ratedHelpful:filtered.filter(r=>r.values?.helpfulness>=4).length,criticMoments:filtered.filter(r=>r.intent==='critic').length,joy:filtered.filter(r=>['joy','calm','gratitude','love','pride','hope','excite'].includes(getCategoryFor(r.values?.emotions))).length};
}
export function validateImport(obj){
 if(!obj||typeof obj!=='object'||obj.app!=='INNER COMPASS'||obj.version!==1||!Array.isArray(obj.entries)||obj.entries.length>20000) throw new Error('Unbekanntes oder ungültiges Exportformat.');
 const entries=[];
 for(const r of obj.entries){
  if(!r||r.version!==1||!['reflection','journal'].includes(r.kind)||typeof r.id!=='string'||typeof r.createdAt!=='string'||Number.isNaN(new Date(r.createdAt).getTime())||typeof r.values!=='object'||r.values===null)throw new Error('Mindestens ein Datensatz ist ungültig.');
  if(JSON.stringify(r).length>150000)throw new Error('Ein Datensatz ist zu groß.');
  entries.push(JSON.parse(JSON.stringify(r)));
 }
 return entries;
}
