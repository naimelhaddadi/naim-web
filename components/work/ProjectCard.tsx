"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef, useState, type ComponentType } from "react";
import type { Project } from "@/lib/content";
import { ease } from "@/lib/motion";
import { useMedia } from "@/lib/useMedia";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import type { VisualProps } from "./Visuals";

type Props = {
  project: Project;
  Visual: ComponentType<VisualProps>;
  onOpen: (trigger: HTMLElement) => void;
};

/*
  A personal project tile. On hover the tile tilts a little towards the
  pointer, its diagram plays and the technical details slide in. Touch
  screens have no hover, so there it plays when the tile is on screen.
*/
export function ProjectCard({ project, Visual, onOpen }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);
  const touch = useMedia("(hover: none)");
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.55 });
  const active = hover || (touch && inView);

  const px = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const py = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const tiltX = useTransform(py, [-0.5, 0.5], [2.5, -2.5]);
  const tiltY = useTransform(px, [-0.5, 0.5], [-3, 3]);
  const driftX = useTransform(px, [-0.5, 0.5], [-10, 10]);
  const driftY = useTransform(py, [-0.5, 0.5], [-6, 6]);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onPointerLeave() {
    setHover(false);
    px.set(0);
    py.set(0);
  }

  const repo = project.links.find((l) => l.href.includes("github.com"));

  return (
    <motion.article
      ref={ref}
      aria-labelledby={`${project.id}-title`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={reduce ? undefined : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
      className={`group/card relative grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-md border bg-ink-2/70 transition-[border-color,box-shadow] duration-700 ${
        active ? "border-line-strong shadow-[0_50px_90px_-50px_rgba(0,0,0,0.95)]" : "border-line"
      }`}
    >
      {/* Diagram */}
      <div className="hairline-grid relative h-52 overflow-hidden border-b border-line bg-ink-2">
        <motion.div
          className="absolute inset-0 p-3 sm:p-4"
          style={reduce ? undefined : { x: driftX, y: driftY }}
          animate={{ scale: active ? 1.04 : 1 }}
          transition={{ duration: 0.9, ease: ease.out }}
        >
          <Visual active={active} />
        </motion.div>
        <p className="label absolute left-4 top-4 text-dim">{project.index}</p>
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-col gap-4 p-6">
        <p className="label">
          <span className="inline-block whitespace-nowrap rounded-full border border-line-strong px-2.5 py-1 text-[0.64rem] tracking-[0.1em]">{project.kind}</span>
        </p>
        <h3 id={`${project.id}-title`} className="display text-[clamp(1.6rem,2.1vw,2.15rem)] leading-[0.95]">
          {project.title}
        </h3>
        <p className="text-muted">{project.summary}</p>

        {/* the technologies by default, the technical details on hover */}
        <div className="relative min-h-[3.25rem]">
          <AnimatePresence mode="wait" initial={false}>
            {active ? (
              <motion.dl
                key="details"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: ease.out }}
                className="space-y-1 text-xs"
              >
                {project.meta.map((m) => (
                  <div key={m.label} className="flex gap-3">
                    <dt className="label w-24 shrink-0 text-[0.65rem]">{m.label}</dt>
                    <dd className="font-mono text-fg">{m.value}</dd>
                  </div>
                ))}
              </motion.dl>
            ) : (
              <motion.ul
                key="stack"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: ease.out }}
                className="flex flex-wrap gap-2"
                aria-label="Technologies"
              >
                {project.stack.slice(0, 4).map((t) => (
                  <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                    {t}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* the ::after stretches over the whole tile, so clicking anywhere opens the details */}
          <button
            type="button"
            onClick={(e) => onOpen(e.currentTarget)}
            aria-haspopup="dialog"
            data-cursor="View"
            className="inline-flex items-center gap-2 border-b border-sodium/50 pb-1 text-sm font-medium transition-colors after:absolute after:inset-0 after:content-[''] hover:border-sodium hover:text-sodium"
          >
            Details
            <ArrowRight className="transition-transform duration-500 ease-out-expo group-hover/card:translate-x-1" />
          </button>
          {repo && (
            <a
              href={repo.href}
              target="_blank"
              rel="noopener"
              data-cursor="GitHub"
              className="relative z-10 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
            >
              GitHub
              <ArrowUpRight />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
