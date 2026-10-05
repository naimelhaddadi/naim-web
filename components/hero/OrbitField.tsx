"use client";

import { useEffect, useRef, type RefObject } from "react";

/*
  The system around the hero photo, drawn on two canvases that share one
  simulation: everything on the far half of an orbit goes on the canvas
  behind the photo, everything on the near half on the canvas in front.
  That's what makes the photo sit *inside* the system instead of on top.

  Three depths, each moving a different amount with the pointer:
    background  faint dust and the orbit lines      (moves least)
    midground   nodes, connections, and the labels  (moves more)
    foreground  the photo itself, in Hero.tsx       (moves most)

  Timeline (seconds from mount):
    0.0 – 0.6   nodes fade in, scattered
    0.3 – 1.9   they converge onto their orbits around the anchor
    0.9 – 2.1   the orbit lines draw themselves
    1.2 – 2.4   connections and labels appear
*/

/*
  Each orbit has its own tilt, rotation and a slightly shifted centre, and
  only parts of it are drawn (arcs, in turns of the ellipse): that keeps it
  from looking like a textbook atom.
*/
type Ring = {
  r: number;
  tilt: number;
  rot: number;
  speed: number;
  off: [number, number];
  arcs: [number, number][];
  shift: number;
  dash?: boolean;
};

const RINGS: Ring[] = [
  { r: 0.38, tilt: 0.4, rot: -0.32, speed: 0.1, off: [0, 0], arcs: [[0, 1]], shift: 6, dash: true },
  { r: 0.58, tilt: 0.27, rot: 0.2, speed: -0.065, off: [0.04, -0.03], arcs: [[0.04, 0.4], [0.52, 0.9]], shift: 9 },
  { r: 0.8, tilt: 0.2, rot: -0.07, speed: 0.042, off: [-0.03, 0.05], arcs: [[0.58, 0.98], [0.06, 0.3]], shift: 12 },
];

/*
  Only real technologies, and only a few of them: the rest of the stack has
  its own section. Position = [ring, starting point in turns of the orbit].
*/
const LABELS: { name: string; ring: number; at: number; compact?: boolean }[] = [
  { name: "Java", ring: 1, at: 0.12, compact: true },
  { name: "JPA", ring: 1, at: 0.45 },
  { name: "Python", ring: 1, at: 0.78, compact: true },
  { name: "Spring Boot", ring: 2, at: 0.02, compact: true },
  { name: "SQL", ring: 2, at: 0.27, compact: true },
  { name: "Docker", ring: 2, at: 0.52 },
  { name: "n8n", ring: 2, at: 0.77, compact: true },
];

const DOTS_PER_RING = [8, 11, 14];
const DUST = 46;
const LABEL_SHIFT = 6;
const DUST_SHIFT = 3;

const TAU = Math.PI * 2;
const FG = "236,235,231";
const SIGNAL = "141,180,255";
const SODIUM = "242,161,90";

type Particle = {
  ring: number;
  a: number;
  mul: number;
  size: number;
  delay: number;
  sx: number;
  sy: number;
  tone: string;
  label?: string;
  // filled every frame
  x: number;
  y: number;
  depth: number;
  alpha: number;
};

type Dust = { x: number; y: number; r: number; alpha: number; drift: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (v: number) => 1 - Math.pow(1 - v, 4);
const phase = (t: number, start: number, length: number) => easeOut(clamp01((t - start) / length));

function makeParticles(compact: boolean): Particle[] {
  const base = (ring: number, a: number) => ({
    ring,
    a,
    delay: Math.random() * 0.45,
    sx: Math.random(),
    sy: Math.random(),
    x: 0,
    y: 0,
    depth: 0,
    alpha: 0,
  });

  const dots: Particle[] = RINGS.flatMap((_, ring) => {
    const n = Math.round(DOTS_PER_RING[ring] * (compact ? 0.6 : 1));
    return Array.from({ length: n }, (_, i) => ({
      ...base(ring, (i / n) * TAU + Math.random() * 0.5),
      mul: 0.75 + Math.random() * 0.5,
      size: 0.8 + Math.random() * 1.2,
      tone: i % 6 === 2 ? SODIUM : i % 3 === 0 ? SIGNAL : FG,
    }));
  });

  // labelled nodes all move at their ring's speed, so they never bunch up
  const labelled: Particle[] = LABELS.filter((l) => !compact || l.compact).map((l) => ({
    ...base(l.ring, l.at * TAU),
    mul: 1,
    size: 2,
    tone: FG,
    label: l.name.toUpperCase(),
  }));

  return [...dots, ...labelled];
}

function makeDust(): Dust[] {
  return Array.from({ length: DUST }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.4 + Math.random() * 0.8,
    alpha: 0.06 + Math.random() * 0.16,
    drift: (Math.random() - 0.5) * 0.004,
  }));
}

type Props = {
  /** The point the system orbits around (the nucleus). */
  anchor: RefObject<HTMLElement | null>;
  /** The element whose width sets the size of the orbits. */
  scale: RefObject<HTMLElement | null>;
  backClassName?: string;
  frontClassName?: string;
};

export function OrbitField({ anchor, scale, backClassName, frontClassName }: Props) {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const back = backRef.current;
    const front = frontRef.current;
    const bctx = back?.getContext("2d");
    const fctx = front?.getContext("2d");
    if (!back || !front || !bctx || !fctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // canvas can't read CSS variables, so we resolve the mono font's real name once
    const mono = getComputedStyle(back).getPropertyValue("--font-geist-mono").trim() || "ui-monospace";
    const labelFont = `500 10px ${mono}, ui-monospace, monospace`;

    let compact = window.innerWidth < 768;
    let particles = makeParticles(compact);
    const dust = makeDust();
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let last = performance.now();
    const t0 = last;

    // pointer, eased: target (tx, ty), current (px, py) and normalised (nx, ny)
    const pointer = { tx: 0, ty: 0, px: 0, py: 0, nx: 0, ny: 0, inside: false };

    function resize() {
      const rect = back!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      for (const c of [back!, front!]) {
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
      }
      bctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (compact !== width < 768) {
        compact = width < 768;
        particles = makeParticles(compact);
      }
      if (still) draw(performance.now());
    }

    function onPointer(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const rect = back!.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.inside = pointer.ty > 0 && pointer.ty < rect.height;
    }

    function draw(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = still ? 10 : (now - t0) / 1000;

      // where the nucleus is right now (the photo has its own parallax)
      const box = back!.getBoundingClientRect();
      const a = anchor.current?.getBoundingClientRect();
      const s = scale.current?.getBoundingClientRect();
      if (!a || !s) return;
      const base = s.width;
      const cx = a.left - box.left + a.width / 2;
      const cy = a.top - box.top + a.height / 2;

      pointer.px += (pointer.tx - pointer.px) * 0.08;
      pointer.py += (pointer.ty - pointer.py) * 0.08;
      pointer.nx += ((pointer.inside ? pointer.px / width - 0.5 : 0) - pointer.nx) * 0.05;
      pointer.ny += ((pointer.inside ? pointer.py / height - 0.5 : 0) - pointer.ny) * 0.05;
      const shiftX = (amount: number) => -pointer.nx * amount;
      const shiftY = (amount: number) => -pointer.ny * amount * 0.6;

      bctx!.clearRect(0, 0, width, height);
      fctx!.clearRect(0, 0, width, height);

      // background: dust, barely moving
      const dustIn = phase(t, 0, 1.2);
      for (const d of dust) {
        if (!still) d.y = (d.y + d.drift * dt + 1) % 1;
        bctx!.fillStyle = `rgba(${FG},${d.alpha * dustIn})`;
        bctx!.beginPath();
        bctx!.arc(d.x * width + shiftX(DUST_SHIFT), d.y * height + shiftY(DUST_SHIFT), d.r, 0, TAU);
        bctx!.fill();
      }

      // orbit lines: the far half of each arc behind the photo, the near half in front
      const ringsIn = phase(t, 0.9, 1.2);
      for (const ring of RINGS) {
        const x = cx + ring.off[0] * base + shiftX(ring.shift);
        const y = cy + ring.off[1] * base + shiftY(ring.shift);
        const rx = ring.r * base;
        const ry = rx * ring.tilt;
        for (const [from, to] of ring.arcs) {
          const start = from * TAU;
          const end = start + (to - from) * TAU * ringsIn;
          for (const [ctx, lo, hi, alpha] of [
            [bctx!, Math.PI, TAU, 0.1],
            [fctx!, 0, Math.PI, 0.07],
          ] as const) {
            const a0 = Math.max(start, lo);
            const a1 = Math.min(end, hi);
            if (a1 <= a0) continue;
            ctx.beginPath();
            ctx.ellipse(x, y, rx, ry, ring.rot, a0, a1);
            ctx.setLineDash(ring.dash ? [2, 6] : []);
            ctx.strokeStyle = `rgba(${FG},${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      bctx!.setLineDash([]);
      fctx!.setLineDash([]);

      // move the nodes along their orbits
      for (const p of particles) {
        const ring = RINGS[p.ring];
        if (!still) p.a += ring.speed * p.mul * dt;
        const shift = ring.shift + (p.label ? LABEL_SHIFT : 0);
        const rx = ring.r * base;
        const lx = Math.cos(p.a) * rx;
        const ly = Math.sin(p.a) * rx * ring.tilt;
        const cos = Math.cos(ring.rot);
        const sin = Math.sin(ring.rot);
        let ox = cx + ring.off[0] * base + shiftX(shift) + lx * cos - ly * sin;
        let oy = cy + ring.off[1] * base + shiftY(shift) + lx * sin + ly * cos;

        // lean away from the pointer, a little
        const dx = ox - pointer.px;
        const dy = oy - pointer.py;
        const d = Math.hypot(dx, dy);
        if (pointer.inside && d < 110 && d > 0) {
          const push = (1 - d / 110) * 16;
          ox += (dx / d) * push;
          oy += (dy / d) * push;
        }

        const k = phase(t, 0.3 + p.delay, 1.6);
        p.x = p.sx * width + (ox - p.sx * width) * k;
        p.y = p.sy * height + (oy - p.sy * height) * k;
        p.depth = Math.sin(p.a);
        p.alpha = clamp01((t - p.delay * 0.6) / 0.6);
      }

      // connections between nearby nodes, and a few spokes back to the nucleus
      const linksIn = phase(t, 1.2, 1);
      const maxD = Math.max(90, base * 0.2);
      if (linksIn > 0) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d > maxD) continue;
            const nearSide = p.depth + q.depth > 0;
            const ctx = nearSide ? fctx! : bctx!;
            ctx.strokeStyle = `rgba(${FG},${(1 - d / maxD) * (nearSide ? 0.09 : 0.14) * linksIn})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        bctx!.strokeStyle = `rgba(${SIGNAL},${0.08 * linksIn})`;
        for (const p of particles) {
          if (!p.label) continue;
          bctx!.beginPath();
          bctx!.moveTo(cx, cy);
          bctx!.lineTo(p.x, p.y);
          bctx!.stroke();
        }
        // the pointer joins the network while it's close
        if (pointer.inside) {
          for (const p of particles) {
            const d = Math.hypot(p.x - pointer.px, p.y - pointer.py);
            if (d > 150) continue;
            const ctx = p.depth > 0 ? fctx! : bctx!;
            ctx.strokeStyle = `rgba(${SODIUM},${(1 - d / 150) * 0.28 * linksIn})`;
            ctx.beginPath();
            ctx.moveTo(pointer.px, pointer.py);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      // plain nodes: small dots
      for (const p of particles) {
        if (p.label) continue;
        const ctx = p.depth > 0 ? fctx! : bctx!;
        const near = (p.depth + 1) / 2;
        ctx.fillStyle = `rgba(${p.tone},${p.alpha * (0.3 + near * 0.55)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.8 + near * 0.5), 0, TAU);
        ctx.fill();
      }

      // labelled nodes: a ring, a dot and the name
      const labelsIn = phase(t, 1.5, 0.9);
      for (const p of particles) {
        if (!p.label) continue;
        const ctx = p.depth > 0 ? fctx! : bctx!;
        const near = (p.depth + 1) / 2;
        const alpha = p.alpha * (0.45 + near * 0.55);
        ctx.strokeStyle = `rgba(${FG},${alpha * 0.55})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5 + near * 1.5, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = `rgba(${SODIUM},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, TAU);
        ctx.fill();
        if (labelsIn > 0) {
          ctx.font = labelFont;
          if ("letterSpacing" in ctx) ctx.letterSpacing = "1.5px";
          ctx.fillStyle = `rgba(${FG},${labelsIn * (0.35 + near * 0.5)})`;
          ctx.fillText(p.label, p.x + 11, p.y + 3.5);
          if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
        }
      }
    }

    function loop(now: number) {
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

    // only animate while the hero is on screen and the tab is visible
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) start();
      else stop();
    });
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(back);
    io.observe(back);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    resize();
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [anchor, scale]);

  return (
    <>
      <canvas ref={backRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${backClassName ?? ""}`} />
      <canvas ref={frontRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${frontClassName ?? ""}`} />
    </>
  );
}
