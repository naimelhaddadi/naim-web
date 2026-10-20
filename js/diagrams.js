/*
  Los diagramas de los dos trabajos reales (LH y la clínica) y los tres
  pequeños de las tarjetas de proyectos.

  Los grandes se montan con el scroll: cada pieza tiene un tramo [a, b]
  dentro del progreso p (0 → 1) y en ese tramo aparece. Si se sube, se
  desmonta. Los textos van en inglés y en español; se elige según el
  lang de la página.

  Todo se crea con createElementNS y textContent, sin innerHTML.
*/

const NS = "http://www.w3.org/2000/svg";

const COLOR = {
  fg: "#ecebe7",
  muted: "#9aa0a8",
  line: "rgba(255,255,255,0.26)",
  faint: "rgba(255,255,255,0.1)",
  sodium: "#f2a15a",
  signal: "#8db4ff",
  live: "#7fd6a4",
};

const clamp = (v) => Math.min(1, Math.max(0, v));
const range = (p, a, b) => clamp((p - a) / (b - a));

/* Interpola entre varios puntos: keyframes(0.5, [0, 1], [10, 20]) → 15 */
export function keyframes(p, stops, values) {
  if (p <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) return values[i - 1] + (values[i] - values[i - 1]) * ((p - stops[i - 1]) / (stops[i] - stops[i - 1] || 1));
  }
  return values[values.length - 1];
}

/* Mezcla dos colores rgba según k (0 → 1). */
function mixColor(from, to, k) {
  const parse = (c) => (c.startsWith("#") ? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)).concat(1) : c.match(/[\d.]+/g).map(Number));
  const [a, b] = [parse(from), parse(to)];
  const v = a.map((x, i) => x + (b[i] - x) * k);
  return `rgba(${Math.round(v[0])},${Math.round(v[1])},${Math.round(v[2])},${v[3].toFixed(2)})`;
}

function svgEl(name, attrs = {}, parent) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (parent) parent.append(node);
  return node;
}

function text(parent, x, y, value, attrs = {}) {
  const node = svgEl("text", { x, y, "text-anchor": "middle", "dominant-baseline": "middle", ...attrs }, parent);
  node.textContent = value;
  return node;
}

/* Un punto que recorre una línea en bucle. */
function packet(parent, points, { color = COLOR.sodium, r = 3.5, dur = 3, delay = 0 } = {}) {
  const dot = svgEl("circle", { r, fill: color, class: "d-packet" }, parent);
  const path = points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  svgEl("animateMotion", { path, dur: `${dur}s`, begin: `${delay}s`, repeatCount: "indefinite" }, dot);
  return dot;
}

/*
  Las piezas de un diagrama grande. Cada una guarda una función que
  recibe p y se coloca; update(p) las llama todas.
*/
function kit(svg, inform) {
  const parts = [];
  const value = (v, p) => (typeof v === "function" ? v(p) : v);

  const defs = svgEl("defs", {}, svg);
  const marker = svgEl("marker", { id: `arrow-${svg.dataset.diagram}`, viewBox: "0 0 8 8", refX: 7, refY: 4, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
  svgEl("path", { d: "M0 0.5 L7.5 4 L0 7.5", fill: "none", stroke: COLOR.line, "stroke-width": 1.2 }, marker);

  return {
    update: (p) => parts.forEach((part) => part(p)),
    add: (fn) => parts.push(fn),

    /* una caja con nombre y, si tiene info, se puede inspeccionar */
    node({ at, x, y, w, h = 36, label, sub, info, stroke = COLOR.line, dash = "0", collapse, to = [x, y], tone = COLOR.fg }) {
      const g = svgEl("g", { class: "d-node" }, svg);
      const box = svgEl("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 4, class: "d-box" }, g);
      text(g, x, sub ? y - 4 : y + 1, label, { class: "d-label", fill: tone });
      if (sub) text(g, x, y + 10, sub, { class: "d-sub" });
      if (info) {
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        g.setAttribute("aria-label", `${label}: ${info}`);
        const show = () => Number(g.style.opacity) > 0.5 && inform(label, info);
        g.addEventListener("mouseenter", show);
        g.addEventListener("focus", show);
        g.addEventListener("mouseleave", () => inform(null));
        g.addEventListener("blur", () => inform(null));
      } else {
        g.setAttribute("aria-hidden", "true");
      }
      parts.push((p) => {
        const v = range(p, at[0], at[1]);
        const c = collapse ? collapse(p) : 0;
        const s = (0.86 + 0.14 * v) * (1 - 0.8 * c);
        const dx = (to[0] - x) * c;
        const dy = (1 - v) * 10 + (to[1] - y) * c;
        g.style.opacity = (v * (1 - c)).toFixed(3);
        g.setAttribute("transform", `translate(${x + dx} ${y + dy}) scale(${s}) translate(${-x} ${-y})`);
        box.style.stroke = value(stroke, p);
        box.style.strokeDasharray = value(dash, p);
      });
    },

    /* una línea que se dibuja sola (las discontinuas solo aparecen) */
    edge({ at, d, color = COLOR.line, dashed, arrow, width = 1, fade }) {
      const path = svgEl("path", { d, fill: "none", stroke: color, "stroke-width": width, "aria-hidden": "true" }, svg);
      if (arrow) path.setAttribute("marker-end", `url(#arrow-${svg.dataset.diagram})`);
      if (dashed) path.setAttribute("stroke-dasharray", "3 4");
      else path.setAttribute("pathLength", "1");
      parts.push((p) => {
        const v = range(p, at[0], at[1]);
        const f = fade ? fade(p) : 0;
        path.style.opacity = v > 0.001 ? (dashed ? v : 1) * (1 - f) : 0;
        if (!dashed) {
          path.style.strokeDasharray = "1 1";
          path.style.strokeDashoffset = 1 - v;
        }
      });
    },

    /* etiqueta pequeña y redondeada */
    chip({ at, x, y, w, label, tone = COLOR.fg, fade }) {
      const g = svgEl("g", { "aria-hidden": "true" }, svg);
      svgEl("rect", { x: x - w / 2, y: y - 10, width: w, height: 20, rx: 10, fill: "#13161b", stroke: "rgba(255,255,255,0.16)" }, g);
      text(g, x, y + 1, label, { class: "d-chip", fill: tone });
      parts.push((p) => {
        const v = range(p, at[0], at[1]);
        g.style.opacity = v * (1 - (fade ? fade(p) : 0));
        g.setAttribute("transform", `translate(0 ${(1 - v) * 6})`);
      });
    },

    /* puntos que circulan mientras p está dentro del tramo */
    packets(during, list) {
      const dots = list.map(([points, options]) => packet(svg, points, options));
      parts.push((p) => dots.forEach((dot) => (dot.style.display = p >= during[0] && p < during[1] ? "" : "none")));
    },
  };
}

/* ── LH Management ──────────────────────────────────────────────────────
  0.00 – 0.18  el problema: datos sueltos de jugadores
  0.16 – 0.34  el modelo: aparecen las entidades, todavía en borrador
  0.33 – 0.48  la base de datos: SQL Server alrededor y las relaciones
  0.48 – 0.58  la lógica: procedimientos y triggers
  0.60 – 0.70  la interfaz web encima
  0.72 – 0.84  funcionando: los datos se mueven
  0.84 – 1.00  todo se pliega en un punto y sale un hilo hacia abajo,
               el mismo del que nace el diagrama de la clínica
*/
const LH_TEXT = {
  en: {
    entities: {
      agent: ["Agents", "Agents representing players, linked to the player record."],
      club: ["Clubs", "Clubs, each one part of a league."],
      player: ["Players", "The centre of the model: almost every other entity connects back here."],
      league: ["Leagues", "The competitions clubs play in."],
      transfer: ["Transfers", "Movements between clubs, tied to a player and the clubs involved."],
      contract: ["Contracts", "Agreements between players and clubs, protected by constraints and triggers."],
      more: ["+ more", "More than 10 entities in total."],
    },
    fragments: ["player · notes", "club ?", "contract", "agent", "player (dup)", "transfer", "league", "stats"],
    model: "Relational model · referential integrity",
    db: ["SQL Server", "T-SQL · 10+ entities", "The relational database, designed and built from scratch by the team I led."],
    procedures: ["Procedures", "T-SQL stored procedures carry the business logic."],
    triggers: ["Triggers", "Triggers keep the data consistent and automate work that used to be manual."],
    form: ["Web form", "data entry", "The web interface, connected to the database in real time."],
    letter: "Recommendation letter ✓",
  },
  es: {
    entities: {
      agent: ["Agentes", "Los agentes que representan a los jugadores, vinculados a la ficha del jugador."],
      club: ["Clubes", "Los clubes, cada uno dentro de una liga."],
      player: ["Jugadores", "El centro del modelo: casi todas las demás entidades se conectan aquí."],
      league: ["Ligas", "Las competiciones en las que juegan los clubes."],
      transfer: ["Traspasos", "Los movimientos entre clubes, ligados a un jugador y a los clubes implicados."],
      contract: ["Contratos", "Los acuerdos entre jugadores y clubes, protegidos por restricciones y triggers."],
      more: ["+ más", "Más de 10 entidades en total."],
    },
    fragments: ["jugador · notas", "club ?", "contrato", "agente", "jugador (dup)", "traspaso", "liga", "estadísticas"],
    model: "Modelo relacional · integridad referencial",
    db: ["SQL Server", "T-SQL · 10+ entidades", "La base de datos relacional, diseñada y construida desde cero por el equipo que lideré."],
    procedures: ["Procedimientos", "Los procedimientos almacenados de T-SQL llevan la lógica de negocio."],
    triggers: ["Triggers", "Los triggers mantienen los datos coherentes y automatizan tareas que antes se hacían a mano."],
    form: ["Formulario web", "captura de datos", "La interfaz web, conectada a la base de datos en tiempo real."],
    letter: "Carta de recomendación ✓",
  },
};

const POINT = [280, 440];
const ENTITIES = [
  ["agent", 110, 232],
  ["club", 450, 232],
  ["player", 280, 300],
  ["league", 466, 330],
  ["transfer", 110, 372],
  ["contract", 360, 384],
  ["more", 230, 398],
];
const RELATIONS = [["player", "agent"], ["player", "club"], ["club", "league"], ["player", "contract"], ["contract", "club"], ["transfer", "player"]];
const FRAGMENTS = [[130, 200, -8], [330, 170, 6], [450, 250, -4], [190, 300, 10], [390, 340, -10], [120, 390, 4], [470, 400, 7], [290, 250, -3]];

function drawLh(k, svg, t) {
  const fold = (p) => range(p, 0.84, 0.96);
  const entity = (p) => mixColor(COLOR.line, COLOR.signal, range(p, 0.7, 0.74));
  const accent = (p) => mixColor(COLOR.line, COLOR.sodium, range(p, 0.7, 0.74));
  const draft = (p) => (p < 0.4 ? "4 4" : "0");
  const common = { collapse: fold, to: POINT };

  // los fragmentos del principio: aparecen, se acercan al centro y se van
  FRAGMENTS.forEach(([x, y, turn], i) => {
    const g = svgEl("g", { "aria-hidden": "true" }, svg);
    const inner = svgEl("g", { transform: `rotate(${turn} ${x} ${y})` }, g);
    svgEl("rect", { x: x - 42, y: y - 11, width: 84, height: 22, rx: 3, fill: "#0e1014", stroke: "rgba(255,255,255,0.14)", "stroke-dasharray": "3 3" }, inner);
    text(inner, x, y + 1, t.fragments[i], { class: "d-chip", fill: "#7a8089" });
    k.add((p) => {
      const drift = range(p, 0.12, 0.18) * 0.4;
      g.style.opacity = keyframes(p, [0, 0.03 + i * 0.006, 0.13, 0.18], [0, 1, 1, 0]);
      g.setAttribute("transform", `translate(${(280 - x) * drift} ${(300 - y) * drift})`);
    });
  });

  // el borde de la base de datos
  const boundary = svgEl("rect", { x: 24, y: 168, width: 512, height: 258, rx: 6, fill: "none", stroke: COLOR.faint, "stroke-dasharray": "4 5" }, svg);
  const caption = text(svg, 40, 190, t.model, { class: "d-caption", "text-anchor": "start", "dominant-baseline": "auto" });
  k.add((p) => {
    const v = range(p, 0.33, 0.38) * (1 - fold(p));
    boundary.style.opacity = v;
    caption.style.opacity = v;
  });

  const where = Object.fromEntries(ENTITIES.map(([id, x, y]) => [id, [x, y]]));
  RELATIONS.forEach(([a, b], i) => {
    k.edge({ at: [0.37 + i * 0.015, 0.46 + i * 0.015], d: `M${where[a][0]} ${where[a][1]} L${where[b][0]} ${where[b][1]}`, fade: fold });
  });

  ENTITIES.forEach(([id, x, y], i) => {
    const [label, info] = t.entities[id];
    const more = id === "more";
    k.node({
      ...common,
      at: [0.16 + i * 0.022, 0.24 + i * 0.022],
      x, y, w: 96, h: 32, label, info,
      dash: more ? "4 4" : draft,
      stroke: id === "player" ? accent : more ? COLOR.faint : entity,
      tone: more ? COLOR.muted : COLOR.fg,
    });
  });

  k.edge({ at: [0.36, 0.42], d: "M280 138 V166", arrow: true, fade: fold });
  k.node({ ...common, at: [0.33, 0.39], x: 280, y: 118, w: 160, h: 40, label: t.db[0], sub: t.db[1], info: t.db[2], stroke: accent });

  k.edge({ at: [0.5, 0.56], d: "M156 118 H200", dashed: true, fade: fold });
  k.edge({ at: [0.52, 0.58], d: "M404 118 H360", dashed: true, fade: fold });
  k.node({ ...common, at: [0.48, 0.54], x: 104, y: 118, w: 116, h: 30, label: t.procedures[0], info: t.procedures[1] });
  k.node({ ...common, at: [0.5, 0.56], x: 452, y: 118, w: 96, h: 30, label: t.triggers[0], info: t.triggers[1] });

  k.edge({ at: [0.63, 0.7], d: "M280 61 V96", arrow: true, fade: fold });
  k.node({ ...common, at: [0.6, 0.66], x: 280, y: 42, w: 140, h: 38, label: t.form[0], sub: t.form[1], info: t.form[2] });

  k.chip({ at: [0.76, 0.8], x: 452, y: 42, w: 180, label: t.letter, tone: COLOR.live, fade: fold });
  k.packets([0.72, 0.86], [
    [[[280, 61], [280, 98], [280, 138], [280, 168], [280, 284]], { dur: 2.4 }],
    [[[280, 300], [450, 232], [466, 330]], { color: COLOR.signal, r: 2.5, dur: 2, delay: 1.2 }],
    [[[280, 300], [360, 384]], { color: COLOR.signal, r: 2.5, dur: 1.2, delay: 1.8 }],
  ]);

  // el pliegue: un punto y el hilo hacia el siguiente proyecto
  const dot = svgEl("circle", { cx: POINT[0], cy: POINT[1], r: 3.5, fill: COLOR.sodium }, svg);
  k.add((p) => (dot.style.opacity = range(p, 0.9, 0.94)));
  k.edge({ at: [0.93, 1], d: `M${POINT[0]} ${POINT[1]} V 460`, color: COLOR.sodium, width: 1.25 });
}

/* ── Clínica dental ─────────────────────────────────────────────────────
  0.00 – 0.06  llega el hilo del proyecto anterior
  0.04 – 0.12  primero, la web de la clínica
  0.12 – 0.32  el proceso manual: un mensaje por paciente, a mano
  0.30 – 0.46  cita → webhook → n8n, dentro del VPS
  0.48 – 0.72  el LLM, WhatsApp y el paciente
  0.72 – 1.00  vuelven las respuestas; el flujo está terminado y probado
*/
const DENTAL_TEXT = {
  en: {
    website: ["Clinic website", "HTML5 · CSS3", "The website of a newly opened private dental clinic."],
    byHand: ["By hand", "one message each", "Confirmations and reminders, one patient at a time."],
    confirm: "Confirm your visit?",
    reminder: "Reminder: tomorrow…",
    vps: "Linux VPS · administered by me",
    appointment: ["Appointment", "booked", "An appointment is what starts the conversation."],
    webhook: ["Webhook", "event in", "Webhooks bring appointment events into the workflows."],
    n8n: ["n8n", "workflows", "The n8n workflows handle appointments, confirmations and reminders."],
    llm: ["LLM", "integration", "An LLM integrated into the conversation."],
    whatsapp: ["WhatsApp Business API", "messages", "Messages are sent and received through the WhatsApp Business API."],
    patient: ["Patient", "end user", "The patient gets the messages and can reply."],
    sent: "Reminder sent",
    confirmed: "Confirmed ✓",
    status: "✓ finished and tested",
  },
  es: {
    website: ["Web de la clínica", "HTML5 · CSS3", "La web de una clínica dental privada recién abierta."],
    byHand: ["A mano", "uno a uno", "Confirmaciones y recordatorios, paciente por paciente."],
    confirm: "¿Confirmas tu cita?",
    reminder: "Recordatorio: mañana…",
    vps: "VPS Linux · administrado por mí",
    appointment: ["Cita", "reservada", "Una cita es lo que inicia la conversación."],
    webhook: ["Webhook", "entra el evento", "Los webhooks llevan los eventos de las citas a los flujos."],
    n8n: ["n8n", "flujos", "Los flujos de n8n gestionan las citas, las confirmaciones y los recordatorios."],
    llm: ["LLM", "integración", "Un LLM integrado en la conversación."],
    whatsapp: ["WhatsApp Business API", "mensajes", "Los mensajes se envían y se reciben a través de la API de WhatsApp Business."],
    patient: ["Paciente", "usuario final", "El paciente recibe los mensajes y puede responder."],
    sent: "Recordatorio enviado",
    confirmed: "Confirmada ✓",
    status: "✓ terminado y probado",
  },
};

const RECEPTION = [150, 250];
const PATIENTS = [[420, 150], [490, 205], [415, 265], [490, 325], [420, 390]];

function drawDental(k, svg, t) {
  const manual = (p) => range(p, 0.27, 0.32);
  const warm = (p) => mixColor(COLOR.line, COLOR.sodium, range(p, 0.78, 0.82));
  const [rx, ry] = RECEPTION;

  k.edge({ at: [0, 0.06], d: "M280 0 V 24", color: COLOR.sodium, width: 1.25 });
  const junction = svgEl("circle", { cx: 280, cy: 24, r: 3.5, fill: COLOR.sodium }, svg);
  k.add((p) => (junction.style.opacity = range(p, 0.04, 0.06)));

  k.edge({ at: [0.05, 0.1], d: "M280 24 H 110 V 52", arrow: true });
  k.node({ at: [0.08, 0.13], x: 110, y: 74, w: 136, h: 38, label: t.website[0], sub: t.website[1], info: t.website[2] });

  // antes: alguien en recepción escribiendo a cada paciente
  PATIENTS.forEach(([x, y], i) => {
    k.edge({ at: [0.14 + i * 0.012, 0.19 + i * 0.012], d: `M${rx + 62} ${ry} L${x - 14} ${y}`, color: COLOR.faint, dashed: true, fade: manual });
    const g = svgEl("g", { "aria-hidden": "true" }, svg);
    svgEl("circle", { cx: x, cy: y, r: 12, fill: "#0e1014", stroke: "rgba(255,255,255,0.24)" }, g);
    svgEl("circle", { cx: x, cy: y - 3, r: 3.2, fill: "#7a8089" }, g);
    svgEl("path", { d: `M${x - 5.5} ${y + 6} a5.5 4.5 0 0 1 11 0`, fill: "#7a8089" }, g);
    k.add((p) => (g.style.opacity = keyframes(p, [0.13 + i * 0.012, 0.17 + i * 0.012, 0.27, 0.32], [0, 1, 1, 0])));
  });
  k.node({ at: [0.12, 0.17], collapse: manual, x: rx, y: ry, w: 124, h: 42, label: t.byHand[0], sub: t.byHand[1], info: t.byHand[2] });
  k.chip({ at: [0.18, 0.22], x: 300, y: 196, w: 120, label: t.confirm, fade: manual });
  k.chip({ at: [0.2, 0.24], x: 310, y: 306, w: 130, label: t.reminder, fade: manual });
  k.packets([0.16, 0.29], PATIENTS.map(([x, y], i) => [[[rx + 62, ry], [x - 14, y]], { color: COLOR.muted, r: 2.5, dur: 1.4, delay: i * 0.25 }]));

  // después: el flujo automático
  const vps = svgEl("rect", { x: 170, y: 122, width: 366, height: 158, rx: 6, fill: "none", stroke: COLOR.faint, "stroke-dasharray": "4 5" }, svg);
  const vpsLabel = text(svg, 184, 272, t.vps, { class: "d-caption", "text-anchor": "start", "dominant-baseline": "auto" });
  k.add((p) => {
    vps.style.opacity = range(p, 0.38, 0.44);
    vpsLabel.style.opacity = range(p, 0.38, 0.44);
  });

  k.edge({ at: [0.3, 0.34], d: "M280 24 V 60", color: COLOR.sodium, width: 1.25 });
  k.node({ at: [0.31, 0.36], x: 280, y: 80, w: 128, h: 36, label: t.appointment[0], sub: t.appointment[1], info: t.appointment[2] });
  k.edge({ at: [0.34, 0.38], d: "M280 98 V 134", arrow: true });
  k.node({ at: [0.35, 0.4], x: 280, y: 152, w: 116, h: 34, label: t.webhook[0], sub: t.webhook[1], info: t.webhook[2] });
  k.edge({ at: [0.4, 0.44], d: "M280 169 V 208", arrow: true });
  k.node({ at: [0.4, 0.46], x: 280, y: 232, w: 132, h: 44, label: t.n8n[0], sub: t.n8n[1], info: t.n8n[2], stroke: warm });
  k.edge({ at: [0.48, 0.53], d: "M346 232 H 396", dashed: true });
  k.node({ at: [0.49, 0.55], x: 452, y: 232, w: 110, h: 34, label: t.llm[0], sub: t.llm[1], info: t.llm[2], stroke: COLOR.signal });
  k.edge({ at: [0.56, 0.6], d: "M280 254 V 298", arrow: true });
  k.node({ at: [0.57, 0.63], x: 280, y: 318, w: 180, h: 36, label: t.whatsapp[0], sub: t.whatsapp[1], info: t.whatsapp[2] });
  k.edge({ at: [0.64, 0.68], d: "M280 336 V 382", arrow: true });
  k.node({ at: [0.65, 0.71], x: 280, y: 404, w: 120, h: 42, label: t.patient[0], sub: t.patient[1], info: t.patient[2], stroke: warm });

  k.edge({ at: [0.72, 0.8], d: "M220 404 H 130 V 232 H 210", color: COLOR.signal, dashed: true, arrow: true });
  k.chip({ at: [0.78, 0.82], x: 450, y: 382, w: 130, label: t.sent, tone: COLOR.sodium });
  k.chip({ at: [0.8, 0.84], x: 450, y: 408, w: 130, label: t.confirmed, tone: COLOR.live });
  k.chip({ at: [0.84, 0.88], x: 450, y: 434, w: 150, label: t.status, tone: COLOR.live });
  k.packets([0.8, 2], [
    [[[280, 98], [280, 134], [280, 208], [280, 298], [280, 382]], { dur: 2.6 }],
    [[[220, 404], [130, 404], [130, 232], [210, 232]], { color: COLOR.signal, dur: 1.8, delay: 1.6 }],
    [[[346, 232], [396, 232]], { color: COLOR.signal, r: 2.5, dur: 0.7, delay: 1.1 }],
  ]);
}

/*
  Monta el diagrama dentro del <svg data-diagram="lh|dental">.
  Devuelve update(p) y los valores de p que se usan cuando no hay animación:
  "still" en la página principal y "end" en la página del caso.
*/
export function buildStage(svg, lang) {
  const info = svg.closest("figure").querySelector(".stage__info");
  const hint = info.textContent;
  const inform = (label, detail) => {
    if (!label) {
      info.textContent = hint;
      return;
    }
    const name = document.createElement("strong");
    name.textContent = label;
    info.replaceChildren(name, ` — ${detail}`);
  };

  const k = kit(svg, inform);
  const lh = svg.dataset.diagram === "lh";
  if (lh) drawLh(k, svg, LH_TEXT[lang] ?? LH_TEXT.en);
  else drawDental(k, svg, DENTAL_TEXT[lang] ?? DENTAL_TEXT.en);
  return { update: k.update, still: lh ? 0.8 : 1, end: lh ? 0.83 : 1 };
}

/* ── Diagramas de las tarjetas ──────────────────────────────────────────
  Se animan con CSS cuando la tarjeta tiene .is-active (ratón encima,
  foco, o a la vista en pantallas táctiles):
    GameStore  una petición baja por las capas y vuelve como 200 OK
    Academia   alumnos → por curso → ranking → estadísticas
    Mercado    evento → cambio de precio → estado → siguiente turno, en bucle
*/
const VISUAL_TEXT = {
  en: { rules: "@Service · rules", database: "Database", loop: ["Event", "Price change", "Market state", "Next turn"], marketOn: "input validated · turn processed", marketOff: "python · turn-based", academia: ["Students", "By course", "Ranking", "Stats"] },
  es: { rules: "@Service · reglas", database: "Base de datos", loop: ["Evento", "Cambio de precio", "Estado del mercado", "Siguiente turno"], marketOn: "entrada validada · turno procesado", marketOff: "python · por turnos", academia: ["Alumnos", "Por curso", "Ranking", "Estadísticas"] },
};

function delay(node, seconds) {
  node.style.setProperty("--delay", `${seconds}s`);
  return node;
}

function edge(svg, d, wait, color = "rgba(255,255,255,0.18)") {
  svgEl("path", { d, fill: "none", stroke: "rgba(255,255,255,0.08)" }, svg);
  return delay(svgEl("path", { d, stroke: color, pathLength: 1, class: "v-edge" }, svg), wait);
}

function pill(parent, x, y, w, label, tone) {
  svgEl("rect", { x: x - w / 2, y: y - 14, width: w, height: 28, rx: 4, class: tone ? `v-box v-box--${tone}` : "v-box" }, parent);
  text(parent, x, y + 1, label, { class: "v-text" });
}

function request(svg, x, y, path) {
  const line = svgEl("text", { x, y, class: "v-mono v-group" }, svg);
  const method = svgEl("tspan", { fill: COLOR.signal }, line);
  method.textContent = "GET";
  line.append(` ${path}`);
}

function gameStore(svg, t) {
  const LX = 232;
  const HW = 98;
  const LY = (i) => 24 + i * 40;
  const layers = [["Controller", "@RestController · DTO"], ["Service", t.rules], ["Repository", "Spring Data JPA"], ["JPA", "Hibernate"], [t.database, "H2"]];

  request(svg, 10, LY(0) + 4, "/games/top/5");
  for (let i = 0; i < 4; i++) edge(svg, `M${LX} ${LY(i) + 13} V ${LY(i + 1) - 13}`, 0.1 + i * 0.12);
  edge(svg, `M${LX + HW} ${LY(4)} H ${LX + HW + 16} V ${LY(0)} H ${LX + HW}`, 0.75, COLOR.signal);

  layers.forEach(([name, note], i) => {
    const g = delay(svgEl("g", { class: "v-group" }, svg), i * 0.06);
    g.style.setProperty("--x", i % 2 ? "6px" : "-6px");
    svgEl("rect", { x: LX - HW, y: LY(i) - 13, width: HW * 2, height: 26, rx: 4, class: i === 4 ? "v-box v-box--accent" : "v-box" }, g);
    text(g, LX - HW + 12, LY(i) + 1, name, { class: "v-text", "text-anchor": "start" });
    text(g, LX + HW - 12, LY(i) + 1, note, { class: "v-note", "text-anchor": "end" });
  });

  packet(svg, [[LX, LY(0) - 13], [LX, LY(4) - 13]], { dur: 1.8, delay: 0.4 }).classList.replace("d-packet", "v-packet");
  packet(svg, [[LX + HW, LY(4)], [LX + HW + 16, LY(4)], [LX + HW + 16, LY(0)], [LX + HW, LY(0)]], { color: COLOR.signal, dur: 1.5, delay: 2.1 }).classList.replace("d-packet", "v-packet");

  const ok = delay(svgEl("g", { class: "v-late" }, svg), 3.2);
  svgEl("rect", { x: 10, y: LY(1) - 4, width: 64, height: 22, rx: 11, fill: "#13161b", stroke: "rgba(255,255,255,0.08)" }, ok);
  text(ok, 42, LY(1) + 8, "200 OK", { class: "v-mono", fill: COLOR.live });
}

function market(svg, t) {
  const nodes = [[92, 52], [308, 52], [308, 168], [92, 168]];
  const loop = "M 140 52 H 252 M 308 66 V 154 M 256 168 H 140 M 92 154 V 66";
  const line = (points) => points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

  edge(svg, loop, 0.15);
  nodes.forEach(([x, y], i) => {
    const g = delay(svgEl("g", { class: "v-group" }, svg), i * 0.12);
    pill(g, x, y, i === 0 || i === 3 ? 100 : 116, t.loop[i], i === 0 ? "accent" : i === 2 ? "signal" : "");
  });

  // el precio dentro del bucle: el evento lo dobla
  svgEl("path", { d: line([[140, 128], [162, 122], [184, 126], [206, 114], [228, 118], [250, 108]]), fill: "none", stroke: COLOR.signal, "stroke-width": 1.5, class: "v-early" }, svg);
  delay(svgEl("path", { d: line([[140, 128], [162, 122], [184, 126], [206, 138], [228, 132], [250, 124]]), fill: "none", stroke: COLOR.signal, "stroke-width": 1.5, class: "v-late" }, svg), 0.6);

  packet(svg, [[140, 52], [252, 52], [308, 52], [308, 154], [256, 168], [140, 168], [92, 154], [92, 66]], { dur: 3.2, delay: 0.4 }).classList.replace("d-packet", "v-packet");
  text(svg, 200, 208, t.marketOff, { class: "v-caption v-default" });
  text(svg, 200, 208, t.marketOn, { class: "v-caption v-alt" });
}

function academia(svg, t) {
  const xs = [56, 152, 248, 340];
  request(svg, 20, 46, "/students/top/3");
  svgEl("path", { d: "M100 110 H108 M196 110 H204 M292 110 H306", stroke: "rgba(255,255,255,0.08)" }, svg);
  for (let i = 1; i < xs.length; i++) edge(svg, `M${xs[i - 1] + 44} 110 H${xs[i] - 37}`, 0.1 + (i - 1) * 0.12);
  xs.forEach((x, i) => {
    const g = delay(svgEl("g", { class: "v-group" }, svg), i * 0.07);
    g.style.setProperty("--y", "3px");
    pill(g, x, 110, i === 0 ? 88 : 74, t.academia[i], i === 3 ? "accent" : "");
  });
  packet(svg, [[100, 110], [306, 110]], { dur: 1.8, delay: 0.5 }).classList.replace("d-packet", "v-packet");

  const bars = delay(svgEl("g", { class: "v-late" }, svg), 1.2);
  [46, 38, 30].forEach((w, i) => svgEl("rect", { x: 225, y: 140 + i * 9, width: w, height: 4, rx: 2, fill: i === 0 ? COLOR.sodium : "rgba(255,255,255,0.18)" }, bars));
  text(svg, 20, 204, "java · spring boot · spring data jpa", { class: "v-caption", "text-anchor": "start", "dominant-baseline": "auto" });
}

const VISUALS = { gamestore: gameStore, market, academia };

export function buildVisual(svg, lang) {
  VISUALS[svg.dataset.visual]?.(svg, VISUAL_TEXT[lang] ?? VISUAL_TEXT.en);
}
