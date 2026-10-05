"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flows, stack, type Flow } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ease } from "@/lib/motion";

const flowOf = (name: string) => flows.find((f) => f.steps.includes(name)) ?? null;

/*
  The whole stack, grouped like the CV, but wired together: every
  technology belongs to a flow (Java → Spring Boot → JPA → SQL Server,
  n8n → Webhooks → WhatsApp → LLM…). Hover or tap one and the flow lights
  up, with a line drawn through its steps across the groups.
*/
export function Stack() {
  const [pinned, setPinned] = useState<Flow | null>(flows[0]);
  const [hovered, setHovered] = useState<Flow | null>(null);
  const active = hovered ?? pinned;

  const boxRef = useRef<HTMLDivElement>(null);
  const chips = useRef(new Map<string, HTMLElement>());
  const [points, setPoints] = useState<[number, number][]>([]);

  // centre of each step of the active flow, relative to the grid
  const measure = useCallback(() => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box || !active) return setPoints([]);
    setPoints(
      active.steps.flatMap((name) => {
        const r = chips.current.get(name)?.getBoundingClientRect();
        return r ? [[r.left - box.left + r.width / 2, r.top - box.top + r.height / 2] as [number, number]] : [];
      }),
    );
  }, [active]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (boxRef.current) ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const path = points
    .map(([x, y], i) => {
      if (i === 0) return `M ${x} ${y}`;
      const [px, py] = points[i - 1];
      const mid = (py + y) / 2;
      return `C ${px} ${mid}, ${x} ${mid}, ${x} ${y}`;
    })
    .join(" ");

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          index="03"
          label="Stack"
          id="stack-title"
          lines={["The system", "I build with."]}
          aside={
            <p className="max-w-xs">
              <span className="pointer-coarse:hidden">Hover</span>
              <span className="hidden pointer-coarse:inline">Tap</span> a technology to see what it connects to.
            </p>
          }
        />

        {/* flows, for touch screens and for anyone who'd rather pick than hover */}
        <Reveal className="mt-14 md:mt-20">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Flows">
            {flows
              .filter((f) => f.steps.length > 1)
              .map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active?.id === f.id}
                  onClick={() => setPinned(pinned?.id === f.id ? null : f)}
                  className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 ${
                    active?.id === f.id ? "border-sodium/70 text-sodium" : "border-line text-muted hover:border-line-strong hover:text-fg"
                  }`}
                >
                  {f.label}
                </button>
              ))}
          </div>
        </Reveal>

        <div ref={boxRef} className="relative mt-10" onMouseLeave={() => setHovered(null)}>
          {/* the path through the active flow, drawn under the chips */}
          <svg aria-hidden className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
            <AnimatePresence>
              {points.length > 1 && (
                <motion.path
                  key={active?.id}
                  d={path}
                  fill="none"
                  stroke="var(--color-sodium)"
                  strokeOpacity={0.55}
                  strokeWidth={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.9, ease: ease.inOut }}
                />
              )}
            </AnimatePresence>
          </svg>

          <div className="relative z-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {stack.map((group, g) => (
              <Reveal key={group.id} delay={(g % 3) * 0.06} y={0}>
                <h3 className="label flex items-baseline justify-between border-b border-line-strong pb-3">
                  <span>
                    <span className="mr-3 text-dim">0{g + 1}</span>
                    {group.title}
                  </span>
                  <span className="tabular-nums text-dim">{String(group.items.length).padStart(2, "0")}</span>
                </h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((tech) => {
                    const flow = flowOf(tech.name);
                    const step = active ? active.steps.indexOf(tech.name) : -1;
                    const on = step >= 0;
                    const dim = active !== null && !on;
                    return (
                      <li key={tech.name}>
                        <button
                          ref={(el) => {
                            if (el) chips.current.set(tech.name, el);
                            else chips.current.delete(tech.name);
                          }}
                          type="button"
                          onMouseEnter={() => setHovered(flow)}
                          onFocus={() => setHovered(flow)}
                          onBlur={() => setHovered(null)}
                          onClick={() => setPinned(flow)}
                          className={`relative flex items-center gap-2 rounded-full border bg-ink transition-colors duration-300 ${
                            tech.sub ? "border-dashed px-3 py-1 text-[13px]" : "px-3.5 py-1.5 text-sm"
                          } ${on ? "border-sodium/70 text-fg" : dim ? "border-line/50 text-dim hover:text-fg" : "border-line text-muted hover:text-fg"}`}
                        >
                          {tech.sub && <span aria-hidden className="text-dim">↳</span>}
                          {tech.name}
                          {on && active!.steps.length > 1 && (
                            <span aria-hidden className="font-mono text-[10px] tabular-nums text-sodium">
                              {step + 1}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        {/* what the active flow is and where it shows up */}
        <div className="mt-12 min-h-[5.5rem] border-t border-line pt-5" aria-live="polite">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: ease.out }}
                className="grid gap-2 md:grid-cols-12 md:items-baseline"
              >
                <p className="label text-sodium md:col-span-3">{active.label}</p>
                <p className="font-mono text-sm md:col-span-4">{active.steps.join(" → ")}</p>
                <p className="text-muted md:col-span-5">{active.note}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
