"use client";

import type { MotionValue } from "motion/react";
import { useEffect, useRef, type RefObject } from "react";

/*
  The system around the hero photo, drawn on two canvases that share one
  simulation: everything on the far half of an orbit goes on the canvas
  behind the photo, everything on the near half on the canvas in front.
  That's what makes the photo sit *inside* the system instead of on top.

  What's in it, and nothing else:
    orbits   thin full ellipses, each with its own size, tilt and rotation
    atoms    a few glossy spheres with a glowing core, riding the orbits
    sparks   small bright points with a trail, faster than the atoms
    floor    faint flat rings under the figure, for depth
    dust     barely visible, barely moving

  Timeline (seconds from mount):
    0.3 – 1.7   the orbits draw themselves
    1.0 – 2.2   the atoms appear, one after another
    1.6 – 2.4   the sparks start
*/

type Ring = {
  r: number;
  tilt: number;
  rot: number;
  speed: number;
  off: [number, number];
  shift: number;
};

const RINGS: Ring[] = [
  { r: 0.62, tilt: 0.3, rot: -0.36, speed: 0.16, off: [0, 0], shift: 6 },
  { r: 0.82, tilt: 0.24, rot: 0.24, speed: -0.11, off: [0.03, 0.02], shift: 9 },
  { r: 1.02, tilt: 0.42, rot: -0.82, speed: 0.075, off: [-0.02, 0.04], shift: 12 },
];

/* Atoms: [ring, starting point in turns, size]. Sparks: [ring, start, speed multiplier]. */
const ATOMS: [number, number, number][] = [
  [0, 0.15, 1],
  [1, 0.55, 1.15],
  [1, 0.05, 0.85],
  [2, 0.7, 1.05],
];
const SPARKS: [number, number, number][] = [
  [0, 0.62, 2.4],
  [1, 0.32, 2.1],
  [2, 0.12, 2.6],
  [2, 0.45, 2.2],
  [0, 0.9, 2.8],
];

const DUST = 40;
const TAU = Math.PI * 2;
const FG = "236,235,231";
const SPARK = "255,170,90";

type Body = { ring: number; a: number; size: number; mul: number; delay: number; x: number; y: number; depth: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (v: number) => 1 - Math.pow(1 - v, 4);
const phase = (t: number, start: number, length: number) => easeOut(clamp01((t - start) / length));

/* A glossy black sphere: a bright top, a dark body, a rim, and a glowing orange core. */
function drawAtom(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
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

  // rim light on the lower edge
  const rim = ctx.createLinearGradient(x, y - r, x, y + r);
  rim.addColorStop(0, "rgba(255,255,255,0.18)");
  rim.addColorStop(0.5, "rgba(255,255,255,0.04)");
  rim.addColorStop(1, "rgba(255,255,255,0.22)");
  ctx.strokeStyle = rim;
  ctx.lineWidth = Math.max(0.75, r * 0.06);
  ctx.stroke();

  // the core, glowing through the shell
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

  // specular highlight
  const spec = ctx.createRadialGradient(x - r * 0.15, y - r * 0.55, 0, x - r * 0.15, y - r * 0.55, r * 0.5);
  spec.addColorStop(0, "rgba(255,255,255,0.95)");
  spec.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = spec;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();

  ctx.restore();
}

function makeBodies(list: [number, number, number][], kind: "atom" | "spark"): Body[] {
  return list.map(([ring, at, k], i) => ({
    ring,
    a: at * TAU,
    size: kind === "atom" ? k : 1,
    mul: kind === "spark" ? k : 1,
    delay: i * 0.18,
    x: 0,
    y: 0,
    depth: 0,
  }));
}

type Props = {
  /** The point the system orbits around (the nucleus). */
  anchor: RefObject<HTMLElement | null>;
  /** The element whose width sets the size of the orbits. */
  scale: RefObject<HTMLElement | null>;
  backClassName?: string;
  frontClassName?: string;
  /** 0 → 1 as the hero scrolls away: the orbits open up and the atoms fly out. */
  exit?: MotionValue<number>;
};

export function OrbitField({ anchor, scale, backClassName, frontClassName, exit }: Props) {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const back = backRef.current;
    const front = frontRef.current;
    const bctx = back?.getContext("2d");
    const fctx = front?.getContext("2d");
    if (!back || !front || !bctx || !fctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const atoms = makeBodies(ATOMS, "atom");
    let compact = window.innerWidth < 768;
    let sparks = makeBodies(compact ? SPARKS.slice(0, 3) : SPARKS, "spark");
    const dust = Array.from({ length: DUST }, () => ({
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
        sparks = makeBodies(compact ? SPARKS.slice(0, 3) : SPARKS, "spark");
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
      // leaving the hero: each ring opens up by a different amount, so the system separates
      const ex = still ? 0 : (exit?.get() ?? 0);
      const open = (ring: number) => 1 + ex * (0.45 + ring * 0.5);
      const stay = Math.max(0, 1 - ex * 1.1);

      const box = back!.getBoundingClientRect();
      const an = anchor.current?.getBoundingClientRect();
      const sc = scale.current?.getBoundingClientRect();
      if (!an || !sc) return;
      const base = sc.width;
      const cx = an.left - box.left + an.width / 2;
      const cy = an.top - box.top + an.height / 2;

      pointer.px += (pointer.tx - pointer.px) * 0.08;
      pointer.py += (pointer.ty - pointer.py) * 0.08;
      pointer.nx += ((pointer.inside ? pointer.px / width - 0.5 : 0) - pointer.nx) * 0.05;
      pointer.ny += ((pointer.inside ? pointer.py / height - 0.5 : 0) - pointer.ny) * 0.05;
      const shiftX = (amount: number) => -pointer.nx * amount;
      const shiftY = (amount: number) => -pointer.ny * amount * 0.6;

      bctx!.clearRect(0, 0, width, height);
      fctx!.clearRect(0, 0, width, height);

      // dust
      const dustIn = phase(t, 0, 1.2);
      for (const d of dust) {
        if (!still) d.y = (d.y + d.drift * dt + 1) % 1;
        bctx!.fillStyle = `rgba(${FG},${d.alpha * dustIn * (1 - ex * 0.5)})`;
        bctx!.beginPath();
        bctx!.arc(d.x * width + shiftX(3), d.y * height + shiftY(3) - ex * height * 0.18, d.r, 0, TAU);
        bctx!.fill();
      }

      // floor: flat rings under the figure
      const floorIn = phase(t, 0.2, 1.6) * stay;
      const fy = sc.bottom - box.top - sc.height * 0.04;
      for (let i = 0; i < 4; i++) {
        const rx = base * (0.5 + i * 0.22);
        bctx!.strokeStyle = `rgba(${FG},${(0.075 - i * 0.012) * floorIn})`;
        bctx!.lineWidth = 1;
        bctx!.beginPath();
        bctx!.ellipse(cx + shiftX(2), fy + shiftY(2), rx, rx * 0.11, 0, 0, TAU);
        bctx!.stroke();
      }

      // a point on a ring, in screen space, plus its depth (-1 far … 1 near)
      const geo = RINGS.map((ring, ri) => ({
        x: cx + ring.off[0] * base + shiftX(ring.shift),
        y: cy + ring.off[1] * base + shiftY(ring.shift),
        rx: ring.r * base * open(ri),
        cos: Math.cos(ring.rot),
        sin: Math.sin(ring.rot),
      }));
      const at = (ri: number, a: number, push = 1) => {
        const g = geo[ri];
        const lx = Math.cos(a) * g.rx * push;
        const ly = Math.sin(a) * g.rx * push * RINGS[ri].tilt;
        return { x: g.x + lx * g.cos - ly * g.sin, y: g.y + lx * g.sin + ly * g.cos, depth: Math.sin(a) };
      };

      // orbit lines: the far half behind the photo, the near half in front
      const ringsIn = phase(t, 0.3, 1.4);
      for (const [ri, ring] of RINGS.entries()) {
        const g = geo[ri];
        const start = -Math.PI / 2 + ri;
        const end = start + TAU * ringsIn;
        for (const [ctx, lo, hi, alpha] of [
          [bctx!, Math.PI, TAU, 0.16],
          [fctx!, 0, Math.PI, 0.12],
        ] as const) {
          // the visible part of [start, end] that falls in this half, in [0, 2π)
          for (const k of [-1, 0, 1]) {
            const a0 = Math.max(start, lo + k * TAU);
            const a1 = Math.min(end, hi + k * TAU);
            if (a1 <= a0) continue;
            ctx.beginPath();
            ctx.ellipse(g.x, g.y, g.rx, g.rx * ring.tilt, ring.rot, a0, a1);
            ctx.strokeStyle = `rgba(${FG},${alpha * stay})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // sparks: a bright point with a trail along its orbit
      const sparksIn = phase(t, 1.6, 0.8);
      for (const s of sparks) {
        if (!still) s.a += RINGS[s.ring].speed * s.mul * dt;
        if (sparksIn <= 0) continue;
        const dir = Math.sign(RINGS[s.ring].speed);
        const head = at(s.ring, s.a, 1 + ex * 0.3);
        const ctx = head.depth > 0 ? fctx! : bctx!;
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
        ctx.arc(head.x, head.y, 1.8 + near * 1, 0, TAU);
        ctx.fill();
        ctx.restore();
      }

      // atoms, far ones first
      for (const b of atoms) {
        if (!still) b.a += RINGS[b.ring].speed * dt;
        const p = at(b.ring, b.a, 1 + ex * 0.25);
        let { x, y } = p;
        // lean away from the pointer, a little
        const dx = x - pointer.px;
        const dy = y - pointer.py;
        const d = Math.hypot(dx, dy);
        if (pointer.inside && d < 120 && d > 0) {
          const push = (1 - d / 120) * 14;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }
        b.x = x;
        b.y = y - ex * height * 0.1 * (b.ring + 1);
        b.depth = p.depth;
      }
      for (const b of [...atoms].sort((p, q) => p.depth - q.depth)) {
        const k = phase(t, 1 + b.delay, 0.9);
        if (k <= 0) continue;
        const near = (b.depth + 1) / 2;
        const r = base * 0.044 * b.size * (0.72 + near * 0.5) * (0.6 + k * 0.4);
        const alpha = k * Math.max(0, 1 - ex * 0.8) * (0.7 + near * 0.3);
        drawAtom(b.depth > 0 ? fctx! : bctx!, b.x, b.y, r, alpha);
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
  }, [anchor, scale, exit]);

  return (
    <>
      <canvas ref={backRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${backClassName ?? ""}`} />
      <canvas ref={frontRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${frontClassName ?? ""}`} />
    </>
  );
}
