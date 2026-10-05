"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { realWorld, type Project } from "@/lib/content";
import type { DiagramProps, Inspect } from "@/components/diagrams/primitives";
import { DentalDiagram } from "@/components/diagrams/DentalDiagram";
import { LhDiagram } from "@/components/diagrams/LhDiagram";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { MaskLines } from "@/components/ui/MaskLines";
import { ease } from "@/lib/motion";
import { useMedia } from "@/lib/useMedia";

const diagrams: Record<string, ComponentType<DiagramProps>> = { "lh-sport": LhDiagram, dental: DentalDiagram };
const STEPS = ["Problem", "Model", "System", "Running"];

/*
  Real-world work, as a pinned horizontal track. The page keeps scrolling
  vertically; while this section is on screen that scroll moves the track
  sideways: intro → LH Sport → dental clinic, then the page carries on.

  The track holds still for a while on each project, and that stretch of
  scroll is what builds its diagram, step by step:

    scroll  0 ─ .22   intro slides away, LH comes in
           .16 ─ .48  LH's diagram goes through its four states
           .46 ─ .70  LH leaves, the clinic comes in
           .64 ─ .98  the clinic's diagram goes through its states

  On small or short screens (or with reduced motion) it's a normal vertical list and
  each diagram plays once when it comes into view.
*/
export function RealWorld() {
  const wide = useMedia("(min-width: 1024px) and (min-height: 700px)");
  const reduce = useReducedMotion();
  const pinned = wide && !reduce;

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 0.22, 0.46, 0.7, 1], ["0vw", "-70vw", "-70vw", "-170vw", "-170vw"]);
  const story = [useTransform(scrollYProgress, [0.16, 0.48], [0, 1]), useTransform(scrollYProgress, [0.64, 0.98], [0, 1])];

  return (
    <section
      ref={ref}
      id="work"
      aria-labelledby="work-title"
      className={pinned ? "relative h-[420vh]" : "relative section-y"}
    >
      <div className={pinned ? "sticky top-0 h-[100svh] overflow-hidden" : ""}>
        <motion.div
          className={pinned ? "flex h-full w-max will-change-transform" : "flex flex-col gap-24"}
          style={pinned ? { x } : undefined}
        >
          <Intro pinned={pinned} progress={scrollYProgress} />
          {realWorld.map((project, i) => (
            <Panel key={project.id} project={project} n={i + 1} pinned={pinned} story={story[i]} />
          ))}
        </motion.div>

        {pinned && <Progress progress={scrollYProgress} />}
      </div>
    </section>
  );
}

function Intro({ pinned, progress }: { pinned: boolean; progress: MotionValue<number> }) {
  // the title drifts left faster than the track and dims as LH arrives
  const titleX = useTransform(progress, [0, 0.22], ["0vw", "-10vw"]);
  const dim = useTransform(progress, [0, 0.2], [1, 0.25]);

  return (
    <div className={pinned ? "flex h-full w-[70vw] shrink-0 items-center" : "container-x"}>
      <motion.div className={pinned ? "pl-(--gutter)" : ""} style={pinned ? { x: titleX, opacity: dim } : undefined}>
        <p className="label mb-8 flex items-center gap-3">
          <span className="text-sodium">(02)</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          Real-world work
        </p>
        <h2 id="work-title" className="display text-[clamp(3rem,8.4vw,9.5rem)] leading-[0.86]">
          <MaskLines lines={["Real-world", "work."]} />
        </h2>
        <p className="mt-8 max-w-[38ch] text-lg text-muted">
          An internship and a freelance client: one database an agency works on every day, and one automation running with
          real patients.
        </p>
        {pinned && (
          <p className="label mt-12 flex items-center gap-3 text-fg">
            Keep scrolling
            <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <ArrowRight />
            </motion.span>
          </p>
        )}
      </motion.div>
    </div>
  );
}

function Panel({ project, n, pinned, story }: { project: Project; n: number; pinned: boolean; story: MotionValue<number> }) {
  const Diagram = diagrams[project.id];
  const [step, setStep] = useState(0);
  const [inspect, setInspect] = useState<Inspect>(null);
  const figureRef = useRef<HTMLElement>(null);
  const inView = useInView(figureRef, { once: true, amount: 0.5 });

  // pinned: the scroll position is the step
  useMotionValueEvent(story, "change", (v) => {
    if (pinned) setStep(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)));
  });

  // vertical list: play through once when it comes into view
  useEffect(() => {
    if (pinned || !inView) return;
    const ids = STEPS.map((_, i) => window.setTimeout(() => setStep(i), 300 + i * 1500));
    return () => ids.forEach(window.clearTimeout);
  }, [pinned, inView]);

  // the diagram settles in as the project reaches the centre
  const scale = useTransform(story, [0, 0.3], [0.9, 1]);
  const textX = useTransform(story, [0, 0.3], [70, 0]);

  // the story section that matches the diagram's current state
  const current = project.sections.reduce((acc, s, i) => (s.step <= step ? i : acc), 0);

  return (
    <article
      id={project.id}
      aria-labelledby={`${project.id}-title`}
      className={pinned ? "flex h-full w-screen shrink-0 items-center pb-16 pt-(--nav-h)" : ""}
    >
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <motion.div className="min-w-0 lg:col-span-6 xl:col-span-5" style={pinned ? { x: textX } : undefined}>
          <p className="label mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="rounded-full border border-sodium/50 px-2.5 py-1 text-sodium">Real-world</span>
            <span className="tabular-nums">0{n} / 0{realWorld.length}</span>
            <span aria-hidden className="h-px w-6 bg-line-strong" />
            {project.kind}
          </p>
          <h3 id={`${project.id}-title`} className="display text-[clamp(2.1rem,min(3.4vw,6.4svh),3.75rem)] leading-[0.95]">
            {project.title}
          </h3>
          <p className="mt-3 font-serif text-[clamp(1.25rem,1.7vw,1.6rem)] italic leading-tight text-fg/85">{project.headline}</p>

          {/* only the part of the story the diagram is showing is open; the rest stay
              collapsed (but still in the page for screen readers) */}
          <ol className="mt-6">
            {project.sections.map((s, i) => (
              <li
                key={s.label}
                className={`border-l py-2 pl-4 transition-colors duration-500 ${i === current ? "border-sodium" : "border-line"}`}
              >
                <p className={`label ${i === current ? "text-sodium" : ""}`}>{s.label}</p>
                <div
                  className={`grid transition-[grid-template-rows] duration-700 ease-out-expo ${
                    !pinned || i === current ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <p className="overflow-hidden pt-1 text-sm leading-relaxed text-fg/90">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ul className="flex flex-wrap gap-2" aria-label="Technologies">
              {project.stack.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                  {t}
                </li>
              ))}
            </ul>
            {project.status && (
              <p className="flex items-center gap-2 text-sm">
                <span className="live-dot relative size-1.5 rounded-full bg-live text-live" aria-hidden />
                {project.status.label}
              </p>
            )}
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener"
                data-cursor="Open"
                className="group inline-flex items-center gap-2 border-b border-sodium/50 pb-1 text-sm transition-colors hover:border-sodium hover:text-sodium"
              >
                {l.label}
                <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.figure
          ref={figureRef}
          className="hairline-grid relative mx-auto w-full min-w-0 overflow-hidden rounded-md border border-line bg-ink-2 lg:col-span-6 xl:col-span-7 lg:max-w-[calc((100svh-21rem)*1.27)]"
          style={pinned ? { scale } : undefined}
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
            <span className="label truncate">{project.id}.system</span>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Diagram state">
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={i === step}
                  aria-label={s}
                  onClick={() => setStep(i)}
                  className="group grid h-6 place-items-center px-0.5"
                >
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-500 ease-out-expo ${
                      i === step ? "w-7 bg-sodium" : i < step ? "w-3.5 bg-fg/50" : "w-3.5 bg-fg/15 group-hover:bg-fg/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto px-3 py-3 [scrollbar-width:thin] sm:px-5 sm:py-4">
            <div className="min-w-[520px] sm:min-w-0">
              <Diagram step={step} onInspect={setInspect} />
            </div>
          </div>
          <figcaption className="flex min-h-[3.75rem] items-start gap-4 border-t border-line px-4 py-3" aria-live="polite">
            <span className="label mt-0.5 shrink-0 text-sodium">{inspect ? "Node" : `0${step + 1}`}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={inspect ? inspect.name : `s${step}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: ease.out }}
                className="text-sm leading-relaxed text-muted"
              >
                <span className="text-fg">{inspect ? inspect.name : STEPS[step]}</span>
                {" — "}
                {inspect ? (
                  inspect.detail
                ) : (
                  <>
                    <span className="pointer-coarse:hidden">hover a node to inspect it.</span>
                    <span className="hidden pointer-coarse:inline">tap a node to inspect it.</span>
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </figcaption>
        </motion.figure>
      </div>
    </article>
  );
}

/* 01 / 02 ━━━━━○──── at the bottom of the pinned track */
function Progress({ progress }: { progress: MotionValue<number> }) {
  const [n, setN] = useState(1);
  useMotionValueEvent(progress, "change", (v) => setN(v < 0.58 ? 1 : 2));
  const knob = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div className="container-x pointer-events-none absolute inset-x-0 bottom-8 flex items-center gap-5">
      <span className="label tabular-nums text-fg">
        0{n} <span className="text-dim">/ 0{realWorld.length}</span>
      </span>
      <span className="relative block h-px w-[min(36vw,420px)] bg-line-strong">
        <motion.span className="absolute inset-y-0 left-0 bg-sodium" style={{ width: knob }} />
        <motion.span
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sodium bg-ink"
          style={{ left: knob }}
        />
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={n}
          className="label"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          {realWorld[n - 1].title}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
