"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Fragment, useRef, useState } from "react";
import { loop } from "@/lib/content";
import { ease } from "@/lib/motion";

const R = 150;
const C = 200;

function nodePosition(i: number, radius = R) {
  const a = ((-90 + i * 72) * Math.PI) / 180;
  return { x: C + radius * Math.cos(a), y: C + radius * Math.sin(a) };
}

/*
  The site's motif: Think → Build → Solve → Learn → Repeat.
  A tall track pins the stage; scroll progress picks the active step and
  draws the circle, so the loop closes exactly as "Repeat" is reached.
*/
export function Loop() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const arc = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(loop.length - 1, Math.max(0, Math.floor(v * loop.length * 0.999 + 0.0))));
  });

  const closed = active === loop.length - 1;

  return (
    <div ref={ref} className="relative h-[380vh]" aria-label="The loop: think, build, solve, learn, repeat" role="region">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-x grid w-full items-center gap-10 md:grid-cols-12">
          <ol className="md:col-span-6 lg:col-span-5">
            {loop.map((step, i) => {
              const state = i === active ? "active" : i < active ? "past" : "future";
              return (
                <Fragment key={step.word}>
                  <li
                    aria-current={state === "active" ? "step" : undefined}
                    className={`display text-[clamp(3.1rem,8.6vw,8.75rem)] uppercase leading-[0.92] transition-colors duration-700 ease-out-expo ${
                      state === "active" ? "text-fg" : state === "past" ? "text-dim" : "text-outline"
                    }`}
                  >
                    <span className="sr-only">{`Step ${i + 1}: `}</span>
                    {step.word}
                    <span className="sr-only">{` — ${step.line}`}</span>
                  </li>
                  {i < loop.length - 1 && (
                    <li aria-hidden className="flex h-[clamp(0.9rem,1.8vw,1.6rem)] items-center pl-[0.4em]">
                      <span
                        className={`block h-full w-px transition-colors duration-700 ${i < active ? "bg-sodium" : "bg-line-strong"}`}
                      />
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ol>

          <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
            {/* Circle diagram: desktop / tablet */}
            <div className="relative mx-auto hidden aspect-square w-full max-w-[560px] md:block" aria-hidden>
              <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible">
                <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <circle cx={C} cy={C} r={R + 22} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2 6" />
                <motion.circle
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke="var(--color-sodium)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ pathLength: arc, rotate: -90, transformOrigin: "50% 50%" }}
                />
                {loop.map((step, i) => {
                  const p = nodePosition(i);
                  const l = nodePosition(i, R + 44);
                  const on = i <= active;
                  return (
                    <g key={step.word}>
                      {i === active && (
                        <motion.circle
                          cx={p.x}
                          cy={p.y}
                          fill="none"
                          stroke="var(--color-sodium)"
                          initial={{ r: 6, opacity: 0.7 }}
                          animate={{ r: 20, opacity: 0 }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={i === active ? 6 : 4}
                        fill={on ? "var(--color-sodium)" : "var(--color-ink)"}
                        stroke={on ? "var(--color-sodium)" : "rgba(255,255,255,0.3)"}
                        style={{ transition: "all .6s cubic-bezier(.16,1,.3,1)" }}
                      />
                      <text
                        x={l.x}
                        y={l.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-mono uppercase"
                        fontSize="10"
                        letterSpacing="1.6"
                        fill={i === active ? "var(--color-fg)" : "var(--color-dim)"}
                        style={{ transition: "fill .6s" }}
                      >
                        {step.word}
                      </text>
                    </g>
                  );
                })}
                {/* closing arrow back to Think */}
                <motion.path
                  d={`M ${nodePosition(4).x + 8} ${nodePosition(4).y - 14} Q ${C - 70} ${C - R - 18} ${C - 12} ${C - R - 4}`}
                  fill="none"
                  stroke="var(--color-sodium)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                  animate={{ opacity: closed ? 1 : 0 }}
                  transition={{ duration: 0.6 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-[22%] text-center">
                <p className="label mb-4 tabular-nums">
                  <span className="text-sodium">0{active + 1}</span> / 0{loop.length}
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active}
                    className="text-balance text-xl leading-snug text-fg lg:text-2xl"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.5, ease: ease.out }}
                  >
                    {loop[active].line}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile: just the line */}
            <div className="md:hidden" aria-hidden>
              <p className="label mb-3 tabular-nums">
                <span className="text-sodium">0{active + 1}</span> / 0{loop.length}
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  className="text-xl leading-snug"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: ease.out }}
                >
                  {loop[active].line}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
