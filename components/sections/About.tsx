"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "@/lib/site";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollWords } from "@/components/ui/ScrollWords";

/*
  The mindset behind the work, not a biography. The details are in the CV.
  The headline lights up with the scroll; the two columns come in from
  opposite sides.
*/
export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.45"] });
  const fromLeft = useTransform(scrollYProgress, [0, 1], [-60, 0]);
  const fromRight = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const show = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="about" aria-labelledby="about-title" className="section-y">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <p className="label flex items-center gap-3 self-start lg:col-span-3 lg:pt-4">
          <span className="text-sodium">(01)</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          About
        </p>

        <div className="lg:col-span-9">
          <h2 id="about-title" className="display text-[clamp(2.4rem,5.4vw,5.75rem)] leading-[0.95]">
            <ScrollWords
              lines={[{ text: "Curiosity got me into computers." }, { text: "Building things kept me there.", className: "text-muted" }]}
            />
          </h2>

          <div ref={ref} className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
            <motion.p className="text-lg text-muted" style={reduce ? undefined : { x: fromLeft, opacity: show }}>
              I&apos;ve always liked taking things apart to understand how they work and how they could work better.
              Programming was the natural next step — about two years ago it became the thing I do every day.
            </motion.p>
            <motion.p className="text-lg text-muted" style={reduce ? undefined : { x: fromRight, opacity: show }}>
              Today I focus on backend development: <span className="text-fg">Java</span>,{" "}
              <span className="text-fg">Spring Boot</span>, <span className="text-fg">databases</span> and the systems
              that connect them.
            </motion.p>
          </div>

          <Reveal delay={0.15} className="mt-14 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[34ch] font-serif text-[clamp(1.45rem,2.4vw,2.2rem)] italic leading-[1.15]">
              I enjoy the part where a vague problem becomes a system you can actually reason about.
            </p>
            <a
              href={site.cv}
              target="_blank"
              rel="noopener"
              data-cursor="Open"
              className="group inline-flex shrink-0 items-center gap-2 self-start border-b border-sodium/50 pb-1 text-sm font-medium transition-colors hover:border-sodium hover:text-sodium md:self-auto"
            >
              View CV
              <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
