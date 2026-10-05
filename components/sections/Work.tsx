"use client";

import { apiProjects, dental, lhSport } from "@/lib/content";
import { DentalDiagram } from "@/components/diagrams/DentalDiagram";
import { LhDiagram } from "@/components/diagrams/LhDiagram";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CaseStudy } from "./CaseStudy";
import { ApiProjects } from "./ApiProject";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          index="02"
          label="Selected work"
          id="work-title"
          lines={["Things I've built."]}
          aside={
            <p className="max-w-sm">
              Two systems built for real operations — one for a sports agency, one running with real patients. Two APIs
              that show where my backend work is heading.
            </p>
          }
        />

        <div className="mt-20 space-y-28 md:mt-28 md:space-y-40">
          <CaseStudy study={lhSport} Diagram={LhDiagram} />
          <CaseStudy study={dental} Diagram={DentalDiagram} />

          <div className="border-t border-line pt-10 md:pt-14">
            <Reveal className="mb-10 grid gap-6 md:mb-14 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <p className="label mb-6 flex items-center gap-3">
                  <span className="text-sodium">03 — 04</span>
                  <span className="h-px w-8 bg-line-strong" aria-hidden />
                  Backend direction
                </p>
                <h3 className="display text-[clamp(2.25rem,5vw,5rem)]">Java &amp; Spring Boot, layer by layer.</h3>
              </div>
              <p className="text-muted md:col-span-4 md:col-start-9">
                Pick an endpoint and follow the request through each layer. These are the real routes from each
                repository.
              </p>
            </Reveal>
            <ApiProjects projects={apiProjects} />
          </div>
        </div>
      </div>
    </section>
  );
}
