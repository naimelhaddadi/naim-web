"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { approach } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ease } from "@/lib/motion";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const };
const t = { duration: 1.1, ease: ease.out };

/* 01 Understand — scattered marks pull into focus. */
function Focus({ on }: { on: boolean }) {
  const dots = [[24, 30], [92, 22], [100, 88], [30, 96], [60, 14], [16, 64]];
  return (
    <g>
      {dots.map(([x, y], i) => (
        <motion.circle key={i} r={2} fill="currentColor" initial={false} animate={on ? { cx: 60, cy: 60, opacity: 0 } : { cx: x, cy: y, opacity: 0.5 }} transition={{ ...t, delay: i * 0.04 }} />
      ))}
      <motion.circle cx={60} cy={60} {...stroke} initial={false} animate={on ? { r: 22, opacity: 1 } : { r: 40, opacity: 0.25 }} transition={t} strokeDasharray={on ? "0" : "3 5"} />
      <motion.circle cx={60} cy={60} r={3} className="fill-sodium" initial={false} animate={{ scale: on ? 1 : 0 }} transition={{ ...t, delay: 0.3 }} />
      <path d="M60 30v10M60 80v10M30 60h10M80 60h10" {...stroke} opacity={0.5} />
    </g>
  );
}

/* 02 Break it down — one block becomes four. */
function Split({ on }: { on: boolean }) {
  const q = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  return (
    <g>
      {q.map(([dx, dy], i) => (
        <motion.rect
          key={i}
          width={30}
          height={30}
          rx={2}
          {...stroke}
          className={i === 3 ? "text-sodium" : undefined}
          initial={false}
          animate={{ x: 60 + (on ? dx * 19 : dx * 15) - 15, y: 60 + (on ? dy * 19 : dy * 15) - 15 }}
          transition={{ ...t, delay: i * 0.05 }}
        />
      ))}
    </g>
  );
}

/* 03 Build — pieces stack into something that stands. */
function Stack({ on }: { on: boolean }) {
  const rows = [{ y: 84, w: 64 }, { y: 64, w: 52 }, { y: 44, w: 40 }];
  return (
    <g>
      <path d="M18 104h84" {...stroke} opacity={0.4} />
      {rows.map((r, i) => (
        <motion.rect
          key={i}
          x={60 - r.w / 2}
          width={r.w}
          height={16}
          rx={2}
          {...stroke}
          className={i === 2 ? "text-sodium" : undefined}
          initial={false}
          animate={on ? { y: r.y, opacity: 1 } : { y: r.y - 26, opacity: 0 }}
          transition={{ ...t, delay: 0.15 * i }}
        />
      ))}
    </g>
  );
}

/* 04 Improve — a rough line gets smoother. */
function Smooth({ on }: { on: boolean }) {
  const rough = "M14 86 L32 58 L46 76 L62 44 L76 66 L92 34 L106 46";
  const smooth = "M14 86 L32 74 L46 64 L62 54 L76 45 L92 36 L106 30";
  return (
    <g>
      <path d="M14 98h92" {...stroke} opacity={0.3} />
      <motion.path {...stroke} className="text-sodium" initial={false} animate={{ d: on ? smooth : rough }} transition={{ duration: 1.4, ease: ease.out }} />
      <motion.circle r={3} className="fill-sodium" initial={false} animate={{ cx: 106, cy: on ? 30 : 46 }} transition={{ duration: 1.4, ease: ease.out }} />
    </g>
  );
}

const glyphs = [Focus, Split, Stack, Smooth];

function Step({ item, index }: { item: (typeof approach)[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [replay, setReplay] = useState(false);
  const Glyph = glyphs[index];
  // In view = the resolved state. Hovering replays it from the unresolved one.
  const on = inView && !replay;

  function replayGlyph() {
    setReplay(true);
    window.setTimeout(() => setReplay(false), 280);
  }

  return (
    <li
      ref={ref}
      onMouseEnter={replayGlyph}
      className="group relative border-t border-line py-10 md:border-l md:border-t-0 md:px-8 md:py-4 md:first:border-l-0 md:first:pl-0"
    >
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-px w-full origin-left bg-sodium md:hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1.2, ease: ease.out }}
      />
      <div className="flex items-start justify-between md:block">
        <svg viewBox="0 0 120 120" className="size-24 text-fg/80 md:size-28" aria-hidden>
          <Glyph on={on} />
        </svg>
        <span className="label tabular-nums md:mt-10 md:block">{item.n}</span>
      </div>
      <h3 className="display mt-6 text-[clamp(1.9rem,2.8vw,2.75rem)] md:mt-4">{item.title}</h3>
      <p className="mt-4 text-lg leading-snug">{item.line}</p>
      <p className="mt-3 text-sm text-muted">{item.detail}</p>
    </li>
  );
}

export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          index="03"
          label="How I think"
          id="approach-title"
          lines={["Problem first.", "Code second."]}
          aside={<p className="max-w-sm">Not a methodology — just the order I actually do things in.</p>}
        />
        <ol className="mt-16 grid md:mt-24 md:grid-cols-4">
          {approach.map((item, i) => (
            <Step key={item.n} item={item} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
