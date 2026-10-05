"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { stack } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ease } from "@/lib/motion";

/*
  The stack as an index, not a logo wall: pick a group, and every tool in it
  points to the project where it was actually used.
*/
export function Stack() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = stack[active];

  function onKeyDown(e: KeyboardEvent) {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + stack.length) % stack.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = stack.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          index="04"
          label="Stack"
          id="stack-title"
          lines={["The tools", "behind the work."]}
          aside={
            <p className="max-w-sm">
              Each tool links back to where I&apos;ve actually used it. The projects are the proof — this is just the
              index.
            </p>
          }
        />

        <Reveal className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Stack categories"
            onKeyDown={onKeyDown}
            className="-mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] lg:col-span-5 lg:mx-0 lg:block lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {stack.map((g, i) => {
              const selected = i === active;
              return (
                <button
                  key={g.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${g.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${g.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group flex shrink-0 items-baseline gap-4 rounded-full border px-4 py-2 text-left transition-colors duration-500 lg:w-full lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-4 ${
                    selected ? "border-fg/40 text-fg" : "border-line text-dim hover:text-muted"
                  }`}
                >
                  <span className="label hidden w-8 tabular-nums lg:inline">0{i + 1}</span>
                  <span className="text-sm font-medium lg:display lg:text-[clamp(2rem,3.6vw,3.5rem)]">{g.title}</span>
                  <span className="label ml-auto hidden tabular-nums lg:inline">({g.items.length})</span>
                  <motion.span
                    aria-hidden
                    className="hidden h-px origin-left bg-sodium lg:block"
                    initial={false}
                    animate={{ width: selected ? 40 : 0 }}
                    transition={{ duration: 0.5, ease: ease.out }}
                  />
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${group.id}`}
            aria-labelledby={`tab-${group.id}`}
            className="lg:col-span-7 lg:pt-4"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={group.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] italic leading-tight text-muted">
                  {group.caption}
                </p>
                <ul className="mt-10 border-t border-line">
                  {group.items.map((item, i) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: ease.out, delay: 0.04 * i }}
                      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line py-4"
                    >
                      <span className="flex items-center gap-3 text-lg md:text-xl">
                        {item.name}
                        {item.now && (
                          <span className="rounded-full border border-sodium/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-sodium">
                            Going deeper
                          </span>
                        )}
                      </span>
                      <span className="flex flex-wrap gap-1.5">
                        {item.usedIn?.map((p) => (
                          <span key={p} className="rounded-full bg-fg/[0.05] px-2.5 py-1 font-mono text-[11px] text-muted">
                            {p}
                          </span>
                        ))}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
