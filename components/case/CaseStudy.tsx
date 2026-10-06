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
import type { Work } from "@/lib/content";
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
  A case study, read top to bottom. The chapters scroll normally on the
  left; on wide screens the system diagram stays beside them and is built
  chapter by chapter — the scroll position between two chapters is the
  diagram's progress between their two states.
*/

const stages: Record<Work["id"], { Stage: ComponentType<StageProps>; end: number }> = {
  "lh-management": { Stage: LhStage, end: LH.BUILT + 0.03 },
  "dental-clinic": { Stage: DentalStage, end: 1 },
};

const flows: Record<Work["id"], FlowRow[]> = {
  "lh-management": [
    { kind: "node", label: "Web form", sub: "data entry" },
    { kind: "node", label: "SQL Server", sub: "T-SQL · procedures · triggers", accent: true },
    { kind: "grid", caption: "10+ entities · referential integrity", items: ["Players", "Clubs", "Leagues", "Contracts", "Agents", "Transfers"] },
  ],
  "dental-clinic": [
    { kind: "node", label: "Clinic website", sub: "HTML5 · CSS3" },
    { kind: "node", label: "Appointment", sub: "booked" },
    { kind: "node", label: "Webhook", sub: "event in" },
    { kind: "pair", left: { label: "n8n", sub: "workflows" }, right: { label: "LLM", sub: "integration" } },
    { kind: "node", label: "WhatsApp Business API", sub: "messages" },
    { kind: "node", label: "Patient", sub: "in production · Linux VPS", accent: true },
  ],
};

export function CaseStudy({ work, next }: { work: Work; next: Work }) {
  const wide = useMedia("(min-width: 1024px)");
  const reduce = useCalm();
  const { Stage, end } = stages[work.id];
  const n = work.chapters.length;

  const chaptersRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: chaptersRef, offset: ["start 0.6", "end 0.6"] });
  // chapter i sits at the middle of its slice of the scroll: piecewise-linear between their states
  const stops = [0, ...work.chapters.map((_, i) => (i + 0.5) / n), 1];
  const values = [Math.max(0, work.chapters[0].at - 0.07), ...work.chapters.map((c) => c.at), end];
  const scrolled = useTransform(scrollYProgress, stops, values);
  const fixed = useMotionValue(end);
  const p = reduce ? fixed : scrolled;

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (t) => {
    const next = Math.min(n - 1, Math.max(0, Math.floor(t * n)));
    if (next !== active) setActive(next);
  });

  // header: the big index drifts and the title block lifts away as you start reading
  const headRef = useRef<HTMLElement>(null);
  const { scrollYProgress: headOut } = useScroll({ target: headRef, offset: ["start start", "end start"] });
  const indexY = useTransform(headOut, [0, 1], ["0%", "40%"]);
  const headY = useTransform(headOut, [0, 1], ["0%", "-12%"]);
  const headFade = useTransform(headOut, [0, 0.8], [1, 0.2]);

  return (
    <article aria-labelledby="case-title">
      <header ref={headRef} className="relative overflow-hidden">
        <motion.span
          aria-hidden
          className="display text-outline pointer-events-none absolute -right-[2vw] top-[12svh] select-none text-[clamp(12rem,34vw,34rem)] leading-none"
          style={reduce ? undefined : { y: indexY }}
        >
          {work.index}
        </motion.span>
        <motion.div
          className="container-x relative flex min-h-[92svh] flex-col justify-end pb-[10svh] pt-[calc(var(--nav-h)+8svh)]"
          style={reduce ? undefined : { y: headY, opacity: headFade }}
        >
          <Link href="/#work" className="label group mb-auto inline-flex w-fit items-center gap-2 text-fg">
            <ArrowRight className="rotate-180 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
            Back to work
          </Link>

          <p className="label mb-6 mt-16 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-sodium/50 px-2.5 py-1 text-sodium">{work.label}</span>
            <span>{work.period}</span>
          </p>
          <h1 id="case-title" className="display text-[clamp(3.25rem,10vw,10.5rem)] leading-[0.86]">
            <MaskLines trigger="mount" delay={0.15} lines={[work.title]} />
          </h1>
          <p className="label mt-4">{work.fullTitle}</p>
          <motion.p
            className="mt-8 max-w-[58ch] text-lg leading-relaxed md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.45 }}
          >
            {work.intro}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.7 }}
          >
            {work.status && (
              <p className="flex items-center gap-2.5 text-sm">
                <span className={`relative size-1.5 rounded-full ${work.status.live ? "live-dot bg-live text-live" : "bg-sodium"}`} aria-hidden />
                {work.status.label}
              </p>
            )}
            <ul className="flex flex-wrap gap-2" aria-label="Technologies">
              {work.stack.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </header>

      <div ref={chaptersRef} className="container-x grid lg:grid-cols-12 lg:gap-x-14">
        <div className="min-w-0 lg:col-span-5">
          {!wide && <MobileCaseFlow work={work} reduce={reduce} />}
          <ol>
            {work.chapters.map((c, i) => {
              const on = !wide || i === active;
              return (
                <li key={c.label} className="flex min-h-0 flex-col justify-center border-t border-line py-14 lg:min-h-[78svh] lg:border-t-0 lg:py-0">
                  <Reveal>
                    <p className={`label mb-5 flex items-center gap-4 transition-colors duration-500 ${on ? "text-sodium" : ""}`}>
                      <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span aria-hidden className={`h-px transition-all duration-700 ease-out-expo ${on ? "w-12 bg-sodium" : "w-6 bg-line-strong"}`} />
                      {c.label}
                    </p>
                    <h2 className={`display text-[clamp(2rem,3.6vw,3.5rem)] leading-[0.98] transition-colors duration-500 ${on ? "text-fg" : "text-muted"}`}>
                      {c.title}
                    </h2>
                    <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-muted">{c.body}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        {wide && (
          <div className="lg:col-span-7">
            <CaseStage work={work} Stage={Stage} p={p} still={reduce} />
          </div>
        )}
      </div>

      <NextCase work={work} next={next} />
    </article>
  );
}

function CaseStage({ work, Stage, p, still }: { work: Work; Stage: ComponentType<StageProps>; p: MotionValue<number>; still: boolean }) {
  const [inspect, setInspect] = useState<Inspect>(null);
  return (
    <div className="sticky top-(--nav-h) flex h-[calc(100svh-var(--nav-h))] items-center justify-center">
      <figure className="relative w-full max-w-[calc((100svh-var(--nav-h)-8rem)*560/460)]">
        <div aria-hidden className="hairline-grid absolute inset-[-6%] [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_72%)]" />
        <div className="relative aspect-[560/460]">
          <Stage p={p} onInspect={setInspect} still={still} />
        </div>
        <figcaption className="absolute -bottom-10 left-0 right-0 flex items-baseline gap-3 text-sm" aria-live="polite">
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
      </figure>
    </div>
  );
}

function MobileCaseFlow({ work, reduce }: { work: Work; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });
  const fixed = useMotionValue(1);
  return (
    <div ref={ref} className="mb-6 rounded-md border border-line bg-ink-2/50 p-4">
      <p className="label mb-4">{work.id}.system</p>
      <MobileFlow rows={flows[work.id]} p={reduce ? fixed : scrollYProgress} label={`${work.title} system diagram`} />
    </div>
  );
}

/* The end of a case leads into the next one: same thread, next system. */
function NextCase({ work, next }: { work: Work; next: Work }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useCalm();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.4"] });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="container-x pb-24 pt-[12vh]">
      <div className="flex justify-center">
        <motion.span aria-hidden className="block h-[16vh] w-[1.25px] origin-top bg-sodium" style={{ scaleY: reduce ? 1 : line }} />
      </div>
      <div className="mt-10 grid gap-10 border-t border-line pt-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="label mb-5">Next case · {next.index}</p>
          <Link href={`/work/${next.id}`} className="group block" data-cursor="Next">
            <span className="display block text-[clamp(3rem,8vw,8.5rem)] leading-[0.88] transition-colors duration-500 group-hover:text-sodium">
              {next.title}
            </span>
            <span className="mt-4 inline-flex items-center gap-2 text-muted transition-colors group-hover:text-fg">
              {next.label}
              <ArrowRight className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
        <div className="flex flex-col gap-4 md:col-span-4 md:items-end">
          {work.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener" className="group inline-flex items-center gap-2 border-b border-sodium/50 pb-1 text-sm transition-colors hover:border-sodium hover:text-sodium">
              {l.label}
              <ArrowUpRight />
            </a>
          ))}
          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
            Personal projects <ArrowRight />
          </Link>
          <Link href="/#contact" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
            Contact <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
