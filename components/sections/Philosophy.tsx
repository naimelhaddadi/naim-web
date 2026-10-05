"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Loop } from "./Loop";

const statement: { text: string; accent?: boolean }[] = [
  ..."I don't just want to write code. I want to understand the".split(" ").map((text) => ({ text })),
  { text: "problem", accent: true },
  { text: "first." },
];

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={accent ? "font-serif font-normal italic tracking-normal text-sodium" : undefined}
    >
      {children}{" "}
    </motion.span>
  );
}

export function Philosophy() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <section id="philosophy" aria-labelledby="philosophy-title" className="relative">
      <div className="container-x section-y">
        <p className="label mb-10 flex items-center gap-3">
          <span className="text-sodium">(01)</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          <span id="philosophy-title">Philosophy</span>
        </p>
        <p ref={ref} className="display max-w-[16ch] text-[clamp(2.4rem,6.2vw,6.75rem)] leading-[0.98]">
          <span className="sr-only">I don&apos;t just want to write code. I want to understand the problem first.</span>
          <span aria-hidden>
            {statement.map((w, i) => (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[i / statement.length, (i + 1) / statement.length]}
                accent={w.accent}
              >
                {w.text}
              </Word>
            ))}
          </span>
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-12">
          <p className="text-lg text-muted md:col-span-5 md:col-start-8">
            Software exists to solve something real. The code is how I get there — and every project I take on goes
            through the same loop.
          </p>
        </div>
      </div>
      <Loop />
    </section>
  );
}
