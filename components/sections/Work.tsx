"use client";

import { useCallback, useRef, useState } from "react";
import { featured, more, type Project } from "@/lib/content";
import { site } from "@/lib/site";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CaseOverlay } from "@/components/work/CaseOverlay";
import { ProjectCard } from "@/components/work/ProjectCard";
import { visuals } from "@/components/work/Visuals";

/*
  Editorial order: the two systems built for real people first, then the
  backend project, then the smaller ones that live on GitHub.
*/
export function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const [lh, dental, gamestore] = featured;

  // remember which button opened the case, to give it the focus back on close
  const openCase = useCallback((project: Project, button: HTMLElement) => {
    trigger.current = button;
    setOpen(project);
  }, []);

  return (
    <section id="work" aria-labelledby="work-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          index="02"
          label="Featured work"
          id="work-title"
          lines={["Featured work."]}
          aside={<p className="max-w-xs text-lg">Systems built for real people, and the backend work behind them.</p>}
        />

        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ProjectCard project={lh} Visual={visuals[lh.id]} onOpen={(b) => openCase(lh, b)} />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <ProjectCard project={dental} Visual={visuals[dental.id]} onOpen={(b) => openCase(dental, b)} />
          </Reveal>
          <Reveal className="lg:col-span-12">
            <ProjectCard project={gamestore} Visual={visuals[gamestore.id]} onOpen={(b) => openCase(gamestore, b)} wide />
          </Reveal>
        </div>

        <div className="mt-24 md:mt-32">
          <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
            <h3 className="display text-[clamp(1.75rem,3vw,2.75rem)]">More on GitHub</h3>
            <a
              href={site.github}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
            >
              All repositories
              <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {more.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <ProjectCard project={p} Visual={visuals[p.id]} onOpen={(b) => openCase(p, b)} compact />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <CaseOverlay project={open} onClose={close} returnFocus={trigger} />
    </section>
  );
}
