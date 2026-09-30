/* Studio CAI — Presenze studio v2.4.0
   Web app di timbratura con badge QR, installata da ogni dipendente sul
   proprio telefono. Allineata a Portieri 2.0.

   2.7.0 — 30/09/2026 — "Le tue presenze"
   - Anche l'entrata non timbrata è segnalata (etichetta rossa, con
     l'orario dell'uscita), come già l'uscita non timbrata; le ore del
     giorno contano solo i tratti completi.
   - Si parte dal primo giorno del 2026 presente nel registro per quel
     badge (lo script v6 lo restituisce come "primo"): la freccia indietro
     si ferma a quel mese e i giorni precedenti non compaiono.
   - Ogni barra è sulla scala del suo giorno (dalla prima entrata
     all'ultima uscita, o a ora): sempre piena agli estremi.

   NOVITÀ 2.6.0 — 30/09/2026
   - Letto il badge la timbratura si registra subito con il tipo proposto
     dal registro (Entrata se si risulta fuori, Uscita se in studio): niente
     più scelta né conferma. Per correggere resta l'Inserimento manuale.
   - Il registro comanda: le timbrature di questo telefono già inviate si
     aggiungono a quelle del registro solo nei primi minuti (finché il
     registro non le ha ancora); dopo, se nel registro non ci sono perché
     cancellate (es. prove), non si vedono più né in "In studio adesso" né
     in "Le tue presenze". Quelle ancora da inviare restano sempre.

   2.5.1 — 30/09/2026: sabato e domenica non compaiono più solo perché
   coperti da un periodo di ferie.

   NOVITÀ 2.5.0 — 30/09/2026 — "Le tue presenze"
   Il riepilogo settimanale diventa mensile: frecce per il mese (fino a
   12 mesi indietro) e fila di pulsanti per la settimana, più "Tutto il
   mese". All'apertura è scelta la settimana in corso; nei mesi passati
   si parte da "Tutto il mese". Nessun totale: per ogni giorno orari,
   barra con la pausa pranzo, durata al netto del pranzo, ferie/permessi e
   straordinario. Lo script del registro (v5) risponde a ?id=&mese=.

   2.4.2 — 30/09/2026: l'app si aggiorna da sola quando esce una versione
   nuova (su iPhone l'app installata resta in memoria e continuava a usare
   quella vecchia); se il registro non risponde si vede il motivo
   (tempo scaduto, rete, risposta non valida).
   2.4.1 — 30/09/2026: la prima lettura del registro della giornata può
   richiedere 10-15 secondi (avvio dello script Google): l'attesa passa da
   12 a 40 secondi con un secondo tentativo, intanto si vedono gli ultimi
   dati salvati sul telefono; stato dell'aggiornamento spostato in fondo,
   con "Riprova" se non riesce. Il riepilogo si legge anche in background
   all'apertura dell'app, così quando lo si apre è già pronto.

   NOVITÀ 2.4.0 — 30/09/2026
   (le cartelle 2.2.0 e 2.3.0 in Dropbox sono le prove "In assemblea",
   abbandonate: questa versione parte dalla 2.1.12)
   - Letto il badge restano i pulsanti Entrata/Uscita con il tipo proposto,
     ma senza conto alla rovescia: un tocco registra subito. Se lo schermo
     si spegne o l'app va in background con la scelta aperta, si registra
     il tipo proposto (prima la timbratura veniva annullata).
   - Invio a prova di schermo spento: la timbratura entra prima nella coda
     del telefono e poi parte l'invio (fetch keepalive, che il browser
     completa anche a pagina nascosta). Payload verso Make invariato.
   - Riepilogo all'uscita: la barra va dalla prima entrata all'ultima
     uscita con gli orari veri agli estremi (non più 08:00–19:00); le
     uscite intermedie sono tratteggiate; la pausa pranzo è sempre segnata
     con forchetta e coltello quando cade nella giornata.
   - "Timbrature di oggi" sostituito dal Riepilogo settimanale: settimana
     corrente e precedente, per giorno orari, barra, durata al netto del
     pranzo, ferie/permessi e straordinari dell'app Portieri. Ognuno vede
     solo la propria: il telefono ricorda l'ultimo badge letto e lo script
     del registro (v4, parametro ?id=) restituisce solo i dati di quel
     badge. Si consulta anche fuori studio. Le timbrature in attesa di
     invio, con Riprova, sono in cima a questa pagina.

   NOVITÀ 2.1.2 — Riepilogo all'uscita
   Dopo l'Uscita la schermata di esito mostra il riepilogo della giornata
   del collega: i passaggi di oggi (entrata → uscita) e il tempo totale in
   studio (i singoli tratti solo se sono più di uno). Dati: registro
   condiviso + timbrature di questo dispositivo.
   La schermata resta 8 secondi (un tocco la chiude).
   2.1.3: grafica del riepilogo rifatta (saluto, totale grande, barra
   della giornata con i tratti in studio).
   2.1.4: in testata il logo vero dello studio, come nelle altre webapp.
   2.1.5: dal tempo in studio si toglie in automatico la pausa pranzo
   13:00–14:00 (solo la parte in cui si risulta dentro).
   2.1.6: niente scritta sulla pausa; nella barra l'ora di pranzo è uno
   stacco con l'icona di forchetta e coltello.
   2.1.7: "In studio adesso" mostra anche ferie, permessi, malattia ecc.
   inseriti con l'app Portieri (letti dal registro). Il permesso a ore
   vale quando non si è timbrato l'ingresso o si è già usciti.
   2.1.8: il permesso a ore non si mostra più (solo assenze di giornata
   intera); ogni stato ha la sua iconcina.
   2.1.9: sul telefono nome e stato restano sulla stessa riga.
   2.1.10: testi corretti, non si parla più di "postazione": ognuno
   timbra dal proprio telefono inquadrando il QR sulla sua scrivania.
   2.1.11: nell'inserimento manuale le note sono facoltative.
   2.1.12: nell'inserimento manuale "Nome" al posto di "Collega".

   NOVITÀ 2.1.0 — "In studio adesso" condiviso
   Nella 2.0 il riquadro si basava solo sulle timbrature fatte dallo
   stesso dispositivo: chi timbra dal proprio telefono non vedeva gli
   altri. Ora l'app legge lo stato di oggi dal registro Google (tab 102,
   103, 104) tramite un piccolo Apps Script pubblicato come app web
   (status_url in config.json). Nessun credito Make: la lettura non passa
   da Make. Si aggiorna all'apertura, al ritorno sulla pagina, ogni 3
   minuti mentre l'app è in primo piano e subito dopo ogni timbratura.
   Le timbrature ancora in coda su questo dispositivo si sommano a quelle
   del registro, così il riquadro è corretto anche senza rete.

   COSA CAMBIA RISPETTO ALLA 1.1.0
   - Fotocamera sempre accesa: si avvicina il badge e basta.
   - Tipo (Entrata/Uscita) proposto in automatico dall'ultimo passaggio
     del giorno e registrato da solo dopo 4 secondi, salvo cambio o Annulla.
   - "In studio adesso": chi è dentro, da che ora, chi è uscito.
   - Coda di invio: senza rete la timbratura non si perde, parte da sola
     al ritorno della connessione (3 tentativi automatici, poi "Riprova").
   - Codice univoco (request_id) per ogni timbratura.
   - Stesso badge letto di nuovo entro 2 minuti: ignorato.
   - Inserimento manuale, con note facoltative (v2.1.11).
   - Schermo acceso mentre l'app è aperta (Wake Lock, dove supportato).

   COMPATIBILITÀ CON LO SCENARIO MAKE
   Il payload conserva tutti i campi della 1.1.0 (source, version,
   employee_id, nome, tipo, data, ora, metodo, note, sent_at) con gli
   stessi valori: lo scenario "WebApp Dipendenti CAI" continua a
   funzionare senza modifiche. Si aggiunge solo request_id.
   sent_at è l'istante della timbratura, non dell'invio: una timbratura
   rimasta in coda arriva comunque con la sua data. */

const APP_VERSION = "2.7.0";
const LAST_UPDATE = "2026-09-30";
const CONFIG_DEFAULT = {
  webhook_url: "https://hook.eu1.make.com/wgbye8bprwfsxze34wuydvxckplijn1z",
  status_url: ""
};
const EMPLOYEES_DEFAULT = [
  { id: "STF001", nome: "Simone Pomponi" },
  { id: "STF002", nome: "Marco Reali" },
  { id: "STF003", nome: "Paolo Morabito" }
];

const QR_PREFIX = "CAI-BADGE:";
const QUEUE_KEY = "cai_studio_queue_v1";
const DAY_KEY = "cai_studio_oggi_v1";
const COOLDOWN_MS = 2 * 60 * 1000;  // stesso badge entro 2 minuti: ignorato
const DONE_MS = 3000;               // durata della schermata di esito
const DONE_EXIT_MS = 8000;          // dopo l'Uscita, con il riepilogo della giornata
const SCAN_EVERY_MS = 160;          // cadenza di analisi dei fotogrammi
const MAX_AUTO_ATTEMPTS = 3;
const MANUAL_WINDOW_DAYS = 31;
const POST_TIMEOUT_MS = 10000;
const REMOTE_KEY = "cai_studio_stato_v1";
const HIST_KEY = "cai_studio_storico_v1";   // timbrature di questo telefono, ultimi giorni (per il riepilogo settimanale)
const HIST_DAYS = 16;
const WEEK_TIMEOUT_MS = 40000;              // la prima lettura del giorno può richiedere 10-15 s
const BADGE_KEY = "cai_studio_badge_v1";    // badge di chi usa questo telefono (ultimo letto)
const MESI_KEY = "cai_studio_mesi_v1";      // mesi letti dal registro per "Le tue presenze"
const PAUSA = { da: 13 * 60, a: 14 * 60 };  // pausa pranzo, tolta in automatico dal tempo in studio
const STATUS_EVERY_MS = 3 * 60 * 1000;  // aggiornamento mentre l'app è aperta
const STATUS_AFTER_SEND_MS = 4000;      // rilettura dopo una timbratura

const state = {
  config: { ...CONFIG_DEFAULT },
  employees: [],
  mode: "scan",            // scan | read | done
  panel: "main",
  stream: null,
  detector: null,          // BarcodeDetector nativo, se c'è
  jsqrLoading: null,
  scanTimer: null,
  lastInvalid: { text: "", at: 0 },
  read: null,              // { emp, at: Date, tipo }
  inFlight: new Set(),     // request_id in invio in questo momento
  doneTimer: null,
  wakeLock: null,
  flushing: false,
  remote: null,            // { date: "YYYY-MM-DD", events: [{id,tipo,ora}], assenze: [{id,tipo,intera,ore}], at: ms }
  statusLoading: false,
  presenze: null,          // { id, mesi: { "YYYY-MM": { giorni: { "YYYY-MM-DD": {...} }, at, errore, motivo } } }
  meseLoading: new Set(),
  meseSel: "",             // mese mostrato in "Le tue presenze"
  settSel: "corrente"      // "corrente" | "tutto" | lunedì "YYYY-MM-DD"
};

const $ = (s, el = document) => el.querySelector(s);
const pad = n => String(n).padStart(2, "0");

/* ---------- Font (come Portieri 2.0) ---------- */
function loadFonts(){
  const add = (rel, href, cross) => {
    const l = document.createElement("link");
    l.rel = rel; l.href = href;
    if(cross) l.crossOrigin = "anonymous";
    document.head.appendChild(l);
  };
  add("preconnect", "https://fonts.googleapis.com");
  add("preconnect", "https://fonts.gstatic.com", true);
  add("stylesheet", "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Manrope:wght@400;500;600;700;800&display=block");
}

/* ---------- Utilità ---------- */
function uuid(){
  try { if(crypto?.randomUUID) return crypto.randomUUID(); } catch(e) {}
  return "req-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
function toISODate(d){ return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function toHM(d){ return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }
function todayISO(){ return toISODate(new Date()); }
function formatDay(iso){ if(!iso) return ""; const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; }
function readStore(key, fallback){
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch(e) { return fallback; }
}
function writeStore(key, value){ try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {} }
function initials(nome){ return String(nome || "").split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join("") || "—"; }
function empById(id){ return state.employees.find(e => e.id === id); }
function tipoLabel(t){ return t === "entrata" ? "Entrata" : "Uscita"; }

function toast(text, variant = "ok"){
  const t = $("#toast");
  if(!t) return;
  t.className = `toast show ${variant}`;
  t.textContent = text;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.className = "toast"; t.textContent = ""; }, 3800);
}

/* ---------- Dati ---------- */
async function loadData(){
  const opts = { cache: "no-cache" };
  const [cfg, emp] = await Promise.allSettled([
    fetch("./config.json", opts).then(r => r.ok ? r.json() : Promise.reject()),
    fetch("./employees.json", opts).then(r => r.ok ? r.json() : Promise.reject())
  ]);
  if(cfg.status === "fulfilled") state.config = { ...CONFIG_DEFAULT, ...cfg.value };
  state.employees = (emp.status === "fulfilled" && Array.isArray(emp.value) && emp.value.length) ? emp.value : EMPLOYEES_DEFAULT;
  // Ordine alfabetico per nome, come negli altri portali
  state.employees.sort((a, b) => String(a.nome).localeCompare(String(b.nome), "it"));
}

/* ---------- Giornata: timbrature fatte da questo dispositivo ----------
   Si azzera da sola a cambio data. Serve per "In studio adesso", per il
   tipo proposto e per l'elenco di oggi. Il registro ufficiale resta il
   foglio dello studio. */
function loadDay(){
  const d = readStore(DAY_KEY, null);
  if(!d || d.date !== todayISO()) return { date: todayISO(), events: [] };
  return d;
}
function saveDay(day){ writeStore(DAY_KEY, day); }
function addEvent(ev){
  const day = loadDay();
  day.events.push(ev);
  saveDay(day);
  // Storico degli ultimi giorni (riepilogo settimanale anche prima che il
  // registro sia aggiornato, o senza rete)
  const h = loadHist();
  h.push(ev);
  saveHist(h);
}
function setEventStatus(requestId, status){
  const day = loadDay();
  const ev = day.events.find(e => e.request_id === requestId);
  if(ev){ ev.status = status; saveDay(day); }
  const h = loadHist();
  const he = h.find(e => e.request_id === requestId);
  if(he){ he.status = status; saveHist(h); }
}
function loadHist(){
  const h = readStore(HIST_KEY, []);
  return Array.isArray(h) ? h : [];
}
function saveHist(h){
  const min = new Date(); min.setDate(min.getDate() - HIST_DAYS);
  const lim = toISODate(min);
  writeStore(HIST_KEY, h.filter(e => e && e.data >= lim));
}
/* Timbrature di oggi di un collega, in ordine di orario: quelle del
   registro condiviso più quelle di questo dispositivo non ancora
   presenti nel registro (in coda, o inviate da pochi istanti). */
/* Una timbratura di questo telefono si somma al registro solo se non è
   ancora inviata, oppure se è stata inviata da poco (il registro può non
   averla ancora: invio a Make, memoria di 2 minuti dello script). Oltre
   questo margine vale il registro: se lì manca, è stata cancellata. */
const LOCALE_MARGINE_MS = 5 * 60 * 1000;
function localeValida(e, registroAt){
  if(e.status !== "sent") return true;
  if(!registroAt) return true;
  return (e.created || 0) > registroAt - LOCALE_MARGINE_MS;
}
function todayEventsOf(empId){
  const today = todayISO();
  const remote = (state.remote && state.remote.date === today)
    ? state.remote.events.filter(e => e.id === empId).map(e => ({ tipo: e.tipo, ora: e.ora, created: 0 }))
    : [];
  const registroAt = (state.remote && state.remote.date === today) ? state.remote.at : 0;
  const local = loadDay().events
    .filter(e => e.employee_id === empId && e.data === today)
    .filter(e => localeValida(e, registroAt))
    .filter(e => !remote.some(r => r.tipo === e.tipo && r.ora === e.ora));
  return remote.concat(local)
    .sort((a, b) => a.ora.localeCompare(b.ora) || (a.created || 0) - (b.created || 0));
}
function presenceOf(empId){
  const evs = todayEventsOf(empId);
  const last = evs[evs.length - 1];
  if(!last) return { stato: "none", ora: "" };
  return { stato: last.tipo === "entrata" ? "in" : "out", ora: last.ora };
}
/* Assenza di oggi dall'app Portieri: solo quelle di giornata intera.
   Il permesso a ore non si mostra (v2.1.8): senza l'orario non si sa
   quando cade. */
function assenzaOf(empId){
  if(!state.remote || state.remote.date !== todayISO()) return null;
  return (state.remote.assenze || []).find(x => x.id === empId && x.intera) || null;
}
function assenzaInfo(tipo){
  const t = String(tipo).toLowerCase();
  if(t === "ferie") return { testo: "In ferie", icona: "ferie" };
  if(t === "malattia") return { testo: "In malattia", icona: "malattia" };
  if(t.startsWith("permesso")) return { testo: "In permesso", icona: "permesso" };
  if(t === "recupero") return { testo: "In recupero", icona: "recupero" };
  if(t === "formazione") return { testo: "In formazione", icona: "formazione" };
  return { testo: "Assente", icona: "assente" };
}
/* Iconcine degli stati (v2.1.8), tratto nel colore dell'etichetta */
const ICONE = {
  in: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/>',
  out: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M9 16l-4-4 4-4"/><path d="M5 12h10"/>',
  none: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
  ferie: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  malattia: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 11v6"/>',
  permesso: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  recupero: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 3.5v5h5"/>',
  formazione: '<path d="M2.5 5.5h6a3.5 3.5 0 0 1 3.5 3.5v11a2.5 2.5 0 0 0-2.5-2.5h-7z"/><path d="M21.5 5.5h-6A3.5 3.5 0 0 0 12 9v11a2.5 2.5 0 0 1 2.5-2.5h7z"/>',
  assente: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>'
};
/* Stato da mostrare: le timbrature vincono; senza ingresso (o dopo
   l'uscita) vale l'assenza di giornata intera di oggi */
function statoWho(empId){
  const p = presenceOf(empId);
  if(p.stato === "in") return { cls: "in", testo: "In studio", icona: "in" };
  const a = assenzaOf(empId);
  if(a) return { cls: "assente", ...assenzaInfo(a.tipo) };
  return p.stato === "out"
    ? { cls: "out", testo: "Uscito", icona: "out" }
    : { cls: "none", testo: "Non ancora arrivato", icona: "none" };
}
function suggestTipo(empId){
  return presenceOf(empId).stato === "in" ? "uscita" : "entrata";
}
function lastScanOf(empId){
  const evs = loadDay().events.filter(e => e.employee_id === empId && e.metodo === "qr");
  return evs.length ? evs[evs.length - 1] : null;
}

/* ---------- Stato condiviso dal registro ---------- */
function loadRemoteCache(){
  const r = readStore(REMOTE_KEY, null);
  if(r && r.date === todayISO() && Array.isArray(r.events)) state.remote = r;
}

/* L'Apps Script restituisce { date: "dd/MM/yyyy", events: [{id, tipo, ora}],
   assenze: [{id, tipo, intera, ore}] } */
async function fetchStatus(){
  const url = state.config.status_url;
  if(!url || state.statusLoading || !navigator.onLine) return;
  state.statusLoading = true;
  const ctrl = ("AbortController" in window) ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), 9000) : null;
  try {
    const res = await fetch(url, { cache: "no-store", signal: ctrl?.signal });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const [d, m, y] = String(data.date || "").split("/");
    const iso = (y && m && d) ? `${y}-${pad(+m)}-${pad(+d)}` : "";
    const known = new Set(state.employees.map(e => e.id));
    const events = (Array.isArray(data.events) ? data.events : [])
      .map(e => ({ id: String(e.id || ""), tipo: String(e.tipo || "").toLowerCase(), ora: String(e.ora || "").slice(0, 5) }))
      .filter(e => known.has(e.id) && (e.tipo === "entrata" || e.tipo === "uscita") && /^\d{2}:\d{2}$/.test(e.ora));
    const assenze = (Array.isArray(data.assenze) ? data.assenze : [])
      .map(a => ({ id: String(a.id || ""), tipo: String(a.tipo || ""), intera: a.intera !== false, ore: Number(a.ore) || 0 }))
      .filter(a => known.has(a.id) && a.tipo);
    if(iso === todayISO()){
      state.remote = { date: iso, events, assenze, at: Date.now() };
      writeStore(REMOTE_KEY, state.remote);
    }
  } catch(e) {
    // Registro non raggiungibile: resta l'ultimo stato noto
  } finally {
    if(t) clearTimeout(t);
    state.statusLoading = false;
    renderWho();
  }
}

function renderWhoUpdated(){
  const el = $("#who-updated");
  if(!el) return;
  if(!state.config.status_url){ el.textContent = "Solo da questo dispositivo"; return; }
  if(state.remote && state.remote.at && state.remote.date === todayISO()){
    el.textContent = `Aggiornato alle ${toHM(new Date(state.remote.at))}`;
  } else {
    el.textContent = navigator.onLine ? "Aggiornamento…" : "Offline";
  }
}

/* ---------- In studio adesso ---------- */
function renderWho(){
  renderWhoUpdated();
  const list = $("#who-list");
  if(!list) return;
  const frag = document.createDocumentFragment();
  state.employees.forEach(emp => {
    const s = statoWho(emp.id);
    const li = document.createElement("li");
    li.className = "who-item";
    const name = document.createElement("span");
    name.className = "who-name";
    name.textContent = emp.nome;
    const st = document.createElement("span");
    st.className = `stato stato--${s.cls}`;
    // Solo lo stato, senza orari (v2.1.1); ferie e permessi dal registro
    // (v2.1.7); con l'iconcina davanti (v2.1.8)
    st.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONE[s.icona]}</svg>`;
    st.appendChild(document.createTextNode(s.testo));
    li.append(name, st);
    frag.appendChild(li);
  });
  list.replaceChildren(frag);
}

/* ---------- Rete e coda ---------- */
function attachNetStatus(){
  const update = () => {
    const on = navigator.onLine;
    $("#net-dot")?.classList.toggle("offline", !on);
    const t = $("#net-text"); if(t) t.textContent = on ? "Online" : "Offline";
  };
  window.addEventListener("online", () => { update(); flushQueue(); fetchStatus(); });
  window.addEventListener("offline", update);
  update();
}

function loadQueue(){ return readStore(QUEUE_KEY, []); }
function saveQueue(q){ writeStore(QUEUE_KEY, q); renderQueuePill(); }
function enqueue(payload){
  const q = loadQueue();
  if(!q.some(i => i.payload.request_id === payload.request_id)){
    q.push({ payload, attempts: 0, queued_at: new Date().toISOString() });
  }
  saveQueue(q);
}
function renderQueuePill(){
  const pill = $("#queue-pill");
  if(!pill) return;
  const q = loadQueue();
  if(!q.length){ pill.hidden = true; return; }
  const held = q.filter(i => (i.attempts || 0) >= MAX_AUTO_ATTEMPTS).length;
  pill.hidden = false;
  pill.textContent = held
    ? (held === 1 ? "1 timbratura da riprovare" : `${held} timbrature da riprovare`)
    : (q.length === 1 ? "1 timbratura in attesa" : `${q.length} timbrature in attesa`);
}

/* keepalive: il browser porta a termine l'invio anche se la pagina viene
   nascosta o chiusa (schermo spento subito dopo la timbratura). Se il
   browser non accetta keepalive per questa richiesta, si riprova subito
   senza (errore immediato, la richiesta non è partita). */
async function postJSON(url, payload, keepalive = true){
  const ctrl = ("AbortController" in window) ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), POST_TIMEOUT_MS) : null;
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
      keepalive,
      signal: ctrl?.signal
    });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch(e) {
    if(keepalive && e && e.name === "TypeError" && Date.now() - t0 < 300 && navigator.onLine && !document.hidden){
      if(t) clearTimeout(t);
      return postJSON(url, payload, false);
    }
    throw e;
  } finally { if(t) clearTimeout(t); }
}

function removeFromQueue(requestId){
  const q = loadQueue().filter(i => i.payload.request_id !== requestId);
  saveQueue(q);
}
function bumpAttempts(requestId){
  const q = loadQueue();
  const item = q.find(i => i.payload.request_id === requestId);
  if(!item) return 0;
  item.attempts = (item.attempts || 0) + 1;
  saveQueue(q);
  return item.attempts;
}

/* Invia una timbratura già in coda. Un solo invio per volta per ogni
   request_id, così coda e invio diretto non creano doppioni. */
async function sendQueued(payload){
  const id = payload.request_id;
  if(state.inFlight.has(id)) return "busy";
  state.inFlight.add(id);
  try {
    await postJSON(state.config.webhook_url, payload);
    removeFromQueue(id);
    setEventStatus(id, "sent");
    return "sent";
  } catch(e) {
    const n = bumpAttempts(id);
    if(n >= MAX_AUTO_ATTEMPTS) setEventStatus(id, "held");
    return "queued";
  } finally {
    state.inFlight.delete(id);
  }
}

/* I tentativi automatici sono limitati: se il webhook riceve ma la
   risposta non torna, un ritentativo perpetuo creerebbe doppioni. */
async function flushQueue(){
  if(state.flushing || !navigator.onLine) return;
  if(!loadQueue().length) return;
  state.flushing = true;
  try {
    for(const item of loadQueue()){
      if((item.attempts || 0) >= MAX_AUTO_ATTEMPTS) continue;
      if(state.inFlight.has(item.payload.request_id)) continue;
      const res = await sendQueued(item.payload);
      if(res === "queued") break;   // rete ancora giù: si riprova più tardi
    }
  } finally {
    state.flushing = false;
    renderQueuePill();
    renderWeekPending();
    if(!loadQueue().length) setTimeout(fetchStatus, STATUS_AFTER_SEND_MS);
  }
}
function retryHeld(requestId){
  const q = loadQueue();
  const item = q.find(i => i.payload.request_id === requestId);
  if(!item) return;
  item.attempts = 0;
  saveQueue(q);
  setEventStatus(requestId, "queued");
  renderWeekPending();
  flushQueue();
}

/* Registra: prima nella coda del telefono (sopravvive a schermo spento,
   app chiusa, rete assente), poi invia. Il salvataggio è sincrono: quando
   la funzione restituisce il controllo la timbratura è già al sicuro. */
function submitEvent(payload){
  addEvent({
    request_id: payload.request_id,
    employee_id: payload.employee_id,
    nome: payload.nome,
    tipo: payload.tipo,
    data: payload.data,
    ora: payload.ora,
    metodo: payload.metodo,
    status: "queued",
    created: Date.now()
  });
  enqueue(payload);
  renderWho();
  if(!navigator.onLine){ renderWeekPending(); return Promise.resolve("queued"); }
  return sendQueued(payload).then(res => {
    renderWeekPending();
    if(res === "sent") setTimeout(fetchStatus, STATUS_AFTER_SEND_MS);
    return res === "sent" ? "sent" : "queued";
  });
}

function buildPayload({ emp, tipo, when, data, ora, metodo, note }){
  return {
    source: "studio-presenze-webapp",
    version: APP_VERSION,
    request_id: uuid(),
    employee_id: emp.id,
    nome: emp.nome,
    tipo,
    data,
    ora,
    metodo,
    note: note || "",
    sent_at: when.toISOString()
  };
}

/* ---------- Fotocamera e lettura QR ---------- */
async function startCamera(){
  const status = $("#scanner-status");
  const video = $("#scanner-video");
  const btn = $("#btn-camera");
  if(state.stream) { scheduleScan(); return; }

  if(!navigator.mediaDevices?.getUserMedia){
    status.textContent = "Fotocamera non disponibile su questo browser. Usa l'inserimento manuale.";
    return;
  }
  try {
    status.textContent = "Avvio fotocamera…";
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    state.stream = stream;
    video.srcObject = stream;
    await video.play().catch(() => {});
    btn.hidden = true;
    setScanIdle();
    scheduleScan();
  } catch(e) {
    btn.hidden = false;
    status.textContent = (e && e.name === "NotAllowedError")
      ? "Accesso alla fotocamera negato. Consentilo nelle impostazioni del browser, poi tocca Attiva fotocamera."
      : "Fotocamera non avviata. Tocca Attiva fotocamera per riprovare.";
  }
}

function stopCamera(){
  clearTimeout(state.scanTimer);
  state.scanTimer = null;
  state.stream?.getTracks().forEach(t => t.stop());
  state.stream = null;
  const v = $("#scanner-video"); if(v) v.srcObject = null;
}

function setScanIdle(){
  const s = $("#scanner-status");
  if(s) s.textContent = "Inquadra il QR sulla tua scrivania";
  $(".scanner-wrap")?.classList.remove("paused");
}

async function setupDetector(){
  try {
    if("BarcodeDetector" in window){
      const formats = await window.BarcodeDetector.getSupportedFormats?.();
      if(!formats || formats.includes("qr_code")){
        state.detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      }
    }
  } catch(e) { state.detector = null; }
}

/* jsQR si carica solo se il lettore nativo non c'è */
function ensureJsQR(){
  if(window.jsQR) return Promise.resolve();
  if(state.jsqrLoading) return state.jsqrLoading;
  state.jsqrLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "./jsqr.min.js";
    s.onload = resolve;
    s.onerror = () => { state.jsqrLoading = null; reject(); };
    document.head.appendChild(s);
  });
  return state.jsqrLoading;
}

function scheduleScan(){
  clearTimeout(state.scanTimer);
  state.scanTimer = setTimeout(scanTick, SCAN_EVERY_MS);
}

async function scanTick(){
  if(!state.stream || state.mode !== "scan" || state.panel !== "main" || document.hidden) return;
  const video = $("#scanner-video");
  let text = null;

  if(video.readyState >= 2 && video.videoWidth){
    try {
      if(state.detector){
        const codes = await state.detector.detect(video);
        if(codes && codes.length) text = codes[0].rawValue;
      } else {
        await ensureJsQR();
        text = decodeWithJsQR(video);
      }
    } catch(e) {
      // Lettore nativo in errore: si passa a jsQR
      if(state.detector){ state.detector = null; }
    }
  }

  if(text) onCode(text);
  else scheduleScan();
}

/* Analizza solo il riquadro centrale, ridotto: molto più leggero che
   l'intero fotogramma a 1280×720 della 1.1.0. */
function decodeWithJsQR(video){
  const canvas = $("#scanner-canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const vw = video.videoWidth, vh = video.videoHeight;
  const side = Math.floor(Math.min(vw, vh) * 0.75);
  const sx = Math.floor((vw - side) / 2), sy = Math.floor((vh - side) / 2);
  const out = Math.min(side, 520);
  canvas.width = out; canvas.height = out;
  ctx.drawImage(video, sx, sy, side, side, 0, 0, out, out);
  const img = ctx.getImageData(0, 0, out, out);
  const code = window.jsQR(img.data, out, out, { inversionAttempts: "dontInvert" });
  return code ? code.data : null;
}

function onCode(text){
  const raw = String(text || "").trim();
  const now = Date.now();

  if(!raw.startsWith(QR_PREFIX)){
    if(raw !== state.lastInvalid.text || now - state.lastInvalid.at > 4000){
      toast("QR non riconosciuto: usa un badge dello studio.", "warn");
    }
    state.lastInvalid = { text: raw, at: now };
    scheduleScan();
    return;
  }

  const id = raw.slice(QR_PREFIX.length).trim();
  const emp = empById(id);
  if(!emp){
    if(raw !== state.lastInvalid.text || now - state.lastInvalid.at > 4000){
      toast(`Badge ${id} non abilitato.`, "warn");
    }
    state.lastInvalid = { text: raw, at: now };
    scheduleScan();
    return;
  }

  // Stesso badge riletto a breve distanza: nessuna seconda timbratura
  const last = lastScanOf(emp.id);
  if(last && now - last.created < COOLDOWN_MS){
    if(raw !== state.lastInvalid.text || now - state.lastInvalid.at > 4000){
      toast(`${emp.nome}: ${tipoLabel(last.tipo).toLowerCase()} già registrata alle ${last.ora}.`, "warn");
    }
    state.lastInvalid = { text: raw, at: now };
    scheduleScan();
    return;
  }

  try { navigator.vibrate?.(120); } catch(e) {}
  // Il telefono ricorda di chi è (ultimo badge letto): serve al riepilogo
  // settimanale, consultabile anche fuori studio
  writeStore(BADGE_KEY, emp.id);
  openRead(emp);
}

/* ---------- Badge letto ----------
   Pulsanti Entrata/Uscita con il tipo proposto evidenziato: un tocco
   registra subito (niente più conto alla rovescia, v2.4.0). Se lo schermo
   si spegne con la scelta aperta si registra il tipo proposto. */
function openRead(emp){
  const at = new Date();
  const tipo = suggestTipo(emp.id);
  state.read = { emp, at, tipo };
  state.mode = "read";

  $("#read-initials").textContent = initials(emp.nome);
  $("#read-name").textContent = emp.nome;
  $("#read-time").textContent = `Badge letto alle ${toHM(at)}`;

  // v2.6.0: niente scelta né conferma, si registra subito il tipo proposto
  confirmRead();
}

function chooseTipo(tipo){
  if(!state.read) return;
  state.read.tipo = tipo;
  confirmRead();
}

function cancelRead(){
  state.read = null;
  backToScan();
}

function confirmRead(){
  const r = state.read;
  if(!r) return;
  state.read = null;

  const payload = buildPayload({
    emp: r.emp, tipo: r.tipo, when: r.at,
    data: toISODate(r.at), ora: toHM(r.at), metodo: "qr"
  });

  const sending = submitEvent(payload);   // già salvata in coda qui
  showDone({ tipo: r.tipo, nome: r.emp.nome, ora: payload.ora, status: navigator.onLine ? "sending" : "queued" });
  renderRiepilogo(r.tipo === "uscita" ? r.emp.id : null);
  clearTimeout(state.doneTimer);
  state.doneTimer = setTimeout(backToScan, r.tipo === "uscita" ? DONE_EXIT_MS : DONE_MS);

  sending.then(res => {
    if(state.mode !== "done") return;
    showDone({ tipo: r.tipo, nome: r.emp.nome, ora: payload.ora, status: res });
    if(res === "queued" && r.tipo !== "uscita"){
      clearTimeout(state.doneTimer);
      state.doneTimer = setTimeout(backToScan, DONE_MS + 1500);
    }
  });
}

/* ---------- Riepilogo della giornata (dopo l'Uscita) ----------
   Coppie entrata → uscita di oggi, in ordine di orario, e tempo totale.
   Un'uscita senza entrata prima non conta; un'entrata senza uscita
   (non dovrebbe capitare, l'ultimo passaggio è l'uscita) resta aperta.
   Pausa pranzo: la parte di ogni tratto che cade tra 13:00 e 14:00 non
   si conta (chi esce alle 13 e rientra alle 14 non perde nulla). */
function turniDa(events){
  const turni = [];
  const orfane = [];   // uscite senza un'entrata prima (entrata non timbrata)
  let aperto = null, pausa = 0;
  events.forEach(e => {
    if(e.tipo === "entrata"){ if(!aperto) aperto = e.ora; }
    else if(e.tipo === "uscita" && !aperto){
      // Stessa uscita ripetuta subito dopo (doppio invio): non è un'anomalia
      const prec = turni[turni.length - 1];
      if(!(prec && prec.a === e.ora) && !orfane.includes(e.ora)) orfane.push(e.ora);
    }
    else if(e.tipo === "uscita" && aperto){
      const da = hmToMin(aperto), a = hmToMin(e.ora);
      const lordo = Math.max(0, a - da);
      const inPausa = Math.max(0, Math.min(a, PAUSA.a) - Math.max(da, PAUSA.da));
      pausa += inPausa;
      turni.push({ da: aperto, a: e.ora, min: lordo - inPausa });
      aperto = null;
    }
  });
  return { turni, aperto, orfane, pausa, totale: turni.reduce((s, t) => s + t.min, 0) };
}
function giornataDi(empId){ return turniDa(todayEventsOf(empId)); }
function fmtDurata(min){
  const h = Math.floor(min / 60), m = min % 60;
  return h ? (m ? `${h} h ${pad(m)} min` : `${h} h`) : `${m} min`;
}
function saluto(ora){
  const h = +ora.slice(0, 2);
  // "Buon pranzo" fino alle 14, in linea con la pausa pranzo 13–14
  return h < 12 ? "A dopo" : h < 14 ? "Buon pranzo" : h < 18 ? "Buon pomeriggio" : "Buona serata";
}
/* Barra di una giornata. turni: [{da:"HH:MM", a:"HH:MM"}]; opzioni:
   scala [min, max] in minuti (comune a tutta la settimana nel riepilogo
   settimanale; altrimenti dalla prima entrata all'ultima uscita), live
   (tratto in corso {da, a}), etichette (orari agli estremi, sotto).
   Tratti in studio spezzati sulla pausa pranzo, uscite intermedie
   tratteggiate, pausa segnata con forchetta e coltello. */
const FORCHETTA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.2 1.2-3.5 3.6-3.5 7v3.5H17"/></svg>';
function hmToMin(hm){ const [h, m] = String(hm).split(":").map(Number); return h * 60 + m; }
function minToHm(x){ return `${pad(Math.floor(x / 60))}:${pad(x % 60)}`; }
function senzaPausa(x, y){
  if(y <= PAUSA.da || x >= PAUSA.a) return [[x, y]];
  return [[x, Math.min(y, PAUSA.da)], [Math.max(x, PAUSA.a), y]].filter(([p, q]) => q > p);
}
function barraGiornata(turni, opt = {}){
  const el = (tag, cls) => { const e = document.createElement(tag); if(cls) e.className = cls; return e; };
  const pezzi = turni.map(t => [hmToMin(t.da), hmToMin(t.a)]);
  if(opt.live) pezzi.push([hmToMin(opt.live.da), hmToMin(opt.live.a)]);
  let lo, hi;
  if(opt.scala){ [lo, hi] = opt.scala; }
  else {
    lo = Math.min(...pezzi.map(p => p[0]));
    hi = Math.max(...pezzi.map(p => p[1]));
  }
  if(!(hi > lo)) hi = lo + 1;
  const span = hi - lo;
  const pct = x => `${((x - lo) / span) * 100}%`;
  const w = (x, y) => `${((y - x) / span) * 100}%`;

  const wrap = el("div", "tl");
  wrap.setAttribute("aria-hidden", "true");
  const bar = el("div", "tl-bar");
  const seg = (cls, x, y, minW) => {
    const s = el("span", cls);
    s.style.left = pct(x);
    s.style.width = minW ? `max(${w(x, y)}, ${minW})` : w(x, y);
    bar.appendChild(s);
  };
  turni.forEach((t, i) => {
    const x = hmToMin(t.da), y = hmToMin(t.a);
    senzaPausa(x, y).forEach(([p, q]) => seg("tl-seg", p, q, "4px"));
    const n = turni[i + 1] || (opt.live ? { da: opt.live.da } : null);
    if(n){
      const nx = hmToMin(n.da);
      if(nx > y) senzaPausa(y, nx).forEach(([p, q]) => seg("tl-gap", p, q));
    }
  });
  if(opt.live){
    const x = hmToMin(opt.live.da), y = hmToMin(opt.live.a);
    senzaPausa(x, y).forEach(([p, q]) => seg("tl-live", p, q, "4px"));
  }
  const p0 = Math.max(PAUSA.da, lo), p1 = Math.min(PAUSA.a, hi);
  if(p1 > p0){
    const p = el("span", "tl-pausa");
    p.style.left = pct(p0);
    p.style.width = w(p0, p1);
    p.title = "Pausa pranzo";
    p.innerHTML = FORCHETTA;
    bar.appendChild(p);
  }
  wrap.appendChild(bar);

  if(opt.etichette){
    const sc = el("div", "tl-scala");
    const lab = (cls, ora, testo) => {
      const s = el("span", `tl-t ${cls}`);
      s.textContent = ora;
      const i = el("i"); i.textContent = testo; s.appendChild(i);
      sc.appendChild(s);
    };
    lab("first", minToHm(lo), "entrata");
    lab("last", minToHm(hi), "uscita");
    wrap.appendChild(sc);
  }
  return wrap;
}

function renderRiepilogo(empId){
  const box = $("#done-riepilogo");
  const card = $("#done-card");
  if(!box) return;
  if(!empId){ box.hidden = true; card?.classList.remove("card--exit"); return; }
  const emp = empById(empId);
  const g = giornataDi(empId);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if(cls) e.className = cls; if(txt != null) e.textContent = txt; return e; };
  const frag = document.createDocumentFragment();

  const ultima = g.turni.length ? g.turni[g.turni.length - 1].a : toHM(new Date());
  const nome = String(emp?.nome || "").split(/\s+/)[0];
  frag.appendChild(el("p", "rp-saluto", `${saluto(ultima)}${nome ? ", " + nome : ""}!`));

  if(!g.turni.length){
    frag.appendChild(el("p", "rp-vuoto", "Nessuna entrata registrata oggi."));
  } else {
    frag.appendChild(el("p", "rp-label", "Oggi in studio"));
    // Totale grande: ore e minuti con le unità più piccole
    const tot = el("p", "rp-totale");
    const h = Math.floor(g.totale / 60), m = g.totale % 60;
    if(h){ tot.append(el("span", "rp-num", String(h)), el("span", "rp-unit", "h")); }
    tot.append(el("span", "rp-num", h ? pad(m) : String(m)), el("span", "rp-unit", "min"));
    frag.appendChild(tot);

    // Barra della giornata dalla prima entrata all'ultima uscita, con gli
    // orari veri agli estremi (v2.4.0)
    frag.appendChild(barraGiornata(g.turni, { etichette: true }));

    // Dettaglio dei tratti solo se nella giornata ce n'è più di uno
    if(g.turni.length > 1){
      const ul = el("ul", "rp-turni");
      g.turni.forEach(t => {
        const li = el("li");
        li.append(el("span", "rp-orari", `${t.da} – ${t.a}`), el("span", "rp-durata", fmtDurata(t.min)));
        ul.appendChild(li);
      });
      frag.appendChild(ul);
    }
  }
  box.replaceChildren(frag);
  box.hidden = false;
  card?.classList.add("card--exit");
}

function showDone({ tipo, nome, ora, status }){
  state.mode = "done";
  showMainCard("done");
  $("#done-title").textContent = `${tipoLabel(tipo)} registrata`;
  $("#done-sub").textContent = `${nome} · ore ${ora}`;
  if(status === "sending") renderRiepilogo(null);
  const note = $("#done-note");
  const check = $("#done-check");
  check.classList.toggle("queued", status === "queued");
  note.classList.toggle("warn", status === "queued");
  note.textContent = status === "sending" ? "Invio al registro dello studio…"
    : status === "sent" ? "Inviata al registro dello studio."
    : "Nessuna rete: salvata su questo dispositivo, parte da sola appena torna la connessione.";
}

function showMainCard(which){
  $("#scan-card").hidden = which !== "scan";
  $("#read-card").hidden = which !== "read";
  $("#done-card").hidden = which !== "done";
}

function backToScan(){
  clearTimeout(state.doneTimer);
  state.mode = "scan";
  showMainCard("scan");
  setScanIdle();
  renderWho();
  if(state.panel === "main"){
    if(state.stream) scheduleScan(); else startCamera();
  }
}

/* ---------- Pannelli ---------- */
function switchPanel(name){
  state.panel = name;
  ["main", "manual", "week", "badges"].forEach(p => { $("#panel-" + p).hidden = p !== name; });
  if(name === "main"){
    backToScan();
  } else {
    state.read = null;
    stopCamera();              // la fotocamera si spegne fuori dalla schermata principale
    if(name === "week"){ state.meseSel = meseCorrente(); state.settSel = "corrente"; renderWeek(); fetchWeek(state.meseSel); }
    if(name === "manual") prepareManual();
  }
  try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch(e) { window.scrollTo(0, 0); }
}

/* ---------- Le tue presenze (v2.5.0) ----------
   Sostituisce il riepilogo settimanale della 2.4. Un mese per volta
   (fino a 12 mesi indietro) con il selettore della settimana: all'apertura
   è scelta la settimana in corso; nei mesi passati "Tutto il mese".
   Solo il badge di questo telefono (ultimo letto): lo script del registro
   con ?id=&mese= restituisce solo i dati di quel badge, con le settimane
   intere ai bordi del mese. Alle timbrature del registro si aggiungono
   quelle di questo telefono non ancora arrivate (in coda, o inviate da
   poco). Ogni mese letto resta sul telefono. Nessuna lettura periodica:
   si aggiorna all'apertura della pagina e al cambio di mese. */
const GIORNI = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const EXTRA_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2.5h6M12 2.5V5"/></svg>';
const MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
const MESI_LUNGHI = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const MESI_INDIETRO = 12;

function myBadge(){
  const id = readStore(BADGE_KEY, "");
  return empById(id) ? id : "";
}
function meseCorrente(){ return todayISO().slice(0, 7); }
function meseSposta(ym, n){
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1, 12);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}
/* Primo mese consultabile: quello del primo giorno del 2026 nel registro
   per questo badge (v2.7.0); finché non è noto, gennaio 2026 */
const ANNO_INIZIO = "2026-01";
function primoGiornoRegistro(){
  return state.presenze && state.presenze.id === myBadge() && state.presenze.primo ? state.presenze.primo : "";
}
function meseMinimo(){
  const p = primoGiornoRegistro();
  const min = p ? p.slice(0, 7) : ANNO_INIZIO;
  const limite = meseSposta(meseCorrente(), -MESI_INDIETRO);
  return min > limite ? min : limite;
}
function lunedi(d){
  const x = new Date(d); x.setHours(12, 0, 0, 0);
  x.setDate(x.getDate() - (x.getDay() + 6) % 7);
  return x;
}
function isoToDate(iso){ const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d, 12); }

/* Dati per badge: { id, mesi: { "YYYY-MM": { giorni: {ISO: {...}}, at } } } */
function loadMesiCache(){
  const c = readStore(MESI_KEY, null);
  if(c && c.id && c.mesi && typeof c.mesi === "object") state.presenze = { primo: "", ...c };
}
function saveMesiCache(){
  if(!state.presenze) return;
  const min = meseMinimo();
  const mesi = {};
  Object.keys(state.presenze.mesi).filter(k => k >= min).forEach(k => {
    const { giorni, at } = state.presenze.mesi[k];
    if(at) mesi[k] = { giorni, at };
  });
  writeStore(MESI_KEY, { id: state.presenze.id, primo: state.presenze.primo || "", mesi });
}
function datiMese(ym){
  const id = myBadge();
  if(!state.presenze || state.presenze.id !== id) state.presenze = { id, primo: "", mesi: {} };
  if(!state.presenze.mesi[ym]) state.presenze.mesi[ym] = { giorni: {}, at: 0 };
  return state.presenze.mesi[ym];
}

async function fetchWeek(ym){
  const id = myBadge();
  const url = state.config.status_url;
  const mese = typeof ym === "string" ? ym : (state.meseSel || meseCorrente());
  if(!id || !url || !navigator.onLine) { renderWeekStato(); return; }
  if(state.meseLoading.has(mese)) return;
  state.meseLoading.add(mese);
  renderWeekStato();
  const dati = datiMese(mese);
  const leggi = async () => {
    const ctrl = ("AbortController" in window) ? new AbortController() : null;
    const t = ctrl ? setTimeout(() => ctrl.abort(), WEEK_TIMEOUT_MS) : null;
    try {
      const sep = url.includes("?") ? "&" : "?";
      const res = await fetch(`${url}${sep}id=${encodeURIComponent(id)}&mese=${mese}`, { cache: "no-store", signal: ctrl?.signal });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally { if(t) clearTimeout(t); }
  };
  try {
    let data;
    try { data = await leggi(); }
    catch(e) { if(!navigator.onLine) throw e; data = await leggi(); }   // secondo tentativo
    // Script non aggiornato alla v5: niente "mese" nella risposta
    if(!data || !data.giorni || typeof data.giorni !== "object" || data.mese !== mese) throw new Error("script");
    const giorni = {};
    Object.keys(data.giorni).forEach(k => {
      const [d, m, y] = k.split("/");
      if(!(d && m && y)) return;
      const g = data.giorni[k] || {};
      giorni[`${y}-${pad(+m)}-${pad(+d)}`] = {
        events: (Array.isArray(g.events) ? g.events : [])
          .map(e => ({ tipo: String(e.tipo || "").toLowerCase(), ora: String(e.ora || "").slice(0, 5) }))
          .filter(e => (e.tipo === "entrata" || e.tipo === "uscita") && /^\d{2}:\d{2}$/.test(e.ora)),
        assenze: (Array.isArray(g.assenze) ? g.assenze : [])
          .map(a => ({ tipo: String(a.tipo || ""), intera: a.intera !== false, ore: Number(a.ore) || 0 }))
          .filter(a => a.tipo),
        straordinario: Math.max(0, Math.round(Number(g.straordinario) || 0)),
        straordinarioGiornata: g.straordinarioGiornata === true
      };
    });
    dati.giorni = giorni;
    dati.at = Date.now();
    // Primo giorno del 2026 nel registro (script v6); "" se non ce ne sono
    if(typeof data.primo === "string"){
      const [pd, pm, py] = data.primo.split("/");
      state.presenze.primo = (pd && pm && py) ? `${py}-${pad(+pm)}-${pad(+pd)}` : "";
    }
    dati.errore = false; dati.motivo = "";
    saveMesiCache();
  } catch(e) {
    dati.errore = true;
    dati.motivo = e && e.name === "AbortError" ? "tempo scaduto"
      : e && e.name === "SyntaxError" ? "risposta non valida"
      : e && e.message === "script" ? "script da aggiornare"
      : e && /^HTTP/.test(e.message || "") ? e.message
      : "errore di rete";
  } finally {
    state.meseLoading.delete(mese);
    if(state.panel === "week") renderWeek();
  }
}

/* Giorno: dati del registro (da qualunque mese letto che lo contenga,
   il più recente) più le timbrature di questo telefono non ancora lì */
function giornoInfo(iso, id){
  let remoto = null, at = 0;
  if(state.presenze && state.presenze.id === id){
    Object.values(state.presenze.mesi).forEach(m => {
      if(m.giorni && m.giorni[iso] && m.at > at){ remoto = m.giorni[iso]; at = m.at; }
    });
  }
  const rEv = remoto ? remoto.events : [];
  const locali = loadHist()
    .filter(e => e.employee_id === id && e.data === iso)
    .filter(e => localeValida(e, remoto ? at : 0))
    .filter(e => !rEv.some(r => r.tipo === e.tipo && r.ora === e.ora))
    .map(e => ({ tipo: e.tipo, ora: e.ora, created: e.created || 0 }));
  const events = rEv.map(e => ({ ...e, created: 0 })).concat(locali)
    .sort((a, b) => a.ora.localeCompare(b.ora) || a.created - b.created);
  return {
    events,
    assenze: remoto ? remoto.assenze : [],
    straordinario: remoto ? remoto.straordinario : 0,
    straordinarioGiornata: !!(remoto && remoto.straordinarioGiornata)
  };
}
function fmtOreStr(min){
  const h = Math.floor(min / 60), m = min % 60;
  return h ? (m ? `${h} h ${pad(m)} min` : `${h} h`) : `${m} min`;
}
function assenzaTesto(a){
  if(a.intera || !a.ore) return a.tipo;
  const ore = String(Math.round(a.ore * 10) / 10).replace(".", ",");
  return `${a.tipo} ${ore} h`;
}
function etichettaSettimana(lun){
  const ven = new Date(lun); ven.setDate(lun.getDate() + 4);
  return lun.getMonth() === ven.getMonth()
    ? `${lun.getDate()} – ${ven.getDate()} ${MESI[ven.getMonth()]}`
    : `${lun.getDate()} ${MESI[lun.getMonth()]} – ${ven.getDate()} ${MESI[ven.getMonth()]}`;
}

function renderWeekStato(){
  const el = $("#week-stato");
  if(!el) return;
  el.classList.toggle("week-stato--warn", false);
  const mese = state.meseSel || meseCorrente();
  const dati = state.presenze && state.presenze.id === myBadge() ? state.presenze.mesi[mese] : null;
  const hm = dati && dati.at ? toHM(new Date(dati.at)) : "";
  if(state.meseLoading.has(mese)){ el.textContent = "Aggiornamento dal registro…"; return; }
  if(!navigator.onLine){ el.textContent = hm ? `Offline · dati delle ${hm}` : "Offline"; return; }
  if(dati && dati.errore){
    el.classList.add("week-stato--warn");
    const m = dati.motivo ? ` (${dati.motivo})` : "";
    el.textContent = hm ? `Aggiornamento non riuscito${m} · dati delle ${hm} ` : `Registro non raggiungibile${m} `;
    const b = document.createElement("button");
    b.type = "button"; b.className = "link-inline"; b.textContent = "Riprova";
    b.addEventListener("click", () => fetchWeek(mese));
    el.appendChild(b);
    return;
  }
  el.textContent = hm ? `Aggiornato alle ${hm}` : "";
}

/* Settimane (lunedì) che toccano il mese, fino a quella in corso */
function settimaneDelMese(ym){
  const [y, m] = ym.split("-").map(Number);
  const primo = new Date(y, m - 1, 1, 12), ultimo = new Date(y, m, 0, 12);
  const oggiLun = lunedi(new Date());
  const out = [];
  for(let l = lunedi(primo); l <= ultimo && l <= oggiLun; l = new Date(l.getFullYear(), l.getMonth(), l.getDate() + 7, 12)){
    out.push(l);
  }
  return out;
}

function renderWeek(){
  const box = $("#week-days");
  if(!box) return;
  const id = myBadge();
  const emp = empById(id);
  $("#week-empty").hidden = !!emp;
  $("#week-body").hidden = !emp;
  renderWeekPending();
  if(!state.meseSel) state.meseSel = meseCorrente();
  renderWeekStato();
  if(!emp) return;
  $("#week-nome").textContent = emp.nome;

  const mese = state.meseSel;
  const [y, m] = mese.split("-").map(Number);
  $("#week-label").textContent = `${MESI_LUNGHI[m - 1]} ${y}`;
  $("#week-prev").disabled = mese <= meseMinimo();
  $("#week-next").disabled = mese >= meseCorrente();

  // Selettore della settimana
  const oggi = todayISO();
  const lunOggi = toISODate(lunedi(new Date()));
  const settimane = settimaneDelMese(mese);
  if(state.settSel === "corrente"){
    state.settSel = settimane.some(l => toISODate(l) === lunOggi) ? lunOggi : "tutto";
  }
  if(state.settSel !== "tutto" && !settimane.some(l => toISODate(l) === state.settSel)) state.settSel = "tutto";
  const chips = $("#week-chips");
  const cf = document.createDocumentFragment();
  const chip = (key, testo) => {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.sett = key; b.textContent = testo;
    b.setAttribute("aria-pressed", String(state.settSel === key));
    cf.appendChild(b);
  };
  // "Tutto il mese" per primo, poi le settimane dalla più recente
  chip("tutto", "Tutto il mese");
  settimane.slice().reverse().forEach(l => { const k = toISODate(l); chip(k, k === lunOggi ? "Questa settimana" : etichettaSettimana(l)); });
  chips.replaceChildren(cf);
  const attivo = chips.querySelector('[aria-pressed="true"]');
  if(attivo){
    const sx = attivo.offsetLeft - chips.offsetLeft, dx = sx + attivo.offsetWidth;
    if(sx < chips.scrollLeft || dx > chips.scrollLeft + chips.clientWidth) chips.scrollLeft = Math.max(0, sx - 8);
  }

  // Giorni da mostrare, raggruppati per settimana (la più recente in cima)
  const adesso = toHM(new Date());
  const gruppi = [];
  const scelte = state.settSel === "tutto" ? settimane.slice().reverse() : settimane.filter(l => toISODate(l) === state.settSel);
  scelte.forEach(l => {
    const giorni = [];
    for(let i = 0; i < 7; i++){
      const d = new Date(l.getFullYear(), l.getMonth(), l.getDate() + i, 12);
      const iso = toISODate(d);
      // In "Tutto il mese" solo i giorni del mese; la settimana singola è intera
      if(state.settSel === "tutto" && iso.slice(0, 7) !== mese) continue;
      const primo = primoGiornoRegistro();
      if(primo && iso < primo) continue;
      const info = giornoInfo(iso, id);
      // Sabato e domenica solo con timbrature o straordinari (le ferie "DAL-AL" coprono anche il weekend)
      if(i >= 5 && !info.events.length && !info.straordinario && !info.straordinarioGiornata) continue;
      const g = turniDa(info.events);
      const live = (iso === oggi && g.aperto) ? { da: g.aperto, a: adesso > g.aperto ? adesso : g.aperto } : null;
      giorni.push({ d, iso, info, g, live, futuro: iso > oggi, oggi: iso === oggi });
    }
    if(giorni.length) gruppi.push({ l, giorni });
  });

  // v2.7.0: ogni barra sulla scala del suo giorno, sempre piena agli estremi

  const el = (tag, cls, txt) => { const e = document.createElement(tag); if(cls) e.className = cls; if(txt != null) e.textContent = txt; return e; };
  const giornoEl = x => {
    const li = el("li", "day" + (x.oggi ? " day--oggi" : "") + (x.futuro ? " day--futuro" : ""));
    const top = el("div", "day-top");
    const nome = el("span", "day-nome", GIORNI[x.d.getDay()]);
    nome.appendChild(el("small", null, `${pad(x.d.getDate())}/${pad(x.d.getMonth() + 1)}`));
    const dur = el("span", "day-dur");
    top.append(nome, dur);
    li.appendChild(top);

    if(x.g.turni.length) dur.textContent = fmtDurata(x.g.totale);
    else if(x.live){ dur.textContent = "in corso"; dur.classList.add("day-dur--live"); }
    else if(!x.info.assenze.length && !x.g.aperto && !x.g.orfane.length) dur.textContent = "—";

    // Orari in ordine: tratti completi, uscite senza entrata, entrata aperta
    const voci = x.g.turni.map(t => ({ ora: t.da, testo: `${t.da} – ${t.a}` }))
      .concat(x.g.orfane.map(u => ({ ora: u, testo: `uscita ${u}` })));
    if(x.live) voci.push({ ora: x.live.da, testo: `in studio dalle ${x.live.da}` });
    else if(x.g.aperto) voci.push({ ora: x.g.aperto, testo: `entrata ${x.g.aperto}` });
    voci.sort((a, b) => a.ora.localeCompare(b.ora));
    if(voci.length) li.appendChild(el("div", "day-orari", voci.map(v => v.testo).join(" · ")));

    if(x.g.turni.length || x.live){
      li.appendChild(barraGiornata(x.g.turni, { live: x.live }));
    }

    const tag = [];
    x.info.assenze.forEach(a => tag.push(el("span", "day-tag day-tag--assenza", assenzaTesto(a))));
    if(x.g.orfane.length) tag.push(el("span", "day-tag day-tag--warn", "Entrata non timbrata"));
    if(!x.live && x.g.aperto && !x.futuro) tag.push(el("span", "day-tag day-tag--warn", "Uscita non timbrata"));
    if(tag.length){ const w = el("div", "day-tags"); w.append(...tag); li.appendChild(w); }

    if(x.info.straordinario > 0 || x.info.straordinarioGiornata){
      const ex = el("div", "day-extra");
      const ic = el("i"); ic.innerHTML = EXTRA_ICON;
      ex.append(ic, document.createTextNode("Straordinario"),
        el("b", null, x.info.straordinario > 0 ? `+ ${fmtOreStr(x.info.straordinario)}` : "giornata intera"));
      li.appendChild(ex);
    }
    return li;
  };

  const frag = document.createDocumentFragment();
  if(!gruppi.length){
    frag.appendChild(el("p", "week-vuoto", "Nessuna presenza in questo periodo."));
  }
  gruppi.forEach(gr => {
    const sec = el("section", "sett");
    if(state.settSel === "tutto"){
      const h = el("div", "sett-h");
      h.append(el("span", null, toISODate(gr.l) === lunOggi ? "Questa settimana" : "Settimana"), el("span", null, etichettaSettimana(gr.l)));
      sec.appendChild(h);
    }
    const ul = el("ul", "days");
    gr.giorni.forEach(x => ul.appendChild(giornoEl(x)));
    sec.appendChild(ul);
    frag.appendChild(sec);
  });
  box.replaceChildren(frag);
}

function cambiaMese(n){
  const nuovo = meseSposta(state.meseSel || meseCorrente(), n);
  if(nuovo < meseMinimo() || nuovo > meseCorrente()) return;
  state.meseSel = nuovo;
  state.settSel = nuovo === meseCorrente() ? "corrente" : "tutto";
  renderWeek();
  const dati = state.presenze && state.presenze.id === myBadge() ? state.presenze.mesi[nuovo] : null;
  // Mesi chiusi già letti: non serve rileggerli
  const [ny, nm] = nuovo.split("-").map(Number);
  const chiuso = dati && !dati.errore && dati.at > new Date(ny, nm, 1).getTime();
  if(!chiuso) fetchWeek(nuovo);
  try { $("#panel-week").scrollIntoView({ block: "start" }); } catch(e) {}
}

/* Timbrature di questo telefono non ancora arrivate al registro */
function renderWeekPending(){
  const box = $("#week-pending");
  const list = $("#week-pending-list");
  if(!box || !list) return;
  const q = loadQueue();
  box.hidden = !q.length;
  if(!q.length){ list.replaceChildren(); return; }
  const frag = document.createDocumentFragment();
  q.slice().sort((a, b) => (a.payload.data + a.payload.ora).localeCompare(b.payload.data + b.payload.ora)).forEach(item => {
    const pl = item.payload;
    const held = (item.attempts || 0) >= MAX_AUTO_ATTEMPTS;
    const li = document.createElement("li");
    li.className = "history-item";
    const text = document.createElement("span");
    text.className = "history-text";
    const time = document.createElement("span");
    time.className = "history-time";
    time.textContent = pl.data === todayISO() ? pl.ora : `${formatDay(pl.data)} ${pl.ora}`;
    text.append(time, document.createTextNode(`${pl.nome} · ${tipoLabel(pl.tipo)}${pl.metodo === "manuale" ? " (manuale)" : ""}`));
    const side = document.createElement("span");
    side.className = "history-side";
    if(held){
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = "Riprova";
      b.dataset.retry = pl.request_id;
      side.appendChild(b);
    }
    const badge = document.createElement("span");
    badge.className = `history-status history-status--${held ? "held" : "queued"}`;
    badge.textContent = held ? "Da riprovare" : "In attesa";
    side.appendChild(badge);
    li.append(text, side);
    frag.appendChild(li);
  });
  list.replaceChildren(frag);
}

/* ---------- Inserimento manuale ---------- */
function initManual(){
  const sel = $("#m-employee");
  const frag = document.createDocumentFragment();
  state.employees.forEach(emp => {
    const o = document.createElement("option");
    o.value = emp.id;
    o.textContent = emp.nome;
    frag.appendChild(o);
  });
  sel.appendChild(frag);

  const form = $("#manual-form");
  form.addEventListener("submit", onManualSubmit);
  form.addEventListener("input", onManualLive, { passive: true });
  form.addEventListener("change", onManualLive, { passive: true });

  $("#btn-today").addEventListener("click", () => { $("#m-date").value = todayISO(); onManualLive(); });
  $("#btn-yesterday").addEventListener("click", () => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    $("#m-date").value = toISODate(d); onManualLive();
  });
  $("#btn-now").addEventListener("click", () => {
    $("#m-date").value = todayISO(); $("#m-time").value = toHM(new Date()); onManualLive();
  });
  $("#btn-manual-reset").addEventListener("click", () => resetManual(true));
}

function prepareManual(){
  const d = $("#m-date"), t = $("#m-time");
  if(!d.value) d.value = todayISO();
  if(!t.value) t.value = toHM(new Date());
  const max = todayISO();
  const min = new Date(); min.setDate(min.getDate() - MANUAL_WINDOW_DAYS);
  d.max = max; d.min = toISODate(min);
  onManualLive();
}

function manualValues(){
  return {
    empId: $("#m-employee").value,
    tipo: document.querySelector('input[name="m-type"]:checked')?.value || "",
    data: $("#m-date").value,
    ora: $("#m-time").value,
    note: $("#m-notes").value.trim()
  };
}

function onManualLive(){
  document.querySelectorAll("#manual-form .invalid").forEach(el => el.classList.remove("invalid"));
  $(".seg")?.classList.remove("invalid-group");
  const v = manualValues();
  const emp = empById(v.empId);
  const box = $("#m-summary");
  if(emp && v.tipo && v.data && v.ora){
    box.hidden = false;
    box.textContent = `Stai per inviare: ${emp.nome} · ${tipoLabel(v.tipo)} · ${formatDay(v.data)} ore ${v.ora}`;
  } else {
    box.hidden = true;
  }
}

function validateManual(v){
  if(!v.empId) return ["#m-employee", "Scegli il tuo nome."];
  if(!v.tipo) return [".seg", "Scegli Entrata o Uscita."];
  if(!v.data) return ["#m-date", "Indica la data."];
  if(!v.ora) return ["#m-time", "Indica l'ora."];
  const today = todayISO();
  if(v.data > today) return ["#m-date", "La data non può essere futura."];
  const min = new Date(); min.setDate(min.getDate() - MANUAL_WINDOW_DAYS);
  if(v.data < toISODate(min)) return ["#m-date", `Si possono inserire timbrature degli ultimi ${MANUAL_WINDOW_DAYS} giorni. Controlla la data.`];
  if(v.data === today){
    const now = new Date();
    const [h, m] = v.ora.split(":").map(Number);
    if(h * 60 + m > now.getHours() * 60 + now.getMinutes() + 5) return ["#m-time", "L'ora non può essere futura."];
  }
  return null;
}

async function onManualSubmit(ev){
  ev.preventDefault();
  const msg = $("#manual-msg");
  const v = manualValues();
  const err = validateManual(v);
  if(err){
    const [sel, text] = err;
    const el = $(sel);
    if(sel === ".seg") el.classList.add("invalid-group"); else el.classList.add("invalid");
    msg.textContent = text;
    toast(text, "warn");
    try { (sel === ".seg" ? $("#m-type-entrata") : el).focus({ preventScroll: false }); } catch(e) {}
    return;
  }

  const emp = empById(v.empId);
  const btn = $("#btn-manual-submit");
  btn.disabled = true; btn.classList.add("loading");
  msg.textContent = "Invio in corso…";

  const payload = buildPayload({
    emp, tipo: v.tipo, when: new Date(`${v.data}T${v.ora}:00`),
    data: v.data, ora: v.ora, metodo: "manuale", note: v.note
  });
  const res = await submitEvent(payload);

  btn.disabled = false; btn.classList.remove("loading");
  const recap = `${emp.nome} · ${tipoLabel(v.tipo)} · ${formatDay(v.data)} ore ${v.ora}`;
  if(res === "sent"){
    msg.textContent = `Inviata: ${recap}`;
    toast(`Timbratura inviata — ${recap}`, "ok");
  } else {
    msg.textContent = `In attesa di invio: ${recap}`;
    toast("Nessuna rete: la timbratura è salvata e parte da sola appena torni online.", "warn");
  }
  resetManual(false);
}

function resetManual(showToast){
  $("#manual-form").reset();
  $("#m-date").value = todayISO();
  $("#m-time").value = toHM(new Date());
  onManualLive();
  if(showToast){ $("#manual-msg").textContent = ""; toast("Campi puliti.", "warn"); }
}

/* ---------- Badge ---------- */
function renderBadges(){
  const grid = $("#badge-grid");
  const codes = window.CAI_BADGES || {};
  const frag = document.createDocumentFragment();
  state.employees.forEach(emp => {
    const card = document.createElement("div");
    card.className = "badge-card";
    const src = codes[emp.id];
    if(src){
      const img = document.createElement("img");
      img.src = src; img.alt = `QR badge ${emp.nome}`; img.width = 140; img.height = 140;
      card.appendChild(img);
    }
    const n = document.createElement("p"); n.className = "badge-name"; n.textContent = emp.nome;
    const i = document.createElement("p"); i.className = "badge-id"; i.textContent = src ? emp.id : `${emp.id} — QR non disponibile`;
    card.append(n, i);
    if(src){
      const a = document.createElement("a");
      a.className = "chip";
      a.href = src;
      a.download = `badge-${emp.nome.replace(/\s+/g, "_")}.png`;
      a.textContent = "Scarica PNG";
      a.style.textDecoration = "none";
      card.appendChild(a);
    }
    frag.appendChild(card);
  });
  grid.replaceChildren(frag);
}

/* ---------- Aggiornamento automatico (v2.4.2) ----------
   Su iPhone l'app installata resta in memoria e non ricarica i file:
   al ritorno in primo piano (al massimo una volta ogni 10 minuti) si
   legge la versione pubblicata e, se è diversa, si ricarica la pagina.
   Mai durante la scelta Entrata/Uscita o la schermata di esito. */
let ultimoControlloVersione = 0;
async function controllaVersione(){
  if(!navigator.onLine || Date.now() - ultimoControlloVersione < 10 * 60 * 1000) return;
  ultimoControlloVersione = Date.now();
  try {
    const res = await fetch(`./app.js?v=${Date.now()}`, { cache: "no-store" });
    if(!res.ok) return;
    const testo = await res.text();
    const m = testo.match(/const APP_VERSION = "([^"]+)"/);
    if(m && m[1] !== APP_VERSION && state.mode === "scan" && !loadQueue().some(i => state.inFlight.has(i.payload.request_id))){
      location.reload();
    }
  } catch(e) {}
}

/* ---------- Schermo acceso e visibilità ---------- */
async function requestWakeLock(){
  try {
    if("wakeLock" in navigator && !document.hidden){
      state.wakeLock = await navigator.wakeLock.request("screen");
      state.wakeLock.addEventListener?.("release", () => { state.wakeLock = null; });
    }
  } catch(e) { state.wakeLock = null; }
}

/* Schermo spento o app in background con la scelta Entrata/Uscita aperta:
   si registra il tipo proposto (v2.4.0). submitEvent salva subito in coda
   e l'invio keepalive prosegue anche a pagina nascosta. */
function registraSeInSospeso(){
  if(state.mode === "read" && state.read) confirmRead();
}
function onVisibility(){
  if(document.hidden){
    registraSeInSospeso();
    stopCamera();           // niente fotocamera accesa in background
  } else {
    requestWakeLock();
    controllaVersione();
    renderWho();            // a cambio giorno l'elenco si azzera
    fetchStatus();
    flushQueue();
    if(state.panel === "main") backToScan();
    if(state.panel === "week"){ renderWeek(); fetchWeek(state.meseSel); }
  }
}

/* ---------- Avvio ---------- */
function wireEvents(){
  document.addEventListener("click", ev => {
    const p = ev.target.closest("[data-panel]");
    if(p){ switchPanel(p.dataset.panel); return; }
    const r = ev.target.closest("[data-retry]");
    if(r){ retryHeld(r.dataset.retry); }
  });
  $("#btn-entrata").addEventListener("click", () => chooseTipo("entrata"));
  $("#btn-uscita").addEventListener("click", () => chooseTipo("uscita"));
  $("#btn-annulla").addEventListener("click", cancelRead);
  $("#week-prev").addEventListener("click", () => cambiaMese(-1));
  $("#week-next").addEventListener("click", () => cambiaMese(1));
  $("#week-chips").addEventListener("click", ev => {
    const b = ev.target.closest("[data-sett]");
    if(!b) return;
    state.settSel = b.dataset.sett;
    renderWeek();
  });
  $("#btn-camera").addEventListener("click", startCamera);
  $("#done-card").addEventListener("click", backToScan);
  document.addEventListener("visibilitychange", onVisibility);
  // iOS: pagehide arriva anche quando visibilitychange non fa in tempo
  window.addEventListener("pagehide", registraSeInSospeso);
}

function setFooter(){
  const y = $("#year"); if(y) y.textContent = new Date().getFullYear();
  const v = $("#version-badge"); if(v) v.textContent = `v${APP_VERSION} — ultimo aggiornamento ${LAST_UPDATE}`;
}

function mostraApp(){ document.documentElement.classList.add("app-pronta"); }

(async function main(){
  loadFonts();
  setFooter();
  attachNetStatus();
  wireEvents();
  try {
    await loadData();
    loadRemoteCache();
    renderWho();
    initManual();
    renderBadges();
    renderQueuePill();
    loadMesiCache();
    try { localStorage.removeItem("cai_studio_settimana_v1"); } catch(e) {}   // cache della 2.4
  } finally {
    mostraApp();
  }
  fetchStatus();
  // Riepilogo settimanale letto in anticipo, in background: quando lo si
  // apre i dati ci sono già (la prima lettura del registro è lenta)
  setTimeout(() => { if(myBadge()) fetchWeek(meseCorrente()); }, 3000);
  await setupDetector();
  startCamera();
  requestWakeLock();
  flushQueue();
  setInterval(() => { if(loadQueue().length) flushQueue(); }, 60000);
  // Stato condiviso: solo con l'app in primo piano, niente letture a vuoto
  setInterval(() => { if(!document.hidden) fetchStatus(); }, STATUS_EVERY_MS);
})();
