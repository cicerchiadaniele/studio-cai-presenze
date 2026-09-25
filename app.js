/* Studio CAI — Presenze studio v2.0.0
   Postazione di timbratura con badge QR, allineata a Portieri 2.0.

   COSA CAMBIA RISPETTO ALLA 1.1.0
   - Fotocamera sempre accesa: si avvicina il badge e basta.
   - Tipo (Entrata/Uscita) proposto in automatico dall'ultimo passaggio
     del giorno e registrato da solo dopo 4 secondi, salvo cambio o Annulla.
   - "In studio adesso": chi è dentro, da che ora, chi è uscito.
   - Coda di invio: senza rete la timbratura non si perde, parte da sola
     al ritorno della connessione (3 tentativi automatici, poi "Riprova").
   - Codice univoco (request_id) per ogni timbratura.
   - Stesso badge letto di nuovo entro 2 minuti: ignorato.
   - Inserimento manuale con motivo obbligatorio.
   - Schermo sempre acceso sulla postazione (Wake Lock, dove supportato).

   COMPATIBILITÀ CON LO SCENARIO MAKE
   Il payload conserva tutti i campi della 1.1.0 (source, version,
   employee_id, nome, tipo, data, ora, metodo, note, sent_at) con gli
   stessi valori: lo scenario "WebApp Dipendenti CAI" continua a
   funzionare senza modifiche. Si aggiunge solo request_id.
   sent_at è l'istante della timbratura, non dell'invio: una timbratura
   rimasta in coda arriva comunque con la sua data. */

const APP_VERSION = "2.0.0";
const LAST_UPDATE = "2026-09-23";
const CONFIG_DEFAULT = {
  webhook_url: "https://hook.eu1.make.com/wgbye8bprwfsxze34wuydvxckplijn1z"
};
const EMPLOYEES_DEFAULT = [
  { id: "STF001", nome: "Simone Pomponi" },
  { id: "STF002", nome: "Marco Reali" },
  { id: "STF003", nome: "Paolo Morabito" }
];

const QR_PREFIX = "CAI-BADGE:";
const QUEUE_KEY = "cai_studio_queue_v1";
const DAY_KEY = "cai_studio_oggi_v1";
const COUNTDOWN_S = 4;              // secondi prima della registrazione automatica
const COOLDOWN_MS = 2 * 60 * 1000;  // stesso badge entro 2 minuti: ignorato
const DONE_MS = 3000;               // durata della schermata di esito
const SCAN_EVERY_MS = 160;          // cadenza di analisi dei fotogrammi
const MAX_AUTO_ATTEMPTS = 3;
const MANUAL_WINDOW_DAYS = 31;
const POST_TIMEOUT_MS = 10000;

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
  countdown: null,
  countLeft: COUNTDOWN_S,
  doneTimer: null,
  wakeLock: null,
  flushing: false
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
}
function setEventStatus(requestId, status){
  const day = loadDay();
  const ev = day.events.find(e => e.request_id === requestId);
  if(ev){ ev.status = status; saveDay(day); }
}
/* Timbrature con data di oggi di un collega, in ordine di orario */
function todayEventsOf(empId){
  const today = todayISO();
  return loadDay().events
    .filter(e => e.employee_id === empId && e.data === today)
    .sort((a, b) => a.ora.localeCompare(b.ora) || a.created - b.created);
}
function presenceOf(empId){
  const evs = todayEventsOf(empId);
  const last = evs[evs.length - 1];
  if(!last) return { stato: "none", ora: "" };
  return { stato: last.tipo === "entrata" ? "in" : "out", ora: last.ora };
}
function suggestTipo(empId){
  return presenceOf(empId).stato === "in" ? "uscita" : "entrata";
}
function lastScanOf(empId){
  const evs = loadDay().events.filter(e => e.employee_id === empId && e.metodo === "qr");
  return evs.length ? evs[evs.length - 1] : null;
}

/* ---------- In studio adesso ---------- */
function renderWho(){
  const list = $("#who-list");
  if(!list) return;
  const frag = document.createDocumentFragment();
  state.employees.forEach(emp => {
    const p = presenceOf(emp.id);
    const li = document.createElement("li");
    li.className = "who-item";
    const name = document.createElement("span");
    name.className = "who-name";
    name.textContent = emp.nome;
    const st = document.createElement("span");
    st.className = `stato stato--${p.stato}`;
    st.textContent = p.stato === "in" ? `In studio dalle ${p.ora}`
      : p.stato === "out" ? `Uscito alle ${p.ora}` : "Non ancora arrivato";
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
  window.addEventListener("online", () => { update(); flushQueue(); });
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

async function postJSON(url, payload){
  const ctrl = ("AbortController" in window) ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), POST_TIMEOUT_MS) : null;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
      signal: ctrl?.signal
    });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } finally { if(t) clearTimeout(t); }
}

/* I tentativi automatici sono limitati: se il webhook riceve ma la
   risposta non torna, un ritentativo perpetuo creerebbe doppioni. */
async function flushQueue(){
  if(state.flushing || !navigator.onLine) return;
  const q = loadQueue();
  if(!q.length) return;
  state.flushing = true;
  try {
    let i = 0;
    while(i < q.length){
      const item = q[i];
      if((item.attempts || 0) >= MAX_AUTO_ATTEMPTS){ i++; continue; }
      try {
        await postJSON(state.config.webhook_url, item.payload);
        q.splice(i, 1);
        saveQueue(q);
        setEventStatus(item.payload.request_id, "sent");
      } catch(e) {
        item.attempts = (item.attempts || 0) + 1;
        if(item.attempts >= MAX_AUTO_ATTEMPTS) setEventStatus(item.payload.request_id, "held");
        saveQueue(q);
        break;
      }
    }
  } finally {
    state.flushing = false;
    renderQueuePill();
    renderHistory();
  }
}
function retryHeld(requestId){
  const q = loadQueue();
  const item = q.find(i => i.payload.request_id === requestId);
  if(!item) return;
  item.attempts = 0;
  saveQueue(q);
  setEventStatus(requestId, "queued");
  renderHistory();
  flushQueue();
}

/* Registra: salva sul dispositivo, poi invia; se non va, in coda. */
async function submitEvent(payload){
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
  renderWho();

  if(!navigator.onLine){
    enqueue(payload);
    renderHistory();
    return "queued";
  }
  try {
    await postJSON(state.config.webhook_url, payload);
    setEventStatus(payload.request_id, "sent");
    renderHistory();
    return "sent";
  } catch(e) {
    enqueue(payload);
    renderHistory();
    return "queued";
  }
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
  if(s) s.textContent = "Avvicina il badge alla fotocamera";
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
  openRead(emp);
}

/* ---------- Badge letto ---------- */
function openRead(emp){
  const at = new Date();
  const tipo = suggestTipo(emp.id);
  state.read = { emp, at, tipo };
  state.mode = "read";

  $("#read-initials").textContent = initials(emp.nome);
  $("#read-name").textContent = emp.nome;
  $("#read-time").textContent = `Badge letto alle ${toHM(at)}`;

  const p = presenceOf(emp.id);
  $("#read-reason").textContent = p.stato === "in"
    ? `Risulta in studio dalle ${p.ora}: proposta Uscita.`
    : p.stato === "out"
      ? `Uscito alle ${p.ora}: proposta Entrata (rientro).`
      : "Primo passaggio di oggi: proposta Entrata.";

  showMainCard("read");
  selectTipo(tipo, false);
  startCountdown();
  try { $("#btn-conferma").focus({ preventScroll: true }); } catch(e) {}
}

function selectTipo(tipo, restart = true){
  if(!state.read) return;
  state.read.tipo = tipo;
  const suggested = suggestTipo(state.read.emp.id);
  [["entrata", "#btn-entrata", "#hint-entrata"], ["uscita", "#btn-uscita", "#hint-uscita"]].forEach(([t, b, h]) => {
    $(b).setAttribute("aria-checked", String(t === tipo));
    $(h).textContent = t === tipo ? (t === suggested ? "proposto" : "scelto") : "tocca per scegliere";
  });
  if(restart) startCountdown();
}

function startCountdown(){
  stopCountdown();
  state.countLeft = COUNTDOWN_S;
  renderCountdown();
  state.countdown = setInterval(() => {
    state.countLeft--;
    if(state.countLeft <= 0){ stopCountdown(); confirmRead(); }
    else renderCountdown();
  }, 1000);
}
function stopCountdown(){ if(state.countdown){ clearInterval(state.countdown); state.countdown = null; } }
function renderCountdown(){
  const C = 2 * Math.PI * 16;
  const fg = $("#ring-fg");
  fg.style.strokeDasharray = String(C);
  fg.style.strokeDashoffset = String(C * (1 - state.countLeft / COUNTDOWN_S));
  $("#countdown-text").textContent = state.countLeft === 1 ? "Registro tra 1 secondo" : `Registro tra ${state.countLeft} secondi`;
}

function cancelRead(){
  stopCountdown();
  state.read = null;
  backToScan();
}

async function confirmRead(){
  stopCountdown();
  const r = state.read;
  if(!r) return;
  state.read = null;

  const payload = buildPayload({
    emp: r.emp, tipo: r.tipo, when: r.at,
    data: toISODate(r.at), ora: toHM(r.at), metodo: "qr"
  });

  showDone({ tipo: r.tipo, nome: r.emp.nome, ora: payload.ora, status: "sending" });
  const res = await submitEvent(payload);
  showDone({ tipo: r.tipo, nome: r.emp.nome, ora: payload.ora, status: res });

  clearTimeout(state.doneTimer);
  state.doneTimer = setTimeout(backToScan, res === "queued" ? DONE_MS + 1500 : DONE_MS);
}

function showDone({ tipo, nome, ora, status }){
  state.mode = "done";
  showMainCard("done");
  $("#done-title").textContent = `${tipoLabel(tipo)} registrata`;
  $("#done-sub").textContent = `${nome} · ore ${ora}`;
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
  stopCountdown();
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
  ["main", "manual", "today", "badges"].forEach(p => { $("#panel-" + p).hidden = p !== name; });
  if(name === "main"){
    backToScan();
  } else {
    stopCountdown();
    state.read = null;
    stopCamera();              // la fotocamera si spegne fuori dalla postazione
    if(name === "today") renderHistory();
    if(name === "manual") prepareManual();
  }
  try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch(e) { window.scrollTo(0, 0); }
}

/* ---------- Timbrature di oggi ---------- */
const STATUS_LABEL = { sent: "Inviata", queued: "In attesa", held: "Da riprovare" };

function renderHistory(){
  const list = $("#history-list");
  const empty = $("#history-empty");
  if(!list) return;
  const evs = loadDay().events.slice().sort((a, b) => b.created - a.created);
  empty.hidden = evs.length > 0;

  const frag = document.createDocumentFragment();
  evs.forEach(ev => {
    const li = document.createElement("li");
    li.className = "history-item";

    const text = document.createElement("span");
    text.className = "history-text";
    const time = document.createElement("span");
    time.className = "history-time";
    time.textContent = ev.ora;
    text.appendChild(time);
    let desc = `${ev.nome} · ${tipoLabel(ev.tipo)}`;
    if(ev.metodo === "manuale") desc += " (manuale)";
    if(ev.data !== todayISO()) desc += ` · ${formatDay(ev.data)}`;
    text.appendChild(document.createTextNode(desc));

    const side = document.createElement("span");
    side.className = "history-side";
    if(ev.status === "held"){
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = "Riprova";
      b.dataset.retry = ev.request_id;
      side.appendChild(b);
    }
    const badge = document.createElement("span");
    badge.className = `history-status history-status--${ev.status}`;
    badge.textContent = STATUS_LABEL[ev.status] || ev.status;
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
  if(!v.empId) return ["#m-employee", "Seleziona il collega."];
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
  if(v.note.length < 3) return ["#m-notes", "Il motivo è obbligatorio."];
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

/* ---------- Schermo acceso e visibilità ---------- */
async function requestWakeLock(){
  try {
    if("wakeLock" in navigator && !document.hidden){
      state.wakeLock = await navigator.wakeLock.request("screen");
      state.wakeLock.addEventListener?.("release", () => { state.wakeLock = null; });
    }
  } catch(e) { state.wakeLock = null; }
}

function onVisibility(){
  if(document.hidden){
    stopCountdown();
    if(state.mode === "read"){ state.read = null; state.mode = "scan"; showMainCard("scan"); }
    stopCamera();           // niente fotocamera accesa in background
  } else {
    requestWakeLock();
    renderWho();            // a cambio giorno l'elenco si azzera
    flushQueue();
    if(state.panel === "main") backToScan();
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
  $("#btn-entrata").addEventListener("click", () => selectTipo("entrata"));
  $("#btn-uscita").addEventListener("click", () => selectTipo("uscita"));
  $("#btn-annulla").addEventListener("click", cancelRead);
  $("#btn-conferma").addEventListener("click", confirmRead);
  $("#btn-camera").addEventListener("click", startCamera);
  $("#done-card").addEventListener("click", backToScan);
  document.addEventListener("visibilitychange", onVisibility);
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
    renderWho();
    initManual();
    renderBadges();
    renderQueuePill();
    renderHistory();
  } finally {
    mostraApp();
  }
  await setupDetector();
  startCamera();
  requestWakeLock();
  flushQueue();
  setInterval(() => { if(loadQueue().length) flushQueue(); }, 60000);
})();
