"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import portrait from "@/assets/photos/naim-portrait.webp";
import { MaskLines } from "@/components/ui/MaskLines";
import { Reveal } from "@/components/ui/Reveal";

const now = [
  { k: "Now", v: "Deepening my Java fundamentals" },
  { k: "Next", v: "Spring Boot and JPA, properly" },
  { k: "For fun", v: "Python" },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="label mb-10 flex items-center gap-3">
            <span className="text-sodium">(05)</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden />
            About
          </p>
          <Reveal>
            <figure ref={ref} className="relative mx-auto max-w-md overflow-hidden lg:mx-0">
              <div className="relative aspect-[4/5] overflow-hidden">
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(242,161,90,0.12),transparent_60%)]" />
                <motion.div className="absolute inset-[-10%_0]" style={reduce ? undefined : { y }}>
                  <Image
                    src={portrait}
                    alt="Portrait of Naim El Haddadi"
                    fill
                    sizes="(min-width: 1024px) 34vw, (min-width: 640px) 28rem, 100vw"
                    className="object-cover object-[50%_35%]"
                  />
                </motion.div>
              </div>
              <figcaption className="label mt-4 flex justify-between">
                <span>Naim El Haddadi</span>
                <span>Madrid · 2026</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pt-20">
          <h2 id="about-title" className="display text-[clamp(2.4rem,5.2vw,5.25rem)] leading-[0.95]">
            <MaskLines
              lines={[
                "Two years ago,",
                "I started programming.",
                <span key="s" className="text-muted">
                  I haven&apos;t really stopped since.
                </span>,
              ]}
            />
          </h2>

          <div className="mt-12 grid gap-6 text-lg text-muted md:grid-cols-2 md:gap-10">
            <Reveal>
              <p>
                What started as curiosity became something I genuinely enjoy: understanding how things work, solving
                problems and building things from scratch.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                I&apos;m going deeper into Java and Spring Boot — strengthening the fundamentals and learning how to
                build better backend systems. What I want now is a real team to learn from, contribute to from day one,
                and turn this into my career.
              </p>
            </Reveal>
          </div>

          <Reveal>
            <blockquote className="mt-16 border-l border-sodium pl-6 md:pl-8">
              <p className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] italic leading-[1.15]">
                “I like thinking — and in the end, solving the problem is the best feeling.”
              </p>
            </blockquote>
          </Reveal>

          <Reveal>
            <dl className="mt-16 grid border-t border-line sm:grid-cols-3">
              {now.map((n) => (
                <div key={n.k} className="border-b border-line py-5 sm:border-b-0 sm:pr-6">
                  <dt className="label mb-2">{n.k}</dt>
                  <dd>{n.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
