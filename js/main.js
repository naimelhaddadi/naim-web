/*
  El JavaScript de todas las páginas. Cada bloque comprueba si su parte
  existe en la página antes de hacer nada, así que sirve igual para la
  portada que para las páginas de caso.
*/
import { startOrbits } from "./orbits.js";
import { buildStage, buildVisual, keyframes } from "./diagrams.js";

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const wide = matchMedia("(min-width: 1024px)");
const lang = document.documentElement.lang;
const clamp = (v) => Math.min(1, Math.max(0, v));

/* ── Progreso de scroll ──────────────────────────────────────────────────
  measure(el, "start 0.8, end 0.45") da 0 cuando la parte de arriba del
  elemento llega al 80 % de la ventana y 1 cuando su parte de abajo llega
  al 45 %. Con eso se mueven casi todas las animaciones.
*/
function parse(offsets) {
  return offsets.split(",").map((part) => {
    const [edge, at] = part.trim().split(" ");
    return [edge, Number(at)];
  });
}

function measure(el, offsets) {
  const box = el.getBoundingClientRect();
  const y = ([edge, at]) => (edge === "start" ? box.top : box.bottom) - at * innerHeight;
  const from = y(offsets[0]);
  const to = y(offsets[1]);
  return from === to ? 0 : clamp(from / (from - to));
}

// todo lo que depende del scroll se apunta aquí y se recalcula una vez por frame
const onScroll = [];
let queued = false;
function update() {
  queued = false;
  onScroll.forEach((fn) => fn());
}
function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(update);
}
addEventListener("scroll", schedule, { passive: true });
addEventListener("resize", schedule);

// los elementos con data-progress reciben --p y el CSS hace el resto
if (!calm) {
  for (const el of document.querySelectorAll("[data-progress]")) {
    const offsets = parse(el.dataset.progress);
    onScroll.push(() => el.style.setProperty("--p", measure(el, offsets).toFixed(4)));
  }
}

/* ── Aparecer al entrar en pantalla ─────────────────────────────────── */

const seen = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add("is-in");
    seen.unobserve(entry.target);
  }
}, { rootMargin: "0px 0px -12% 0px" });
document.querySelectorAll(".mask:not(.mask--load), .reveal, .statement").forEach((el) => seen.observe(el));

/* ── Navegación ─────────────────────────────────────────────────────── */

const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");
let lastY = scrollY;

function setMenu(open) {
  menu.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? toggle.dataset.open : toggle.dataset.closed;
  document.documentElement.classList.toggle("menu-open", open);
  nav.classList.toggle("nav--solid", open || scrollY > 40);
}

toggle.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
addEventListener("keydown", (e) => e.key === "Escape" && !menu.hidden && setMenu(false));
wide.addEventListener("change", () => setMenu(false));

// la barra se esconde al bajar y vuelve al subir; la línea de abajo marca cuánto queda de página
onScroll.push(() => {
  const y = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  nav.classList.toggle("nav--solid", y > 40 || !menu.hidden);
  nav.classList.toggle("nav--hidden", y > 200 && y > lastY && menu.hidden);
  nav.style.setProperty("--page", max > 0 ? (y / max).toFixed(4) : "0");
  lastY = y;
});

// al cambiar de idioma se vuelve a la misma sección en la otra versión
for (const link of document.querySelectorAll(".lang a")) {
  link.addEventListener("click", () => {
    const sections = [...document.querySelectorAll("main [id]")].filter((el) => el.matches("section, article"));
    const current = sections.filter((el) => el.getBoundingClientRect().top < innerHeight * 0.4).pop();
    link.hash = current && current.id !== "top" ? current.id : "";
  });
}

/* ── Hero ───────────────────────────────────────────────────────────── */

const hero = document.querySelector(".hero");
if (hero) {
  startOrbits(hero, calm);

  // la foto sigue un poco al ratón; --mx y --my van de -0.5 a 0.5
  if (!calm) {
    const target = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };
    let moving = false;
    const follow = () => {
      now.x += (target.x - now.x) * 0.06;
      now.y += (target.y - now.y) * 0.06;
      hero.style.setProperty("--mx", now.x.toFixed(4));
      hero.style.setProperty("--my", now.y.toFixed(4));
      moving = Math.abs(target.x - now.x) + Math.abs(target.y - now.y) > 0.001;
      if (moving) requestAnimationFrame(follow);
    };
    hero.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const box = hero.getBoundingClientRect();
      target.x = (e.clientX - box.left) / box.width - 0.5;
      target.y = (e.clientY - box.top) / box.height - 0.5;
      if (!moving) {
        moving = true;
        requestAnimationFrame(follow);
      }
    });
  }
}

/* ── Cómo trabajo: escena en pantallas grandes, columna en el resto ──── */

const how = document.querySelector(".how");
if (how) {
  const scene = matchMedia("(min-width: 1024px) and (min-height: 640px)");
  const set = () => {
    how.classList.toggle("how--scene", scene.matches && !calm);
    schedule();
  };
  scene.addEventListener("change", set);
  set();
}

/* ── Diagramas en móvil: cada fila sabe su posición ─────────────────── */

for (const flow of document.querySelectorAll(".flow")) {
  const rows = [...flow.children];
  rows.forEach((row, i) => {
    row.style.setProperty("--i", i);
    row.style.setProperty("--step", (0.85 / rows.length).toFixed(4));
  });
}

/* ── Trabajo real: el diagrama de al lado se monta mientras se lee ───── */

for (const story of document.querySelectorAll("[data-story]")) {
  const stage = buildStage(story.querySelector("[data-diagram]"), lang);
  const steps = [...story.querySelectorAll(".story__steps li")];
  const ats = steps.map((li) => Number(li.dataset.at));
  const leaves = Boolean(story.querySelector(".stage__thread--out"));

  if (calm) {
    stage.update(stage.still);
    continue;
  }
  onScroll.push(() => {
    story.classList.toggle("is-scrubbed", wide.matches);
    if (!wide.matches) return;
    const p = measure(story, [["start", 0.55], ["end", 1]]);
    stage.update(p);
    story.style.setProperty("--arrive", measure(story, [["start", 1], ["start", 0.5]]).toFixed(4));
    story.style.setProperty("--out", clamp((p - 0.9) / 0.1).toFixed(4));
    story.style.setProperty("--enter", (0.94 + 0.06 * clamp(p / 0.12)).toFixed(4));
    // cuando LH se pliega para pasar a la clínica, la rejilla se va con él
    if (leaves) story.style.setProperty("--grid", (1 - clamp((p - 0.82) / 0.13)).toFixed(4));
    const active = ats.reduce((last, at, i) => (p >= at - 0.04 ? i : last), 0);
    steps.forEach((li, i) => {
      li.classList.toggle("is-active", i === active);
      li.classList.toggle("is-past", i < active);
    });
  });
}

/* ── Páginas de caso: el diagrama avanza capítulo a capítulo ────────── */

const study = document.querySelector("[data-case]");
if (study) {
  const stage = buildStage(study.querySelector("[data-diagram]"), lang);
  const chapters = [...study.querySelectorAll(".chapters li")];
  const ats = chapters.map((li) => Number(li.dataset.at));
  const n = chapters.length;
  // cada capítulo está en la mitad de su tramo de scroll; entre dos, el diagrama va de uno a otro
  const stops = [0, ...ats.map((_, i) => (i + 0.5) / n), 1];
  const values = [Math.max(0, ats[0] - 0.07), ...ats, stage.end];

  if (calm) stage.update(stage.end);
  else {
    onScroll.push(() => {
      study.classList.toggle("is-scrubbed", wide.matches);
      if (!wide.matches) return;
      const t = measure(study, [["start", 0.6], ["end", 0.6]]);
      stage.update(keyframes(t, stops, values));
      const active = Math.min(n - 1, Math.floor(t * n));
      chapters.forEach((li, i) => li.classList.toggle("is-active", i === active));
    });
  }
}

/* ── Proyectos personales ───────────────────────────────────────────── */

document.querySelectorAll("[data-visual]").forEach((svg) => buildVisual(svg, lang));

const cards = document.querySelectorAll(".card");
const touch = matchMedia("(hover: none)");
for (const card of cards) {
  const set = (on) => card.classList.toggle("is-active", on);
  card.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && set(true));
  card.addEventListener("pointerleave", () => set(false));
  card.addEventListener("focusin", () => set(true));
  card.addEventListener("focusout", () => set(false));
}
// en pantallas táctiles no hay hover: se anima la tarjeta que está a la vista
const inView = new IntersectionObserver((entries) => {
  if (touch.matches) entries.forEach((e) => e.target.classList.toggle("is-active", e.isIntersecting));
}, { threshold: 0.55 });
cards.forEach((card) => inView.observe(card));

// fichas de proyecto: <dialog> nativo. Esc y el botón de cerrar ya funcionan solos
for (const button of document.querySelectorAll("[data-dialog]")) {
  const dialog = document.getElementById(button.dataset.dialog);
  button.addEventListener("click", () => {
    dialog.showModal();
    dialog.dispatchEvent(new Event("opened"));
  });
}
for (const dialog of document.querySelectorAll(".sheet")) {
  // un clic fuera de la ficha (en el fondo) también la cierra
  dialog.addEventListener("click", (e) => e.target === dialog && dialog.close());
}

/*
  El recorrido de una petición en las dos APIs: baja Cliente → Controller →
  Service → Repository → Base de datos y vuelve. Mientras la ficha está
  abierta va pasando por los endpoints; se para si pasas el ratón por encima.
*/
for (const tracer of document.querySelectorAll("[data-tracer]")) {
  const buttons = [...tracer.querySelectorAll("button")];
  const layers = [...tracer.querySelectorAll(".tracer__path li")];
  const status = tracer.querySelector(".tracer__status");
  const dialog = tracer.closest("dialog");
  const depth = layers.length;
  let current = 0;
  let method = "";
  let paused = false;
  let timers = [];
  let cycle = 0;

  const show = (step) => {
    const goingUp = step >= depth;
    const at = goingUp ? 2 * depth - 2 - step : step;
    const done = step >= 2 * depth - 2;
    layers.forEach((li, i) => {
      li.classList.toggle("is-down", !goingUp && i === at);
      li.classList.toggle("is-up", goingUp && i === at);
    });
    status.textContent = done ? "200 OK" : method;
    status.classList.toggle("is-done", done);
  };

  const trace = (index) => {
    timers.forEach(clearTimeout);
    current = index;
    method = buttons[index].querySelector("span").textContent;
    buttons.forEach((b, i) => b.setAttribute("aria-pressed", String(i === index)));
    if (calm) return show(2 * depth - 1);
    show(0);
    timers = Array.from({ length: 2 * depth - 1 }, (_, i) => setTimeout(() => show(i + 1), (i + 1) * 230));
  };

  buttons.forEach((button, i) => button.addEventListener("click", () => trace(i)));
  tracer.addEventListener("pointerenter", () => (paused = true));
  tracer.addEventListener("pointerleave", () => (paused = false));
  dialog.addEventListener("opened", () => {
    trace(current);
    if (!calm) cycle = setInterval(() => !paused && trace((current + 1) % buttons.length), 3400);
  });
  dialog.addEventListener("close", () => {
    clearInterval(cycle);
    timers.forEach(clearTimeout);
  });
}

/* ── Copiar el email ────────────────────────────────────────────────── */

for (const button of document.querySelectorAll("[data-copy]")) {
  const label = button.querySelector("span");
  const icon = button.querySelector("use");
  const idle = label.textContent;
  const announce = document.querySelector("[data-copy-status]");
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
    } catch {
      // sin permiso para el portapapeles, se abre el correo
      location.href = `mailto:${button.dataset.copy}`;
      return;
    }
    label.textContent = button.dataset.done;
    icon.setAttribute("href", "/img/icons.svg#check");
    button.classList.add("is-done");
    announce.textContent = announce.dataset.copyStatus;
    setTimeout(() => {
      label.textContent = idle;
      icon.setAttribute("href", "/img/icons.svg#copy");
      button.classList.remove("is-done");
      announce.textContent = "";
    }, 1800);
  });
}

update();
