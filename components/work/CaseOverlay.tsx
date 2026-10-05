"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/content";
import type { Inspect } from "@/components/diagrams/primitives";
import { DentalDiagram } from "@/components/diagrams/DentalDiagram";
import { LhDiagram } from "@/components/diagrams/LhDiagram";
import { ArrowUpRight } from "@/components/ui/Icons";
import { ease } from "@/lib/motion";
import { smooth } from "@/lib/scroll";
import { RequestTracer } from "./RequestTracer";
import { visuals } from "./Visuals";

const noop = () => () => {};

type Props = { project: Project | null; onClose: () => void; returnFocus: RefObject<HTMLElement | null> };

/*
  "View case": the full story of one project over the page. While it's
  open the rest of the page is inert (no focus, no clicks, no scroll), and
  closing it puts the focus back on the button that opened it.
*/
export function CaseOverlay({ project, onClose, returnFocus }: Props) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const rootRef = useRef<HTMLDivElement>(null);
  const open = project !== null;

  useEffect(() => {
    if (!open) return;
    const opener = returnFocus.current;
    const others = [...document.body.children].filter((el) => el !== rootRef.current) as HTMLElement[];
    others.forEach((el) => (el.inert = true));
    document.documentElement.style.overflow = "hidden";
    smooth.lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    return () => {
      others.forEach((el) => (el.inert = false));
      document.documentElement.style.overflow = "";
      smooth.lenis?.start();
      window.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [open, onClose, returnFocus]);

  if (!mounted) return null;

  return createPortal(
    <div ref={rootRef}>
      <AnimatePresence>{project && <Panel key={project.id} project={project} onClose={onClose} />}</AnimatePresence>
    </div>,
    document.body,
  );
}

function Panel({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [current, setCurrent] = useState(0);
  const [manual, setManual] = useState(false);
  const [inspect, setInspect] = useState<Inspect>(null);
  // only the two case studies have a diagram that changes state step by step
  const hasSteps = project.id === "lh-sport" || project.id === "dental";
  const Visual = visuals[project.id];
  const step = project.sections[current].step;

  useEffect(() => closeRef.current?.focus(), []);

  // play the story through once the panel has opened, until the reader takes over
  useEffect(() => {
    if (!hasSteps || manual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setCurrent(project.sections.length - 1), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setInterval(() => setCurrent((c) => (c + 1) % project.sections.length), 3600);
    return () => window.clearInterval(id);
  }, [hasSteps, manual, project.sections.length]);

  function pick(i: number) {
    setManual(true);
    setCurrent(i);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center lg:items-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-ink/85"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${project.id}-case-title`}
        data-lenis-prevent
        className="relative flex h-[94svh] w-full max-w-[1240px] flex-col overflow-hidden rounded-t-xl border border-line-strong bg-ink-2 lg:mx-(--gutter) lg:h-[88svh] lg:rounded-xl"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.7, ease: ease.out }}
      >
        <header className="flex items-center justify-between gap-6 border-b border-line px-6 py-4 md:px-10">
          <p className="label flex items-center gap-3">
            <span className="text-sodium">{project.index}</span>
            <span aria-hidden className="h-px w-6 bg-line-strong" />
            {project.kind}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="label flex items-center gap-3 rounded-full border border-line px-4 py-2 text-fg transition-colors hover:border-fg/60"
          >
            Close
            <span aria-hidden className="text-dim pointer-coarse:hidden">Esc</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-6 pb-12 pt-7 md:px-10 md:pt-9">
            <h2 id={`${project.id}-case-title`} className="display max-w-[30ch] text-[clamp(1.9rem,3.4vw,3.25rem)] leading-[0.98]">
              {project.title}
            </h2>
            <p className="mt-3 font-serif text-[clamp(1.25rem,1.9vw,1.75rem)] italic leading-tight text-muted">{project.headline}</p>
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-5 text-sm">
              {project.meta.map((m) => (
                <div key={m.label} className="flex items-baseline gap-3">
                  <dt className="label">{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
              {project.status && (
                <div className="flex items-center gap-2.5">
                  <dt className="sr-only">Status</dt>
                  <span className="live-dot relative size-1.5 rounded-full bg-live text-live" aria-hidden />
                  <dd>{project.status.label}</dd>
                </div>
              )}
            </dl>

            <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-14">
              {/* Story */}
              <div className="min-w-0 lg:col-span-5">
                <ol className="space-y-2">
                  {project.sections.map((s, i) => {
                    const on = hasSteps && i === current;
                    return (
                      <li key={s.label}>
                        <button
                          type="button"
                          disabled={!hasSteps}
                          aria-pressed={hasSteps ? on : undefined}
                          onClick={() => pick(i)}
                          onMouseEnter={() => hasSteps && pick(i)}
                          className={`block w-full border-l py-3 pl-5 text-left transition-colors duration-500 disabled:cursor-auto ${
                            on ? "border-sodium" : "border-line hover:border-line-strong"
                          }`}
                        >
                          <span className={`label block ${on ? "text-sodium" : ""}`}>{s.label}</span>
                          <span className={`mt-2 block leading-relaxed transition-colors duration-500 ${on || !hasSteps ? "text-fg" : "text-muted"}`}>
                            {s.body}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-10 border-l border-line pl-5">
                  <p className="label">Technology</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((t) => (
                      <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {project.links.length > 0 && (
                  <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 pl-5">
                    {project.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener"
                          className="group inline-flex items-center gap-2 border-b border-sodium/50 pb-1 text-sm transition-colors hover:border-sodium hover:text-sodium"
                        >
                          {l.label}
                          <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* System */}
              <div className="min-w-0 lg:col-span-7">
                {project.endpoints && project.layers ? (
                  <RequestTracer endpoints={project.endpoints} layers={project.layers} label={project.title} />
                ) : !hasSteps ? (
                  <figure className="hairline-grid overflow-hidden rounded-md border border-line bg-ink p-4 sm:p-8">
                    <div className="aspect-[400/220]">
                      <Visual active />
                    </div>
                  </figure>
                ) : (
                  <figure className="hairline-grid overflow-hidden rounded-md border border-line bg-ink">
                    <div className="overflow-x-auto px-3 py-4 [scrollbar-width:thin] sm:px-6 sm:py-6">
                      <div className="min-w-[520px] sm:min-w-0">
                        {project.id === "lh-sport" ? (
                          <LhDiagram step={step} onInspect={setInspect} />
                        ) : (
                          <DentalDiagram step={step} onInspect={setInspect} />
                        )}
                      </div>
                    </div>
                    <figcaption className="flex min-h-[4.25rem] items-start gap-4 border-t border-line px-4 py-3.5" aria-live="polite">
                      <span className="label mt-0.5 shrink-0 text-sodium">{inspect ? "Node" : `0${current + 1}`}</span>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={inspect ? inspect.name : `s${current}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3, ease: ease.out }}
                          className="text-sm leading-relaxed text-muted"
                        >
                          <span className="text-fg">{inspect ? inspect.name : project.sections[current].label}</span>
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
                  </figure>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
