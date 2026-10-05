"use client";

import { useCallback, useRef, useState } from "react";
import { projects, type Project } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CaseOverlay } from "@/components/work/CaseOverlay";
import { ProjectCard } from "@/components/work/ProjectCard";
import { DentalVisual, GameStoreVisual, LhVisual } from "@/components/work/Visuals";

const visuals = { "lh-sport": LhVisual, dental: DentalVisual, gamestore: GameStoreVisual };

/* Two systems built for real people on top, the backend project underneath. */
export function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const [lh, dental, gamestore] = projects;

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
          label="Selected work"
          id="work-title"
          lines={["Selected work."]}
          aside={<p className="max-w-xs text-lg">Things I&apos;ve built to solve real problems.</p>}
        />

        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ProjectCard project={lh} Visual={visuals[lh.id]} onOpen={(button) => openCase(lh, button)} />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <ProjectCard project={dental} Visual={visuals[dental.id]} onOpen={(button) => openCase(dental, button)} />
          </Reveal>
          <Reveal className="lg:col-span-12">
            <ProjectCard project={gamestore} Visual={visuals[gamestore.id]} onOpen={(button) => openCase(gamestore, button)} wide />
          </Reveal>
        </div>
      </div>

      <CaseOverlay project={open} onClose={close} returnFocus={trigger} />
    </section>
  );
}
