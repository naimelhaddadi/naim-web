"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { personal, type Project } from "@/lib/content";
import { site } from "@/lib/site";
import { useMedia } from "@/lib/useMedia";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseOverlay } from "@/components/work/CaseOverlay";
import { ProjectCard } from "@/components/work/ProjectCard";
import { visuals } from "@/components/work/Visuals";

/*
  Personal and academic projects: smaller than the real-world work, on
  purpose. On wide screens the three columns travel at different speeds
  while the section scrolls past.
*/
export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const openCase = useCallback((project: Project, button: HTMLElement) => {
    // remember which button opened it, to give it the focus back on close
    trigger.current = button;
    setOpen(project);
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const wide = useMedia("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const columns = [
    useTransform(scrollYProgress, [0, 1], [40, -40]),
    useTransform(scrollYProgress, [0, 1], [110, -60]),
    useTransform(scrollYProgress, [0, 1], [180, -80]),
  ];

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          index="03"
          label="Personal projects"
          id="projects-title"
          lines={["Personal projects."]}
          aside={
            <div className="space-y-4">
              <p className="max-w-xs text-lg">Experiments, APIs and projects built while learning.</p>
              <a
                href={site.github}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
              >
                All repositories
                <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          }
        />

        <div ref={ref} className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {personal.map((p, i) => {
            const Visual = visuals[p.id];
            if (!Visual) return null;
            return (
              <motion.div key={p.id} style={wide && !reduce ? { y: columns[i] } : undefined}>
                <ProjectCard project={p} Visual={Visual} onOpen={(b) => openCase(p, b)} />
              </motion.div>
            );
          })}
        </div>
      </div>

      <CaseOverlay project={open} onClose={close} returnFocus={trigger} />
    </section>
  );
}
