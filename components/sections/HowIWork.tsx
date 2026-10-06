"use client";

import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { process } from "@/lib/content";
import { ease } from "@/lib/motion";
import { useCalm } from "@/lib/useCalm";
import { useMedia } from "@/lib/useMedia";

/*
  How I work — the claim the rest of the page has to back up.

  Wide screens: the section holds the screen for a short stretch while the
  scroll rearranges it (the page keeps scrolling; it just reads like one
  scene):

    0.00 – 0.24  "I don't start with code." / "I start with the problem."
                 — "code" fades to an outline, "problem" takes the colour
    0.24 – 0.42  the two statements move together and become one heading
    0.40 – 0.84  the process is drawn: a tangled line leaves the problem
                 and straightens out as it goes through
                 understand → design → build → improve; improve loops
                 back to understand
    0.86 – 1.00  "Here's what that looks like in practice." and the thread
                 drops into Real-world work

  Phones, short screens and reduced motion get the same story as a plain
  column that builds as it scrolls past.
*/

const INTRO =
  "Before building something, I want to understand why it needs to exist, how people are solving it today and where the real friction is.";
const HANDOFF = "Here's what that looks like in practice.";

export function HowIWork() {
  const wide = useMedia("(min-width: 1024px) and (min-height: 640px)");
  const calm = useCalm();

  return (
    <section id="how" aria-labelledby="how-title" className="relative">
      <h2 id="how-title" className="sr-only">
        How I work: I don&apos;t start with code. I start with the problem.
      </h2>
      {wide && !calm ? <Scene /> : <Column calm={calm} />}
    </section>
  );
}

/* ── wide screens ──────────────────────────────────────────────────────── */

function useBox<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setBox({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);
  return [ref, box] as const;
}

function Scene() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [stageRef, { w: W, h: H }] = useBox<HTMLDivElement>();
  const [secondRef, second] = useBox<HTMLDivElement>();

  // sizes, all from the stage
  const fs = Math.max(48, Math.min(W * 0.075, H * 0.13));
  const lineH = fs * 0.92;
  const top1 = H * 0.06;
  const top2 = H * 0.46;
  const s = 0.56; // the heading's final scale

  /* 1 — two statements */
  const reveal2 = useTransform(p, [0.02, 0.13], [0, 1]);
  const clip2 = useTransform(reveal2, (v) => `inset(0% 0% ${(1 - v) * 100}% 0%)`);
  const lift2 = useTransform(reveal2, (v) => (1 - v) * 30);
  const codeSolid = useTransform(p, [0.12, 0.22], [1, 0]);
  const problemColor = useTransform(p, [0.13, 0.23], ["#ecebe7", "#f2a15a"]);

  /* 2 — they come together */
  const join = useTransform(p, [0.24, 0.42], [0, 1]);
  const scale = useTransform(join, (v) => 1 - (1 - s) * v);
  const x2 = useTransform(join, (v) => (1 - v) * Math.max(0, W - second.w));
  const y2 = useTransform([join, lift2], ([v, l]: number[]) => v * (top1 + 2 * lineH * s + fs * 0.08 - top2) + l);
  const intro = useTransform(p, [0.34, 0.44], [0, 1]);
  const introY = useTransform(intro, (v) => (1 - v) * 18);

  /* 3 — the process */
  const y0 = H * 0.58;
  const xs = [0.012, 0.17, 0.38, 0.59, 0.8].map((f) => f * W); // problem, then the four steps
  const tangle = `M ${xs[0]} ${y0} C ${xs[0] + 30} ${y0 - 60}, ${xs[0] + 50} ${y0 + 60}, ${xs[0] + 70} ${y0 - 10} S ${xs[0] + 110} ${y0 + 34}, ${xs[0] + 130} ${y0 - 4} S ${xs[1] - 30} ${y0 + 6}, ${xs[1] - 8} ${y0}`;
  const loop = `M ${xs[4]} ${y0 - 10} C ${xs[4]} ${y0 - 110}, ${xs[1]} ${y0 - 110}, ${xs[1]} ${y0 - 12}`;
  const at = [0.42, 0.5, 0.6, 0.69, 0.78];

  /* 4 — hand-off to the work */
  const handoff = useTransform(p, [0.87, 0.95], [0, 1]);
  const drop = useTransform(p, [0.9, 1], [0, 1]);
  const handoffX = useTransform(handoff, (v) => (1 - v) * -16);
  const problemLabel = useTransform(p, [0.42, 0.45], [0, 1]);

  return (
    <div ref={track} className="relative h-[300vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden pt-(--nav-h)">
        <div className="container-x h-full">
          <div ref={stageRef} className="relative h-full">
            <p className="label absolute left-0 top-0 flex items-center gap-3">
              <span className="text-sodium">(02)</span>
              <span aria-hidden className="h-px w-8 bg-line-strong" />
              How I work
            </p>

            <div aria-hidden style={{ visibility: W > 0 ? "visible" : "hidden" }}>
              {/* "I don't start with code." — "code" fades to an outline */}
              <motion.div
                className="display absolute left-0 origin-top-left whitespace-nowrap"
                style={{ top: top1, fontSize: fs, lineHeight: 0.92, scale }}
              >
                <MaskOnView>I don&apos;t start</MaskOnView>
                <MaskOnView delay={0.08}>
                  with{" "}
                  <span className="relative inline-block">
                    <span className="text-outline">code.</span>
                    <motion.span className="absolute inset-0" style={{ opacity: codeSolid }}>
                      code.
                    </motion.span>
                  </span>
                </MaskOnView>
              </motion.div>

              {/* "I start with the problem." — comes in from the right, then joins the first line */}
              <motion.div
                ref={secondRef}
                className="display absolute left-0 origin-top-left whitespace-nowrap"
                style={{ top: top2, fontSize: fs, lineHeight: 0.92, x: x2, y: y2, scale, clipPath: clip2 }}
              >
                <span className="block">I start with</span>
                <span className="block">
                  the{" "}
                  <motion.span className="font-serif font-normal italic tracking-normal" style={{ color: problemColor }}>
                    problem.
                  </motion.span>
                </span>
              </motion.div>

              <motion.p
                className="absolute max-w-[40ch] text-[clamp(1.05rem,1.35vw,1.3rem)] leading-relaxed text-muted"
                style={{ left: W * 0.5, top: top1 + fs * 0.1, opacity: intro, y: introY }}
              >
                {INTRO}
              </motion.p>

              {/* the process, drawn: tangled at the problem, straight once it's understood */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${W} ${H}`}>
                <Line p={p} at={[at[0], at[1]]} d={tangle} dashed />
                {[1, 2, 3].map((i) => (
                  <Line key={i} p={p} at={[at[i] - 0.02, at[i + 1]]} d={`M ${xs[i] + 8} ${y0} H ${xs[i + 1] - 8}`} solid />
                ))}
                <Line p={p} at={[0.8, 0.86]} d={loop} dashed accent />
                <Marker p={p} at={0.84} x={(xs[1] + xs[4]) / 2} y={y0 - 86} />

                <ProblemNode p={p} at={at[0]} x={xs[0]} y={y0} />
                {[1, 2, 3, 4].map((i) => (
                  <StepNode key={i} p={p} at={at[i]} x={xs[i]} y={y0} />
                ))}

                {/* the thread down into the work */}
                <motion.line x1={4} x2={4} y1={H * 0.88 + 26} y2={H + 40} stroke="#f2a15a" strokeWidth={1.25} style={{ pathLength: drop }} />
              </svg>

              <motion.p className="label absolute text-sodium" style={{ left: xs[0] - 4, top: y0 + 22, opacity: problemLabel }}>
                the problem
              </motion.p>
            </div>

            {/* the four steps are real text, placed under their nodes */}
            <ol className="absolute inset-0" aria-label="How I work">
              {process.map((step, i) => (
                <Step
                  key={step.title}
                  p={p}
                  at={at[i + 1]}
                  style={{ left: xs[i + 1] - 6, top: y0 + 24, width: Math.min(W * 0.18, 270) }}
                  step={step}
                  n={i + 1}
                />
              ))}
            </ol>

            <motion.p
              className="absolute left-0 flex items-center gap-3 font-display text-[clamp(1.2rem,1.7vw,1.6rem)] font-medium tracking-tight"
              style={{ top: H * 0.88 - 14, opacity: handoff, x: handoffX }}
            >
              <span aria-hidden className="block size-2 rounded-full bg-sodium" />
              {HANDOFF}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MaskOnView({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <span ref={ref} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={{ y: inView ? "0%" : "105%" }}
        transition={{ duration: 1.1, ease: ease.out, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Line({ p, at, d, dashed, solid, accent }: { p: MotionValue<number>; at: [number, number]; d: string; dashed?: boolean; solid?: boolean; accent?: boolean }) {
  const length = useTransform(p, at, [0, 1]);
  const opacity = useTransform(length, (v) => (v > 0.001 ? 1 : 0));
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={accent ? "#f2a15a" : solid ? "rgba(236,235,231,0.55)" : "rgba(236,235,231,0.35)"}
      strokeWidth={solid ? 1.25 : 1}
      strokeDasharray={dashed ? "3 5" : undefined}
      style={{ pathLength: length, opacity }}
    />
  );
}

function Marker({ p, at, x, y }: { p: MotionValue<number>; at: number; x: number; y: number }) {
  const opacity = useTransform(p, [at, at + 0.03], [0, 1]);
  return (
    <motion.text x={x} y={y} textAnchor="middle" fontSize={10} letterSpacing={1.6} fill="#f2a15a" className="font-mono uppercase" style={{ opacity }}>
      and again
    </motion.text>
  );
}

/* The problem: a loose, unfinished ring. */
function ProblemNode({ p, at, x, y }: { p: MotionValue<number>; at: number; x: number; y: number }) {
  const v = useTransform(p, [at - 0.02, at + 0.02], [0, 1]);
  const scale = useTransform(v, (t) => 0.4 + 0.6 * t);
  return (
    <motion.g style={{ opacity: v, scale, transformBox: "fill-box", transformOrigin: "50% 50%" }}>
      <circle cx={x} cy={y} r={11} fill="#07080a" stroke="#f2a15a" strokeDasharray="2 4" />
      <circle cx={x} cy={y} r={3} fill="#f2a15a" />
    </motion.g>
  );
}

/* A step: a solid node that lights up when the line reaches it. */
function StepNode({ p, at, x, y }: { p: MotionValue<number>; at: number; x: number; y: number }) {
  const v = useTransform(p, [at - 0.015, at + 0.015], [0, 1]);
  const scale = useTransform(v, (t) => 0.5 + 0.5 * t);
  return (
    <motion.g style={{ opacity: v, scale, transformBox: "fill-box", transformOrigin: "50% 50%" }}>
      <circle cx={x} cy={y} r={8} fill="#07080a" stroke="rgba(236,235,231,0.7)" />
      <circle cx={x} cy={y} r={3} fill="#ecebe7" />
    </motion.g>
  );
}

function Step({ p, at, style, step, n }: { p: MotionValue<number>; at: number; style: React.CSSProperties; step: (typeof process)[number]; n: number }) {
  const v = useTransform(p, [at - 0.01, at + 0.04], [0, 1]);
  const y = useTransform(v, (t) => (1 - t) * 14);
  return (
    <motion.li className="absolute" style={{ ...style, opacity: v, y }}>
      <p className="label mb-2 tabular-nums text-sodium">{String(n).padStart(2, "0")}</p>
      <p className="display text-[clamp(1.4rem,2vw,2rem)] uppercase">{step.title}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.line}</p>
    </motion.li>
  );
}

/* ── phones, short screens, reduced motion ─────────────────────────────── */

function Column({ calm }: { calm: boolean }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.85", "end 0.6"] });
  const headRef = useRef<HTMLDivElement>(null);
  const headIn = useInView(headRef, { once: true, amount: 0.6 });

  return (
    <div className="container-x pb-6 pt-[calc(var(--section-y)*0.5)]">
      <p className="label mb-8 flex items-center gap-3">
        <span className="text-sodium">(02)</span>
        <span aria-hidden className="h-px w-8 bg-line-strong" />
        How I work
      </p>

      <div ref={headRef} aria-hidden className="display text-[clamp(2.6rem,11vw,6rem)] leading-[0.92]">
        <MaskOnView>I don&apos;t start</MaskOnView>
        <MaskOnView delay={0.08}>
          with{" "}
          <span className={`transition-all duration-1000 ${headIn || calm ? "text-outline" : ""}`}>code.</span>
        </MaskOnView>
        <div className="mt-[0.35em]">
          <MaskOnView delay={0.2}>I start with</MaskOnView>
          <MaskOnView delay={0.28}>
            the{" "}
            <span className={`font-serif font-normal italic tracking-normal transition-colors duration-1000 ${headIn || calm ? "text-sodium" : ""}`}>
              problem.
            </span>
          </MaskOnView>
        </div>
      </div>

      <p className="mt-10 max-w-[44ch] text-lg leading-relaxed text-muted">{INTRO}</p>

      <ol ref={listRef} className="relative mt-12" aria-label="How I work">
        <motion.span
          aria-hidden
          className="absolute bottom-0 left-[5px] top-2 w-px origin-top bg-line-strong"
          style={{ scaleY: calm ? 1 : scrollYProgress }}
        />
        <li className="relative pb-8 pl-9" aria-hidden>
          <span className="absolute left-0 top-0.5 size-[11px] rounded-full border border-dashed border-sodium bg-ink" />
          <p className="label text-sodium">the problem</p>
        </li>
        {process.map((step, i) => (
          <li key={step.title} className="relative pb-9 pl-9">
            <span className="absolute left-[1px] top-1 size-[9px] rounded-full border border-fg/70 bg-ink" />
            <p className="label mb-1.5 tabular-nums text-sodium">{String(i + 1).padStart(2, "0")}</p>
            <p className="display text-2xl uppercase">{step.title}</p>
            <p className="mt-1.5 max-w-[40ch] text-muted">{step.line}</p>
          </li>
        ))}
      </ol>

      <p className="mt-4 flex items-center gap-3 font-display text-xl font-medium tracking-tight">
        <span aria-hidden className="block size-2 rounded-full bg-sodium" />
        {HANDOFF}
      </p>
      <div aria-hidden className="ml-[3.5px] mt-4 h-16 w-[1.25px] bg-sodium" />
    </div>
  );
}
