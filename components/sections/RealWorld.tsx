"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState, type ComponentType } from "react";
import { realWorld, type Work } from "@/lib/content";
import type { Inspect } from "@/components/diagrams/primitives";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { MaskLines } from "@/components/ui/MaskLines";
import { Reveal } from "@/components/ui/Reveal";
import { DentalStage } from "@/components/work/DentalStage";
import { LH, LhStage } from "@/components/work/LhStage";
import { MobileFlow, type FlowRow } from "@/components/work/MobileFlow";
import type { StageProps } from "@/components/work/stage";
import { ease } from "@/lib/motion";
import { useMedia } from "@/lib/useMedia";
import { useCalm } from "@/lib/useCalm";

/*
  Real-world work, in plain vertical scroll. Each project is a story on the
  left and, on wide screens, a diagram that stays in view on the right and
  builds itself as the story is read.

  The two projects are one continuous line: LH's diagram folds into a
  single point at the end, a thread runs down from it through the gap
  between the projects, and the clinic's diagram grows out of that same
  thread. On phones the diagrams become simple columns that build as they
  scroll past.
*/

const stages: Record<Work["id"], { Stage: ComponentType<StageProps>; range: [number, number]; still: number }> = {
  // the home page skips LH's "problem" phase; the case study shows it
  "lh-management": { Stage: LhStage, range: [0.14, 1], still: LH.BUILT },
  "dental-clinic": { Stage: DentalStage, range: [0, 1], still: 1 },
};

const flows: Record<Work["id"], FlowRow[]> = {
  "lh-management": [
    { kind: "node", label: "Web form", sub: "data entry" },
    { kind: "node", label: "SQL Server", sub: "T-SQL · procedures · triggers", accent: true },
    { kind: "grid", caption: "10+ entities", items: ["Players", "Clubs", "Leagues", "Contracts", "Agents", "Transfers"] },
  ],
  "dental-clinic": [
    { kind: "node", label: "Appointment", sub: "booked" },
    { kind: "node", label: "Webhook", sub: "event in" },
    { kind: "pair", left: { label: "n8n", sub: "workflows" }, right: { label: "LLM", sub: "integration" } },
    { kind: "node", label: "WhatsApp Business API", sub: "messages" },
    { kind: "node", label: "Patient", sub: "in production", accent: true },
  ],
};

export function RealWorld() {
  const wide = useMedia("(min-width: 1024px)");
  const reduce = useCalm();

  return (
    <section id="work" aria-labelledby="work-title" className="relative pt-[var(--section-y)]">
      <div className="container-x">
        <p className="label mb-8 flex items-center gap-3">
          <span className="text-sodium">(02)</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          Real-world work
        </p>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="work-title" className="display text-[clamp(3rem,8.4vw,9.25rem)] leading-[0.86] lg:col-span-8">
            <MaskLines lines={["Real-world", "work."]} />
          </h2>
          <Reveal className="lg:col-span-4 lg:pb-3">
            <p className="max-w-[30ch] text-lg text-muted">Software built for problems outside the classroom.</p>
          </Reveal>
        </div>
      </div>

      {realWorld.map((work, i) => (
        <div key={work.id}>
          <Story work={work} wide={wide} reduce={reduce} thread={{ in: i > 0, out: i < realWorld.length - 1 }} />
          {i < realWorld.length - 1 && <Bridge wide={wide} reduce={reduce} />}
        </div>
      ))}
    </section>
  );
}

type Thread = { in: boolean; out: boolean };

function Story({ work, wide, reduce, thread }: { work: Work; wide: boolean; reduce: boolean; thread: Thread }) {
  const ref = useRef<HTMLElement>(null);
  const { Stage, range, still } = stages[work.id];

  // the article's own scroll → the diagram's build (p)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.55", "end end"] });
  // the incoming thread draws while the article arrives, so it meets the bridge above it
  const { scrollYProgress: arrive } = useScroll({ target: ref, offset: ["start end", "start 0.5"] });
  const scrolled = useTransform(scrollYProgress, [0, 1], range);
  const fixed = useMotionValue(still);
  const p = reduce ? fixed : scrolled;

  // which part of the story the diagram is showing
  const [active, setActive] = useState(0);
  const pick = (v: number) => work.story.reduce((acc, s, i) => (v >= s.at - 0.04 ? i : acc), 0);
  useMotionValueEvent(p, "change", (v) => {
    const next = pick(v);
    if (next !== active) setActive(next);
  });

  return (
    <article ref={ref} id={work.id} aria-labelledby={`${work.id}-title`} className="container-x relative grid lg:grid-cols-12 lg:gap-x-14">
      <div className="min-w-0 pt-24 lg:col-span-5 lg:pt-[14vh]">
        <Header work={work} />

        {!wide && (
          <MobileDiagram work={work} reduce={reduce} />
        )}

        <ol className="relative mt-12 lg:mt-[10vh]">
          <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line" />
          {work.story.map((s, i) => {
            const on = !wide || reduce || i === active;
            return (
              <li key={s.label} className="relative py-6 pl-7 lg:py-[11vh]">
                <span
                  aria-hidden
                  className={`absolute left-[-3px] top-[calc(1.5rem+0.3rem)] size-[7px] rounded-full transition-colors duration-500 lg:top-[calc(11vh+0.3rem)] ${
                    on || (wide && i < active) ? "bg-sodium" : "bg-ink-3 ring-1 ring-line-strong"
                  }`}
                />
                <p className={`label mb-3 transition-colors duration-500 ${on ? "text-sodium" : ""}`}>{s.label}</p>
                <h4 className={`font-display text-[clamp(1.4rem,2vw,2rem)] font-medium leading-[1.12] tracking-tight transition-colors duration-500 ${on ? "text-fg" : "text-muted"}`}>
                  {s.title}
                </h4>
                <p className="mt-3 max-w-[44ch] text-muted">{s.body}</p>
              </li>
            );
          })}
        </ol>
        <div className="pb-8 lg:pb-[18vh]" />
      </div>

      {wide && (
        <div className="lg:col-span-7">
          <StickyStage work={work} Stage={Stage} p={p} reduce={reduce} thread={thread} progress={scrollYProgress} arrive={arrive} />
        </div>
      )}
    </article>
  );
}

function Header({ work }: { work: Work }) {
  return (
    <header>
      <div className="flex items-end gap-5">
        <span aria-hidden className="display text-outline text-[clamp(4.5rem,8vw,8rem)] leading-[0.8]">
          {work.index}
        </span>
        <p className="label flex flex-col gap-2 pb-1">
          <span className="w-fit rounded-full border border-sodium/50 px-2.5 py-1 text-sodium">{work.label}</span>
          <span>{work.period}</span>
        </p>
      </div>
      <h3 id={`${work.id}-title`} className="display mt-8 text-[clamp(2.6rem,4.6vw,4.75rem)] leading-[0.92]">
        <MaskLines lines={[work.title]} />
      </h3>
      <p className="label mt-3">{work.fullTitle}</p>
      <p className="mt-6 max-w-[46ch] text-lg leading-relaxed">{work.intro}</p>

      {work.status && (
        <p className="mt-5 flex items-center gap-2.5 text-sm">
          <span className={`relative size-1.5 rounded-full ${work.status.live ? "live-dot bg-live text-live" : "bg-sodium"}`} aria-hidden />
          {work.status.label}
        </p>
      )}

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
        {work.stack.map((t) => (
          <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link
          href={`/work/${work.id}`}
          data-cursor="Case"
          className="group inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-500 hover:bg-sodium"
        >
          View case
          <ArrowRight className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </Link>
        {work.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2 border-b border-sodium/50 pb-1 text-sm transition-colors hover:border-sodium hover:text-sodium"
          >
            {l.label}
            <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ))}
      </div>
    </header>
  );
}

/*
  The diagram column: [thread in] [diagram] [thread out], stacked so the
  incoming and outgoing threads sit exactly on the diagram's centre line.
*/
function StickyStage({
  work,
  Stage,
  p,
  reduce,
  thread,
  progress,
  arrive,
}: {
  work: Work;
  Stage: ComponentType<StageProps>;
  p: MotionValue<number>;
  reduce: boolean;
  thread: Thread;
  progress: MotionValue<number>;
  arrive: MotionValue<number>;
}) {
  const [inspect, setInspect] = useState<Inspect>(null);
  const threadIn = arrive;
  const threadOut = useTransform(progress, [0.9, 1], [0, 1]);
  const entrance = useTransform(progress, [0, 0.12], [0.94, 1]);
  // when the diagram folds away, its grid goes with it
  const grid = useTransform(progress, [0.82, 0.95], [1, thread.out ? 0 : 1]);

  return (
    <div className="sticky top-(--nav-h) flex h-[calc(100svh-var(--nav-h))] flex-col items-center">
      <div className="flex w-full flex-1 justify-center">
        {thread.in && <motion.span aria-hidden className="block h-full w-[1.25px] origin-top bg-sodium" style={{ scaleY: reduce ? 1 : threadIn }} />}
      </div>

      <motion.figure
        className="relative w-full max-w-[calc((100svh-var(--nav-h)-9rem)*560/460)]"
        style={reduce ? undefined : { scale: entrance }}
      >
        {/* soft grid that fades out at the edges, no hard frame */}
        <motion.div
          aria-hidden
          className="hairline-grid absolute inset-[-6%] [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_72%)]"
          style={reduce ? undefined : { opacity: grid }}
        />
        <div className="relative aspect-[560/460]">
          <Stage p={p} onInspect={setInspect} still={reduce} />
        </div>
        <figcaption className="absolute -top-9 left-0 right-0 flex items-baseline gap-3 text-sm" aria-live="polite">
          <span className="label shrink-0">{work.id}.system</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={inspect?.name ?? "hint"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: ease.out }}
              className="truncate text-muted"
            >
              {inspect ? (
                <>
                  <span className="text-fg">{inspect.name}</span> — {inspect.detail}
                </>
              ) : (
                "hover a node to inspect it"
              )}
            </motion.span>
          </AnimatePresence>
        </figcaption>
      </motion.figure>

      <div className="flex w-full flex-1 justify-center">
        {thread.out && <motion.span aria-hidden className="block h-full w-[1.25px] origin-top bg-sodium" style={{ scaleY: reduce ? 1 : threadOut }} />}
      </div>
    </div>
  );
}

/* The gap between the two projects: the thread keeps going. */
function Bridge({ wide, reduce }: { wide: boolean; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "end 0.6"] });
  return (
    <div ref={ref} aria-hidden className="container-x grid h-[22vh] lg:grid-cols-12 lg:gap-x-14">
      <div className={wide ? "flex justify-center lg:col-span-7 lg:col-start-6" : "flex justify-start"}>
        <motion.span className="block h-full w-[1.25px] origin-top bg-sodium" style={{ scaleY: reduce ? 1 : scrollYProgress }} />
      </div>
    </div>
  );
}

function MobileDiagram({ work, reduce }: { work: Work; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });
  const fixed = useMotionValue(1);
  return (
    <div ref={ref} className="mt-12">
      <p className="label mb-4">{work.id}.system</p>
      <MobileFlow rows={flows[work.id]} p={reduce ? fixed : scrollYProgress} label={`${work.title} system diagram`} />
    </div>
  );
}
