"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import type { CaseStudy as CaseStudyData } from "@/lib/content";
import type { DiagramProps, Inspect } from "@/components/diagrams/primitives";
import { MaskLines } from "@/components/ui/MaskLines";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/Icons";
import { ease } from "@/lib/motion";

type Props = { study: CaseStudyData; Diagram: ComponentType<DiagramProps> };

/*
  A case study told as four steps. On desktop the diagram is pinned beside
  the story and changes state as each step reaches the middle of the
  viewport. On small screens the diagram plays through its states once
  when it scrolls into view, and the step tabs let you scrub it by hand.
*/
export function CaseStudy({ study, Diagram }: Props) {
  const [step, setStep] = useState(0);
  const [inspect, setInspect] = useState<Inspect>(null);
  const [manual, setManual] = useState(false);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelInView = useInView(panelRef, { once: true, amount: 0.5 });

  // Desktop: follow the step in the middle of the viewport.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    if (!wide.matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Small screens: play through once when the diagram appears.
  useEffect(() => {
    if (!panelInView || manual || window.matchMedia("(min-width: 1024px)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ids = reduce
      ? [window.setTimeout(() => setStep(study.story.length - 1), 0)]
      : study.story.map((_, i) => window.setTimeout(() => setStep(i), 300 + i * 1900));
    return () => ids.forEach(window.clearTimeout);
  }, [panelInView, manual, study.story]);

  const current = study.story[step];

  return (
    <article id={study.id} aria-labelledby={`${study.id}-title`} className="border-t border-line pt-10 md:pt-14">
      {/* Header */}
      <header className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="label mb-6 flex items-center gap-3">
            <span className="text-sodium">{study.index}</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden />
            Case study
          </p>
          <h3 id={`${study.id}-title`} className="display text-[clamp(2.25rem,5.4vw,5.5rem)]">
            <MaskLines lines={[study.title]} />
          </h3>
          <Reveal delay={0.15}>
            <p className="mt-5 font-serif text-[clamp(1.4rem,2.2vw,2rem)] italic leading-tight text-muted">{study.kicker}</p>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="lg:col-span-4 lg:pt-14">
          <dl className="divide-y divide-line border-y border-line text-sm">
            {study.meta.map((m) => (
              <div key={m.label} className="flex items-baseline justify-between gap-6 py-3">
                <dt className="label">{m.label}</dt>
                <dd className="text-right">{m.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 flex items-center gap-2.5 text-sm">
            {study.status.live ? (
              <span className="live-dot relative size-1.5 rounded-full bg-live text-live" aria-hidden />
            ) : (
              <span className="size-1.5 rounded-full bg-sodium" aria-hidden />
            )}
            {study.status.label}
          </p>
        </Reveal>
      </header>

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        {/* Diagram panel */}
        <div className="min-w-0 lg:order-2 lg:col-span-7">
          <div ref={panelRef} className="lg:sticky lg:top-[calc(var(--nav-h)+3vh)]">
            <Reveal>
              <figure
                data-cursor="Inspect"
                className="hairline-grid relative overflow-hidden rounded-md border border-line bg-ink-2"
              >
                <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
                  <span className="label truncate">{study.id}.system</span>
                  <div className="flex items-center gap-1.5" role="tablist" aria-label="Diagram state">
                    {study.story.map((s, i) => (
                      <button
                        key={s.label}
                        type="button"
                        role="tab"
                        aria-selected={i === step}
                        aria-label={s.label}
                        onClick={() => {
                          setManual(true);
                          setStep(i);
                          if (window.matchMedia("(min-width: 1024px)").matches) {
                            stepRefs.current[i]?.scrollIntoView({ block: "center", behavior: "smooth" });
                          }
                        }}
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
                <div className="overflow-x-auto px-3 py-4 [scrollbar-width:thin] sm:px-6 sm:py-6">
                  <div className="min-w-[520px] sm:min-w-0">
                    <Diagram step={step} onInspect={setInspect} />
                  </div>
                </div>
                <figcaption className="flex min-h-[4.75rem] items-start gap-4 border-t border-line px-4 py-3.5" aria-live="polite">
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
                      <span className="text-fg">{inspect ? inspect.name : current.label}</span>
                      {" — "}
                      {inspect ? (
                        inspect.detail
                      ) : (
                        <>
                          <span className="pointer-coarse:hidden">Hover or focus a node to inspect it.</span>
                          <span className="hidden pointer-coarse:inline">Tap a node to inspect it.</span>
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        {/* Story */}
        <ol className="relative min-w-0 lg:order-1 lg:col-span-5">
          <span aria-hidden className="absolute bottom-0 left-0 top-0 hidden w-px bg-line lg:block" />
          {study.story.map((s, i) => (
            <li
              key={s.label}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-step={i}
              className="relative pb-12 lg:py-[16vh] lg:pl-10 lg:first:pt-4"
            >
              <span
                aria-hidden
                className={`absolute left-[-3px] top-[calc(16vh+0.35rem)] hidden size-[7px] rounded-full transition-colors duration-500 lg:block ${
                  i <= step ? "bg-sodium" : "bg-ink-3 ring-1 ring-line-strong"
                } ${i === 0 ? "lg:top-[1.4rem]" : ""}`}
              />
              <Reveal>
                <p className="label mb-4 flex items-center gap-3">
                  <span className="tabular-nums text-sodium">0{i + 1}</span>
                  {s.label}
                </p>
                <h4
                  className={`font-display text-[clamp(1.5rem,2.3vw,2.25rem)] font-medium leading-[1.1] tracking-tight transition-colors duration-700 ${
                    i === step ? "text-fg" : "lg:text-muted"
                  }`}
                >
                  {s.title}
                </h4>
                <p className="mt-4 max-w-[46ch] text-muted">{s.body}</p>
              </Reveal>
            </li>
          ))}
          <li className="lg:pl-10">
            <Reveal>
              <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                {study.stack.map((t) => (
                  <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
              {study.link && (
                <a
                  href={study.link.href}
                  target="_blank"
                  rel="noopener"
                  data-cursor="Open"
                  className="group mt-8 inline-flex items-center gap-2 border-b border-sodium/50 pb-1 text-sm transition-colors hover:border-sodium hover:text-sodium"
                >
                  {study.link.label}
                  <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </Reveal>
          </li>
        </ol>
      </div>
    </article>
  );
}
