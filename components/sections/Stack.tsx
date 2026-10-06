"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef } from "react";
import { alsoLanguages, alsoProof, layers, request, stackProof, tools, type Layer } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useCalm } from "@/lib/useCalm";

/*
  Java is the core, not the limit. One request (GameStore's POST /games)
  crosses the four layers I know best: on large screens they sit in a row
  on one thread, on phones in a column. While scrolling, a point travels
  along the thread and each layer lights up as the request reaches it.
  Below, the other languages I work with, visible rather than a footnote.
*/
export function Stack() {
  const ref = useRef<HTMLOListElement>(null);
  const calm = useCalm();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.45"] });
  const at = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          index="05"
          label="Stack"
          id="stack-title"
          lines={["Java is my core,", "not my limit."]}
          aside={<p className="max-w-xs">One request through the stack I know best, and the languages I also work with.</p>}
        />

        <div className="mt-14 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 lg:mt-20">
          <p className="font-mono text-sm text-signal">
            {request} <span className="text-muted">· one request, four layers</span>
          </p>
          <p className="text-sm text-muted">
            Shown in{" "}
            {stackProof.map((p, i) => (
              <Fragment key={p.label}>
                {i > 0 && <span className="text-dim"> · </span>}
                <Link
                  href={p.href}
                  {...(p.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-sodium hover:decoration-sodium"
                >
                  {p.label}
                </Link>
              </Fragment>
            ))}
          </p>
        </div>

        <div className="relative mt-8">
          {/* the thread: across on large screens, down on phones */}
          <span aria-hidden className="absolute inset-x-0 top-0 hidden h-px bg-line lg:block" />
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-0 hidden h-px origin-left bg-sodium/70 lg:block"
            style={{ scaleX: calm ? 1 : scrollYProgress }}
          />
          <span aria-hidden className="absolute inset-y-0 left-[3.5px] w-px bg-line lg:hidden" />
          <motion.span
            aria-hidden
            className="absolute inset-y-0 left-[3.5px] w-px origin-top bg-sodium/70 lg:hidden"
            style={{ scaleY: calm ? 1 : scrollYProgress }}
          />
          {!calm && (
            <>
              <motion.span aria-hidden className={`${packet} top-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block`} style={{ left: at }} />
              <motion.span aria-hidden className={`${packet} left-0 -translate-y-1/2 lg:hidden`} style={{ top: at }} />
            </>
          )}

          <ol ref={ref} className="grid gap-9 lg:grid-cols-4 lg:gap-8">
            {layers.map((layer, i) => (
              <Step key={layer.name} layer={layer} i={i} p={scrollYProgress} calm={calm} />
            ))}
          </ol>
        </div>

        <Reveal className="mt-16 grid gap-6 border-t border-line pt-8 lg:mt-20 lg:grid-cols-12 lg:items-baseline lg:gap-8">
          <div className="lg:col-span-6">
            <p className="label mb-3">I also work with</p>
            <p className="display text-[clamp(1.9rem,2.8vw,2.6rem)]">
              {alsoLanguages.map((l, i) => (
                <Fragment key={l}>
                  {i > 0 && <span className="text-dim"> · </span>}
                  <span className="whitespace-nowrap">{l}</span>
                </Fragment>
              ))}
            </p>
          </div>
          <p className="text-muted lg:col-span-3">
            Same way of working, different syntax. My{" "}
            <Link
              href={alsoProof.href}
              target="_blank"
              rel="noreferrer"
              className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-sodium hover:decoration-sodium"
            >
              {alsoProof.label}
            </Link>{" "}
            {alsoProof.note}
          </p>
          <div className="text-sm lg:col-span-3 lg:text-right">
            <p className="label mb-1.5">Tools</p>
            <p className="text-muted">{tools.join(" · ")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const packet = "absolute z-10 size-2 rounded-full bg-sodium shadow-[0_0_14px_3px_rgba(242,161,90,0.45)]";

function Step({ layer, i, p, calm }: { layer: Layer; i: number; p: MotionValue<number>; calm: boolean }) {
  // the layer lights up as the travelling point reaches its node
  const start = i / layers.length;
  const lit = useTransform(p, [start - 0.02, start + 0.06], [0, 1]);
  const ring = useTransform(lit, [0, 1], ["rgba(255,255,255,0.16)", "rgba(242,161,90,1)"]);
  const fill = useTransform(lit, [0, 1], ["rgba(7,8,10,1)", "rgba(242,161,90,1)"]);

  return (
    <li className="relative pl-8 lg:pl-0 lg:pt-9">
      <motion.span
        aria-hidden
        className="absolute left-0 top-[0.55rem] z-10 size-2 rounded-full border lg:top-0 lg:-translate-y-1/2"
        style={calm ? { borderColor: "#f2a15a", background: "#f2a15a" } : { borderColor: ring, background: fill }}
      />
      <Reveal y={14} delay={i * 0.06}>
        <p className="label mb-2 flex items-center gap-3">
          <span className="text-sodium">0{i + 1}</span>
          {layer.role}
        </p>
        <h3 className="display text-[clamp(1.9rem,2.6vw,2.6rem)]">{layer.name}</h3>
        <p className="mt-3 max-w-sm leading-relaxed text-muted">{layer.line}</p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.06em] text-fg/80">{layer.tools.join(" · ")}</p>
      </Reveal>
    </li>
  );
}
