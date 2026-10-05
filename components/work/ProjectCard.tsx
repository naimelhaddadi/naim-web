"use client";

import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
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
  wide?: boolean;
};

/*
  A project card. On hover the card tilts a little towards the pointer,
  the diagram drifts with it and plays its story. Touch screens have no
  hover, so there the diagram plays when the card is on screen.
*/
export function ProjectCard({ project, Visual, onOpen, wide }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);
  const touch = useMedia("(hover: none)");
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.55 });
  const active = hover || (touch && inView);

  const px = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const py = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const tiltX = useTransform(py, [-0.5, 0.5], [2, -2]);
  const tiltY = useTransform(px, [-0.5, 0.5], [-2.5, 2.5]);
  const driftX = useTransform(px, [-0.5, 0.5], [-12, 12]);
  const driftY = useTransform(py, [-0.5, 0.5], [-8, 8]);

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
      style={reduce ? undefined : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1400 }}
      className={`group/card relative grid h-full overflow-hidden rounded-md border bg-ink-2/70 transition-[border-color,box-shadow] duration-700 ${
        active ? "border-line-strong shadow-[0_50px_90px_-50px_rgba(0,0,0,0.95)]" : "border-line"
      } ${wide ? "lg:grid-cols-12" : "grid-rows-[auto_1fr]"}`}
    >
      {/* Diagram */}
      <div
        className={`hairline-grid relative min-h-0 overflow-hidden border-line bg-ink-2 ${
          wide ? "h-[clamp(14rem,40vw,20rem)] border-b lg:order-2 lg:col-span-7 lg:h-auto lg:min-h-[20rem] lg:border-b-0 lg:border-l" : "h-[clamp(15rem,24vw,20rem)] border-b"
        }`}
      >
        <motion.div
          className="absolute inset-0 p-4 sm:p-6"
          style={reduce ? undefined : { x: driftX, y: driftY }}
          animate={{ scale: active ? 1.03 : 1 }}
          transition={{ duration: 0.9, ease: ease.out }}
        >
          <Visual active={active} />
        </motion.div>
        <p className="label absolute left-4 top-4 text-sodium sm:left-5">{project.index}</p>
        {project.status && (
          <p className="absolute right-4 top-4 flex items-center gap-2 text-xs text-muted sm:right-5">
            <span className={`relative size-1.5 rounded-full ${project.status.live ? "live-dot bg-live text-live" : "bg-sodium"}`} aria-hidden />
            {project.status.label}
          </p>
        )}
      </div>

      {/* Text */}
      <div className={`flex min-w-0 flex-col gap-5 p-6 md:p-8 ${wide ? "lg:order-1 lg:col-span-5" : ""}`}>
        <p className="label">{project.kind}</p>
        <div>
          <h3 id={`${project.id}-title`} className="display text-[clamp(1.9rem,2.9vw,3rem)] leading-[0.95]">
            {project.title}
          </h3>
          <p className="mt-3 font-serif text-[clamp(1.3rem,1.8vw,1.65rem)] italic leading-tight text-fg/85">{project.headline}</p>
        </div>
        <p className="max-w-[48ch] text-muted">{project.summary}</p>

        <ul className="flex flex-wrap gap-2" aria-label="Technologies">
          {project.stack.slice(0, wide ? 6 : 4).map((t, i) => (
            <motion.li
              key={t}
              initial={false}
              animate={{ y: active ? -2 : 0 }}
              transition={{ duration: 0.4, ease: ease.out, delay: active ? i * 0.04 : 0 }}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors duration-500 ${
                active ? "border-line-strong text-fg" : "border-line text-muted"
              }`}
            >
              {t}
            </motion.li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-3">
          {/* the ::after stretches over the whole card, so clicking anywhere opens the case */}
          <button
            type="button"
            onClick={(e) => onOpen(e.currentTarget)}
            aria-haspopup="dialog"
            data-cursor="View"
            className="group/btn inline-flex items-center gap-2 border-b border-sodium/50 pb-1 text-sm font-medium transition-colors after:absolute after:inset-0 after:content-[''] hover:border-sodium hover:text-sodium"
          >
            View case
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
              Code
              <ArrowUpRight />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
