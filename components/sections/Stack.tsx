"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { core, innerRing, outerRing, relatedTo, stack, usedIn } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ease } from "@/lib/motion";
import { useCalm } from "@/lib/useCalm";

/*
  The stack as an ecosystem rather than a wall of badges: the core in the
  middle (Java, Spring Boot, JPA / Hibernate, SQL), what it works with every
  day around it, and everything else on the outer ring. Hover or focus any
  technology and the lines to the ones it actually works with are drawn,
  the rest steps back. On phones it's the same data as grouped lists,
  where a tap does the highlighting.

  Positions are percentages of the stage, so it scales with the layout.
*/

type Spot = { name: string; x: number; y: number; ring: 0 | 1 | 2 };

const CORE_POS: [number, number][] = [
  [40, 43],
  [60, 43],
  [40, 57],
  [60, 57],
];

function ring(names: string[], start: number, rx: number, ry: number, r: 1 | 2): Spot[] {
  const step = 360 / names.length;
  return names.map((name, i) => {
    const a = ((start + i * step) * Math.PI) / 180;
    // rounded: Math.cos/sin can differ in the last digit between server and browser
    const round = (v: number) => Math.round(v * 1000) / 1000;
    return { name, x: round(50 + rx * Math.cos(a)), y: round(50 + ry * Math.sin(a)), ring: r };
  });
}

const spots: Spot[] = [
  ...core.map((name, i) => ({ name, x: CORE_POS[i][0], y: CORE_POS[i][1], ring: 0 as const })),
  ...ring(innerRing, -150, 25, 29, 1),
  ...ring(outerRing, -100, 44, 44, 2),
];
const byName = Object.fromEntries(spots.map((s) => [s.name, s]));

export function Stack() {
  const [active, setActive] = useState<string | null>(null);
  const related = useMemo(() => (active ? relatedTo(active) : []), [active]);

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          index="05"
          label="Stack"
          id="stack-title"
          lines={["The system", "I build with."]}
          aside={
            <p className="max-w-xs">
              <span className="pointer-coarse:hidden">Hover</span>
              <span className="hidden pointer-coarse:inline">Tap</span> a technology to see what it works with.
            </p>
          }
        />

        <Ecosystem active={active} related={related} setActive={setActive} />
        <Grouped active={active} related={related} setActive={setActive} />
        <Detail active={active} related={related} />
      </div>
    </section>
  );
}

type Props = { active: string | null; related: string[]; setActive: (name: string | null) => void };

function Ecosystem({ active, related, setActive }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useCalm();
  const shown = inView || reduce;

  // with nothing hovered, the core's own connections are drawn faintly
  const lines = active
    ? related.map((r) => [active, r] as const)
    : core.flatMap((c) => relatedTo(c).map((r) => [c, r] as const));

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-16 hidden aspect-[16/10] w-full max-w-[1240px] lg:block"
      onMouseLeave={() => setActive(null)}
    >
      {/* the rings and the connections */}
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        {[
          [25, 29],
          [44, 44],
        ].map(([rx, ry], i) => (
          <motion.ellipse
            key={i}
            cx={50}
            cy={50}
            rx={rx}
            ry={ry}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeDasharray={i ? "0.6 1.2" : undefined}
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
            transition={{ duration: 1.6, ease: ease.inOut, delay: 0.2 + i * 0.2 }}
          />
        ))}
        <AnimatePresence>
          {shown &&
            lines.map(([a, b]) => (
              <motion.line
                key={`${active ?? "core"}-${a}-${b}`}
                x1={byName[a].x}
                y1={byName[a].y}
                x2={byName[b].x}
                y2={byName[b].y}
                stroke={active ? "#f2a15a" : "rgba(255,255,255,0.1)"}
                strokeOpacity={active ? 0.7 : 1}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: active ? 0.45 : 1.2, ease: ease.out, delay: active ? 0 : 0.9 }}
              />
            ))}
        </AnimatePresence>
      </svg>

      {spots.map((s, i) => {
        const on = s.name === active;
        const near = related.includes(s.name);
        const dim = active !== null && !on && !near;
        const order = s.ring === 0 ? i : s.ring === 1 ? 4 + (i - 4) * 0.5 : 10 + (i - 16) * 0.35;
        return (
          <motion.button
            key={s.name}
            type="button"
            onMouseEnter={() => setActive(s.name)}
            onFocus={() => setActive(s.name)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(s.name)}
            aria-describedby="stack-detail"
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border bg-ink transition-[color,border-color,background-color,opacity] duration-300 ${
              s.ring === 0
                ? "px-4 py-2 font-display text-[clamp(0.95rem,1.3vw,1.15rem)] font-semibold tracking-tight"
                : s.ring === 1
                  ? "px-3.5 py-1.5 text-[13px]"
                  : "px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em]"
            } ${
              on
                ? "border-sodium bg-sodium text-ink"
                : near
                  ? "border-sodium/70 text-fg"
                  : s.ring === 0
                    ? "border-fg/40 text-fg"
                    : dim
                      ? "border-line/60 text-dim"
                      : s.ring === 1
                        ? "border-line-strong text-fg/90"
                        : "border-line text-muted"
            } ${dim ? "opacity-50" : ""}`}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            initial={false}
            animate={shown ? { scale: 1, opacity: dim ? 0.5 : 1 } : { scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.7, ease: ease.out, delay: shown && !active ? 0.15 + order * 0.035 : 0 }}
          >
            {s.name}
          </motion.button>
        );
      })}

      <p aria-hidden className="label pointer-events-none absolute left-1/2 top-[33%] -translate-x-1/2 text-[0.62rem] text-dim">
        core
      </p>
    </div>
  );
}

/* Phones: the same technologies by category; a tap highlights what it works with. */
function Grouped({ active, related, setActive }: Props) {
  return (
    <div className="mt-12 space-y-8 lg:hidden">
      <div>
        <h3 className="label mb-3 text-sodium">Core</h3>
        <ul className="flex flex-wrap gap-2">
          {core.map((name) => (
            <li key={name}>
              <Chip name={name} big active={active} related={related} setActive={setActive} />
            </li>
          ))}
        </ul>
      </div>
      {stack.map((g) => (
        <div key={g.id}>
          <h3 className="label mb-3 border-b border-line pb-2">{g.title}</h3>
          <ul className="flex flex-wrap gap-2">
            {g.items
              .filter((n) => !core.includes(n))
              .map((name) => (
                <li key={name}>
                  <Chip name={name} active={active} related={related} setActive={setActive} />
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Chip({ name, big, active, related, setActive }: Props & { name: string; big?: boolean }) {
  const on = name === active;
  const near = related.includes(name);
  const dim = active !== null && !on && !near;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-describedby="stack-detail"
      onClick={() => setActive(on ? null : name)}
      className={`rounded-full border transition-colors duration-300 ${big ? "px-4 py-2 font-display font-semibold" : "px-3 py-1.5 text-sm"} ${
        on ? "border-sodium bg-sodium text-ink" : near ? "border-sodium/70 text-fg" : dim ? "border-line/60 text-dim" : "border-line-strong text-fg/90"
      }`}
    >
      {name}
    </button>
  );
}

function Detail({ active, related }: { active: string | null; related: string[] }) {
  return (
    <div id="stack-detail" className="mt-10 min-h-[6.5rem] border-t border-line pt-5 lg:mt-6" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active ?? "none"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: ease.out }}
          className="grid gap-3 lg:grid-cols-12 lg:items-baseline"
        >
          {active ? (
            <>
              <p className="display text-3xl lg:col-span-3">{active}</p>
              <p className="font-mono text-sm lg:col-span-5">
                {related.length ? (
                  <>
                    <span className="text-dim">works with → </span>
                    {related.join(" · ")}
                  </>
                ) : (
                  <span className="text-dim">used on its own</span>
                )}
              </p>
              <p className="text-muted lg:col-span-4">{usedIn[active] ? <>Used in: <span className="text-fg">{usedIn[active]}</span></> : "Part of my everyday toolkit."}</p>
            </>
          ) : (
            <>
              <p className="label text-sodium lg:col-span-3">The core</p>
              <p className="font-mono text-sm lg:col-span-5">Java → Spring Boot → JPA / Hibernate → SQL</p>
              <p className="text-muted lg:col-span-4">Everything else connects to one of these four. All {stack.reduce((n, g) => n + g.items.length, 0)} technologies from my CV are on this map.</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
