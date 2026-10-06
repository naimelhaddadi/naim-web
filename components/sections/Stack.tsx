"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { Fragment, useRef } from "react";
import { beyond, layers, tools, type Layer } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useCalm } from "@/lib/useCalm";

/*
  Depth first: four technologies, not a wall of badges. They are
  listed in the order a request goes through them (the API, the logic, the
  mapping, the data), on one thread. While scrolling, a point travels down
  that thread and each layer lights up as the request reaches it. Every
  layer says what I do with it and links to the work that shows it.
  Below, the other languages I've worked with, so depth doesn't read as
  "Java only".
*/
export function Stack() {
  const ref = useRef<HTMLOListElement>(null);
  const calm = useCalm();
  // offset so the point sits on the 60% line of the viewport while it travels
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  const top = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          index="05"
          label="Stack"
          id="stack-title"
          lines={["Where I", "go deep."]}
          aside={
            <p className="max-w-xs">
              Java, Spring and SQL: the path a request takes, from the endpoint down to the table. It&apos;s where I&apos;ve gone furthest, and it isn&apos;t a fence.
            </p>
          }
        />

        <div className="relative mt-16 lg:mt-24">
          <span aria-hidden className="absolute inset-y-0 left-[3.5px] w-px bg-line" />
          <motion.span
            aria-hidden
            className="absolute inset-y-0 left-[3.5px] w-px origin-top bg-sodium/70"
            style={{ scaleY: calm ? 1 : scrollYProgress }}
          />
          {!calm && (
            <motion.span
              aria-hidden
              className="absolute left-0 z-10 size-2 -translate-y-1/2 rounded-full bg-sodium shadow-[0_0_14px_3px_rgba(242,161,90,0.45)]"
              style={{ top }}
            />
          )}

          <ol ref={ref}>
            {layers.map((layer, i) => (
              <Row key={layer.name} layer={layer} i={i} calm={calm} />
            ))}
          </ol>
        </div>

        <Reveal className="mt-14 grid gap-8 border-t border-line pt-10 pl-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="label mb-3">Beyond Java</p>
            <p className="display text-[clamp(1.9rem,3vw,2.75rem)]">
              {beyond.languages.map((l, i) => (
                <Fragment key={l}>
                  {i > 0 && <span className="text-dim"> · </span>}
                  <span className="whitespace-nowrap">{l}</span>
                </Fragment>
              ))}
            </p>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-md text-[1.05rem] leading-relaxed text-muted">{beyond.note}</p>
            <p className="mt-4 text-sm text-muted">
              <Link
                href={beyond.proof.href}
                target="_blank"
                rel="noreferrer"
                className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-sodium hover:decoration-sodium"
              >
                {beyond.proof.label}
              </Link>{" "}
              {beyond.proof.context}
            </p>
          </div>
          <div className="text-sm lg:col-span-3 lg:text-right">
            <p className="label mb-1.5">Tools</p>
            <p className="text-muted">{tools.join(" · ")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Row({ layer, i, calm }: { layer: Layer; i: number; calm: boolean }) {
  const node = useRef<HTMLSpanElement>(null);
  // lights up as the travelling point (on the 60% line) reaches this layer
  const { scrollYProgress } = useScroll({ target: node, offset: ["start 0.64", "start 0.56"] });
  const lit = calm ? 1 : scrollYProgress;
  const ring = useTransform(scrollYProgress, [0, 1], ["rgba(255,255,255,0.16)", "rgba(242,161,90,1)"]);
  const fill = useTransform(scrollYProgress, [0, 1], ["rgba(7,8,10,1)", "rgba(242,161,90,1)"]);

  return (
    <li className="relative border-t border-line py-10 pl-8 lg:py-14">
      <motion.span
        ref={node}
        aria-hidden
        className="absolute left-0 top-[3.1rem] size-2 rounded-full border lg:top-[4.1rem]"
        style={calm ? { borderColor: "#f2a15a", background: "#f2a15a" } : { borderColor: ring, background: fill }}
      />

      <Reveal y={16} className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="label mb-3 flex items-center gap-3">
            <span className="text-sodium">0{i + 1}</span>
            {layer.role}
          </p>
          <h3 className="display text-[clamp(2.4rem,5vw,4.75rem)]">
            {layer.name}
            <motion.span
              aria-hidden
              className="mt-3 block h-px w-16 origin-left bg-sodium"
              style={{ scaleX: lit }}
            />
          </h3>
        </div>

        <div className="lg:col-span-4">
          <p className="max-w-md text-[1.05rem] leading-relaxed text-muted">{layer.body}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${layer.name}: tools`}>
            {layer.tools.map((t) => (
              <li key={t} className="rounded-full border border-line-strong px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-fg/90">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-3 lg:items-end lg:text-right">
          <p className="font-mono text-sm text-signal">
            <span className="sr-only">In GameStore&apos;s POST /games, this layer is: </span>
            {layer.trace}
          </p>
          <p className="text-sm">
            <span className="label mb-1.5 block">Shown in</span>
            {layer.proof.map((p, j) => (
              <span key={p.label}>
                {j > 0 && <span className="text-dim"> · </span>}
                <Link
                  href={p.href}
                  {...(p.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-sodium hover:decoration-sodium"
                >
                  {p.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </Reveal>
    </li>
  );
}
