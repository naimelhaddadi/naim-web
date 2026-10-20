/*
  Las órbitas del hero, dibujadas en dos canvas que comparten la misma
  simulación: la mitad lejana de cada órbita va en el canvas de detrás de
  la foto y la mitad cercana en el de delante. Así los átomos pasan por
  detrás y por delante de mí.

  Hay órbitas finas, unos pocos átomos (esferas negras con un núcleo
  naranja), chispas con estela, unos anillos en el "suelo" y algo de polvo.
  Al bajar, las órbitas se abren y los átomos salen del encuadre.
*/

const TAU = Math.PI * 2;
const FG = "236,235,231";
const SPARK = "255,170,90";

// r: radio (en anchos de la foto), tilt: cuánto se aplasta, rot: giro, speed: radianes por segundo
const RINGS = [
  { r: 0.62, tilt: 0.3, rot: -0.36, speed: 0.16, off: [0, 0], shift: 6 },
  { r: 0.82, tilt: 0.24, rot: 0.24, speed: -0.11, off: [0.03, 0.02], shift: 9 },
  { r: 1.02, tilt: 0.42, rot: -0.82, speed: 0.075, off: [-0.02, 0.04], shift: 12 },
];

// [órbita, posición inicial en vueltas, tamaño o velocidad]
const ATOMS = [[0, 0.15, 1], [1, 0.55, 1.15], [1, 0.05, 0.85], [2, 0.7, 1.05]];
const SPARKS = [[0, 0.62, 2.4], [1, 0.32, 2.1], [2, 0.12, 2.6], [2, 0.45, 2.2], [0, 0.9, 2.8]];

const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = (v) => 1 - Math.pow(1 - v, 4);
const phase = (t, start, length) => ease(clamp((t - start) / length));

/* Una esfera negra brillante con el núcleo naranja. */
function drawAtom(ctx, x, y, r, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;

  const body = ctx.createRadialGradient(x - r * 0.25, y - r * 0.5, r * 0.05, x, y + r * 0.1, r * 1.05);
  body.addColorStop(0, "#f5f7fa");
  body.addColorStop(0.16, "#a4abb5");
  body.addColorStop(0.42, "#2b2e34");
  body.addColorStop(0.8, "#0b0c0e");
  body.addColorStop(1, "#050506");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();

  const rim = ctx.createLinearGradient(x, y - r, x, y + r);
  rim.addColorStop(0, "rgba(255,255,255,0.18)");
  rim.addColorStop(0.5, "rgba(255,255,255,0.04)");
  rim.addColorStop(1, "rgba(255,255,255,0.22)");
  ctx.strokeStyle = rim;
  ctx.lineWidth = Math.max(0.75, r * 0.06);
  ctx.stroke();

  const gx = x - r * 0.2;
  const gy = y + r * 0.32;
  const halo = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 0.62);
  halo.addColorStop(0, "rgba(255,120,40,0.55)");
  halo.addColorStop(1, "rgba(255,120,40,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(gx, gy, r * 0.62, 0, TAU);
  ctx.fill();

  const core = ctx.createRadialGradient(gx - r * 0.05, gy - r * 0.05, 0, gx, gy, r * 0.24);
  core.addColorStop(0, "#ffc08a");
  core.addColorStop(0.45, "#ff6a1f");
  core.addColorStop(1, "#d8440c");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(gx, gy, r * 0.22, 0, TAU);
  ctx.fill();

  const shine = ctx.createRadialGradient(x - r * 0.15, y - r * 0.55, 0, x - r * 0.15, y - r * 0.55, r * 0.5);
  shine.addColorStop(0, "rgba(255,255,255,0.95)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();

  ctx.restore();
}

export function startOrbits(hero, still) {
  const back = hero.querySelector(".orbits--back");
  const front = hero.querySelector(".orbits--front");
  const anchor = hero.querySelector(".hero__core");
  const figure = hero.querySelector(".hero__figure");
  const bctx = back.getContext("2d");
  const fctx = front.getContext("2d");

  const atoms = ATOMS.map(([ring, at, size], i) => ({ ring, a: at * TAU, size, delay: i * 0.18, x: 0, y: 0, depth: 0 }));
  const sparks = SPARKS.map(([ring, at, speed]) => ({ ring, a: at * TAU, speed }));
  const dust = Array.from({ length: 40 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.4 + Math.random() * 0.8,
    alpha: 0.05 + Math.random() * 0.14,
    drift: (Math.random() - 0.5) * 0.004,
  }));

  let width = 0;
  let height = 0;
  let frame = 0;
  let visible = true;
  let last = performance.now();
  const t0 = last;
  const pointer = { tx: 0, ty: 0, x: 0, y: 0, nx: 0, ny: 0, inside: false };

  function resize() {
    const box = back.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = box.width;
    height = box.height;
    for (const canvas of [back, front]) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (still) draw(performance.now());
  }

  function draw(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = still ? 10 : (now - t0) / 1000;
    const heroBox = hero.getBoundingClientRect();
    // al bajar, cada órbita se abre un poco más que la anterior
    const ex = still ? 0 : clamp(-heroBox.top / heroBox.height);
    const open = (ring) => 1 + ex * (0.45 + ring * 0.5);
    const stay = Math.max(0, 1 - ex * 1.1);
    // en móvil hay menos chispas
    const sparkCount = width < 768 ? 3 : sparks.length;

    const box = back.getBoundingClientRect();
    const core = anchor.getBoundingClientRect();
    const photo = figure.getBoundingClientRect();
    const base = photo.width;
    const cx = core.left - box.left;
    const cy = core.top - box.top;

    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    pointer.nx += ((pointer.inside ? pointer.x / width - 0.5 : 0) - pointer.nx) * 0.05;
    pointer.ny += ((pointer.inside ? pointer.y / height - 0.5 : 0) - pointer.ny) * 0.05;
    const shiftX = (amount) => -pointer.nx * amount;
    const shiftY = (amount) => -pointer.ny * amount * 0.6;

    bctx.clearRect(0, 0, width, height);
    fctx.clearRect(0, 0, width, height);

    const dustIn = phase(t, 0, 1.2);
    for (const d of dust) {
      if (!still) d.y = (d.y + d.drift * dt + 1) % 1;
      bctx.fillStyle = `rgba(${FG},${d.alpha * dustIn * (1 - ex * 0.5)})`;
      bctx.beginPath();
      bctx.arc(d.x * width + shiftX(3), d.y * height + shiftY(3) - ex * height * 0.18, d.r, 0, TAU);
      bctx.fill();
    }

    // el suelo: anillos planos debajo de la foto
    const floorIn = phase(t, 0.2, 1.6) * stay;
    const floorY = photo.bottom - box.top - photo.height * 0.04;
    bctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const rx = base * (0.5 + i * 0.22);
      bctx.strokeStyle = `rgba(${FG},${(0.075 - i * 0.012) * floorIn})`;
      bctx.beginPath();
      bctx.ellipse(cx + shiftX(2), floorY + shiftY(2), rx, rx * 0.11, 0, 0, TAU);
      bctx.stroke();
    }

    const geo = RINGS.map((ring, i) => ({
      x: cx + ring.off[0] * base + shiftX(ring.shift),
      y: cy + ring.off[1] * base + shiftY(ring.shift),
      rx: ring.r * base * open(i),
      cos: Math.cos(ring.rot),
      sin: Math.sin(ring.rot),
    }));
    // un punto de una órbita en pantalla, y su profundidad (-1 lejos, 1 cerca)
    const at = (i, a, push = 1) => {
      const g = geo[i];
      const lx = Math.cos(a) * g.rx * push;
      const ly = Math.sin(a) * g.rx * push * RINGS[i].tilt;
      return { x: g.x + lx * g.cos - ly * g.sin, y: g.y + lx * g.sin + ly * g.cos, depth: Math.sin(a) };
    };

    // las órbitas se dibujan solas al entrar; la mitad lejana detrás de la foto y la cercana delante
    const ringsIn = phase(t, 0.3, 1.4);
    RINGS.forEach((ring, i) => {
      const g = geo[i];
      const start = -Math.PI / 2 + i;
      const end = start + TAU * ringsIn;
      for (const [ctx, lo, hi, alpha] of [[bctx, Math.PI, TAU, 0.16], [fctx, 0, Math.PI, 0.12]]) {
        for (const turn of [-1, 0, 1]) {
          const a0 = Math.max(start, lo + turn * TAU);
          const a1 = Math.min(end, hi + turn * TAU);
          if (a1 <= a0) continue;
          ctx.beginPath();
          ctx.ellipse(g.x, g.y, g.rx, g.rx * ring.tilt, ring.rot, a0, a1);
          ctx.strokeStyle = `rgba(${FG},${alpha * stay})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    const sparksIn = phase(t, 1.6, 0.8);
    sparks.slice(0, sparkCount).forEach((s) => {
      if (!still) s.a += RINGS[s.ring].speed * s.speed * dt;
      if (sparksIn <= 0) return;
      const dir = Math.sign(RINGS[s.ring].speed);
      const head = at(s.ring, s.a, 1 + ex * 0.3);
      const ctx = head.depth > 0 ? fctx : bctx;
      const near = (head.depth + 1) / 2;
      const alpha = sparksIn * stay * (0.55 + near * 0.45);
      const steps = 18;
      let prev = head;
      for (let i = 1; i <= steps; i++) {
        const p = at(s.ring, s.a - dir * i * 0.009, 1 + ex * 0.3);
        ctx.strokeStyle = `rgba(${SPARK},${alpha * (1 - i / steps) * 0.7})`;
        ctx.lineWidth = 2 * (1 - i / steps) + 0.3;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        prev = p;
      }
      ctx.save();
      ctx.shadowColor = `rgba(${SPARK},0.9)`;
      ctx.shadowBlur = 14;
      ctx.fillStyle = `rgba(255,214,170,${alpha})`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 1.8 + near, 0, TAU);
      ctx.fill();
      ctx.restore();
    });

    for (const b of atoms) {
      if (!still) b.a += RINGS[b.ring].speed * dt;
      const p = at(b.ring, b.a, 1 + ex * 0.25);
      let { x, y } = p;
      // se apartan un poco del ratón
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const d = Math.hypot(dx, dy);
      if (pointer.inside && d > 0 && d < 120) {
        x += (dx / d) * (1 - d / 120) * 14;
        y += (dy / d) * (1 - d / 120) * 14;
      }
      b.x = x;
      b.y = y - ex * height * 0.1 * (b.ring + 1);
      b.depth = p.depth;
    }
    // primero los de atrás, para que los de delante los tapen
    for (const b of [...atoms].sort((p, q) => p.depth - q.depth)) {
      const k = phase(t, 1 + b.delay, 0.9);
      if (k <= 0) continue;
      const near = (b.depth + 1) / 2;
      const r = base * 0.032 * b.size * (0.72 + near * 0.5) * (0.6 + k * 0.4);
      drawAtom(b.depth > 0 ? fctx : bctx, b.x, b.y, r, k * Math.max(0, 1 - ex * 0.8) * (0.7 + near * 0.3));
    }
  }

  function loop(now) {
    draw(now);
    if (visible) frame = requestAnimationFrame(loop);
  }

  function start() {
    if (still || !visible || frame) return;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  // solo se anima mientras el hero está en pantalla y la pestaña visible
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && !document.hidden;
    visible ? start() : stop();
  }).observe(back);
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    visible ? start() : stop();
  });
  new ResizeObserver(resize).observe(back);
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const box = back.getBoundingClientRect();
    pointer.tx = e.clientX - box.left;
    pointer.ty = e.clientY - box.top;
    pointer.inside = pointer.ty > 0 && pointer.ty < box.height;
  }, { passive: true });

  resize();
  start();
}
