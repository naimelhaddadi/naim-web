"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Endpoint } from "@/lib/content";
import { ease } from "@/lib/motion";

const methodTone: Record<Endpoint["method"], string> = {
  GET: "text-signal",
  POST: "text-live",
  PUT: "text-sodium",
  DELETE: "text-[#f08a8a]",
};

const STEP_MS = 230;

type Props = {
  endpoints: Endpoint[];
  layers: { name: string; detail: string }[];
  label: string;
};

/*
  Built from the repository's real routes. Pick an endpoint (or let it
  cycle) and the request goes down Client → Controller → Service →
  Repository → Database, then the response comes back up.
*/
export function RequestTracer({ endpoints, layers: appLayers, label }: Props) {
  const layers = [{ name: "Client", detail: "HTTP request" }, ...appLayers];
  const depth = layers.length; // phases: 0..depth-1 going down, then back up
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState(-1);
  const [hovering, setHovering] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const timers = useRef<number[]>([]);

  const trace = useCallback(
    (index: number) => {
      timers.current.forEach(window.clearTimeout);
      setActive(index);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPhase(2 * depth - 1);
        return;
      }
      setPhase(0);
      timers.current = Array.from({ length: 2 * depth - 1 }, (_, i) =>
        window.setTimeout(() => setPhase(i + 1), (i + 1) * STEP_MS),
      );
    },
    [depth],
  );

  // cycle through the endpoints while visible and untouched
  useEffect(() => {
    if (!inView || hovering) return;
    let i = active;
    const kick = window.setTimeout(() => trace(i), 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => window.clearTimeout(kick);
    const id = window.setInterval(() => {
      i = (i + 1) % endpoints.length;
      trace(i);
    }, 3400);
    return () => {
      window.clearTimeout(kick);
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hovering, trace, endpoints.length]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const ep = endpoints[active];
  const done = phase >= 2 * depth - 2;
  const goingUp = phase >= depth;
  const at = goingUp ? 2 * depth - 2 - phase : phase;

  return (
    <div
      ref={ref}
      className="grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="bg-ink-2 p-3">
        <p className="label mb-2 px-2 pt-1">Endpoints</p>
        <ul className="space-y-0.5" aria-label={`${label} endpoints`}>
          {endpoints.map((e, i) => (
            <li key={e.method + e.path}>
              <button
                type="button"
                onClick={() => trace(i)}
                onFocus={() => setHovering(true)}
                onBlur={() => setHovering(false)}
                aria-pressed={i === active}
                className={`flex w-full items-baseline gap-3 rounded px-2 py-1.5 text-left font-mono text-[11.5px] transition-colors ${
                  i === active ? "bg-fg/[0.06] text-fg" : "text-muted hover:bg-fg/[0.03] hover:text-fg"
                }`}
              >
                <span className={`w-12 shrink-0 text-[10px] font-medium ${methodTone[e.method]}`}>{e.method}</span>
                <span className="truncate">{e.path}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="hairline-grid relative bg-ink-2 p-3" aria-live="polite">
        <p className="label mb-2 px-2 pt-1">Request path</p>
        <ol className="relative space-y-1.5 pl-5">
          <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-line-strong" />
          {layers.map((l, i) => {
            const lit = phase >= 0 && at === i;
            return (
              <li
                key={l.name}
                className={`relative flex items-center justify-between gap-3 rounded border px-3 py-2 transition-colors duration-200 ${
                  lit ? (goingUp ? "border-signal/60 bg-signal/[0.06]" : "border-sodium/60 bg-sodium/[0.06]") : "border-line bg-ink/60"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute -left-[16.5px] top-1/2 size-[7px] -translate-y-1/2 rounded-full transition-all duration-200 ${
                    lit ? (goingUp ? "bg-signal shadow-[0_0_10px_#8db4ff]" : "bg-sodium shadow-[0_0_10px_#f2a15a]") : "bg-ink-3 ring-1 ring-line-strong"
                  }`}
                />
                <span className="min-w-0">
                  <span className="block truncate font-mono text-[11.5px] text-fg">{l.name}</span>
                  <span className="block truncate text-[11px] text-dim">{l.detail}</span>
                </span>
                {i === 0 && (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${active}-${done}`}
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: ease.out }}
                      className={`shrink-0 font-mono text-[10.5px] ${done ? "text-live" : "text-muted"}`}
                    >
                      {done ? "200 OK" : ep.method}
                    </motion.span>
                  </AnimatePresence>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
