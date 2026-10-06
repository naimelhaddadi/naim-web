"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { site } from "@/lib/site";
import { ArrowUpRight } from "@/components/ui/Icons";
import { MaskLines } from "@/components/ui/MaskLines";
import { ease } from "@/lib/motion";
import { useCalm } from "@/lib/useCalm";

/*
  Who's behind the work, in three statements. A thin line runs down the
  left edge as you read — picking up where the hero's orbits leave off —
  and each statement has a node on it that lights up when the statement
  is uncovered. The statements come out from behind a mask, one by one.
*/

function Statement({ children, quote }: { children: ReactNode; quote?: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });

  return (
    <li ref={ref} className="relative pl-8 md:pl-12">
      <span
        aria-hidden
        className={`absolute left-[-4px] top-[0.55em] size-[9px] rounded-full border transition-colors duration-700 ${
          inView ? "border-sodium bg-sodium" : "border-line-strong bg-ink"
        }`}
      />
      <motion.div
        initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 18 }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)", y: 0 } : undefined}
        transition={{ duration: 1.1, ease: ease.out }}
        className={quote ? "font-serif text-[clamp(1.6rem,2.8vw,2.6rem)] italic leading-[1.15]" : "text-[clamp(1.15rem,1.6vw,1.4rem)] leading-relaxed text-muted"}
      >
        {children}
      </motion.div>
    </li>
  );
}

export function About() {
  const listRef = useRef<HTMLOListElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const reduce = useCalm();

  // the thread is drawn by the scroll, from the top of the section to the last statement
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.95", "end 0.6"] });
  // the heading drifts a little slower than the page
  const { scrollYProgress: pass } = useScroll({ target: headRef, offset: ["start end", "end start"] });
  const headY = useTransform(pass, [0, 1], [40, -40]);

  return (
    <section id="about" aria-labelledby="about-title" className="relative pb-[var(--section-y)] pt-[calc(var(--section-y)*0.6)]">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <p className="label flex items-center gap-3 self-start lg:col-span-3 lg:pt-4">
          <span className="text-sodium">(01)</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          About
        </p>

        <div className="lg:col-span-9">
          <motion.div ref={headRef} style={reduce ? undefined : { y: headY }}>
            <h2 id="about-title" className="display text-[clamp(2.8rem,7vw,7.25rem)] leading-[0.9]">
              <MaskLines
                lines={[
                  "Curious by nature.",
                  <span key="2" className="text-muted">
                    Built to <span className="font-serif font-normal italic tracking-normal text-sodium">solve.</span>
                  </span>,
                ]}
              />
            </h2>
          </motion.div>

          <ol ref={listRef} className="relative mt-16 space-y-14 md:mt-20 md:space-y-16">
            <motion.span
              aria-hidden
              className="absolute bottom-0 left-0 top-0 w-px origin-top bg-gradient-to-b from-sodium via-line-strong to-line"
              style={{ scaleY: reduce ? 1 : scrollYProgress }}
            />
            <Statement>
              Computers have always been something I liked to experiment with — opening things up to see how they
              work. <span className="text-fg">Programming became the natural extension of that curiosity.</span>
            </Statement>
            <Statement quote>
              I enjoy the part of software development where a vague problem becomes a system you can actually reason
              about.
            </Statement>
            <Statement>
              Today I focus on backend development: <span className="text-fg">Java</span>,{" "}
              <span className="text-fg">Spring Boot</span>, <span className="text-fg">databases</span> and the systems
              that connect them.
            </Statement>
          </ol>

          <motion.div
            className="mt-14 pl-8 md:pl-12"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, ease: ease.out }}
          >
            <a
              href={site.cv}
              target="_blank"
              rel="noopener"
              data-cursor="Open"
              className="group inline-flex items-center gap-2 border-b border-sodium/50 pb-1 text-sm font-medium tracking-wide transition-colors hover:border-sodium hover:text-sodium"
            >
              VIEW CV
              <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
