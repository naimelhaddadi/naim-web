"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { thinking } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { ease } from "@/lib/motion";

/*
  Think → Build → Solve → Improve. Once on screen the words light up in
  order and then keep going round, slowly — it's a loop, not a list.
*/
export function Thinking() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setActive(thinking.length - 1), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setInterval(() => setActive((a) => (a + 1) % thinking.length), 1300);
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <section id="thinking" aria-labelledby="thinking-title" className="section-y">
      <div className="container-x">
        <p className="label mb-12 flex items-center gap-3 md:mb-16">
          <span className="text-sodium">(03)</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          <span id="thinking-title">How I think</span>
        </p>

        <ol ref={ref} className="flex flex-col gap-1 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-6 lg:gap-y-2">
          {thinking.map((word, i) => (
            <li key={word} className="flex items-center gap-4 lg:gap-6">
              <span
                className={`display text-[clamp(2.9rem,4.3vw,5.5rem)] uppercase transition-colors duration-700 ease-out-expo ${
                  i === active ? "text-fg" : i < active ? "text-dim" : "text-outline"
                }`}
              >
                {word}
              </span>
              {i < thinking.length - 1 && (
                <span aria-hidden className="relative block h-px w-10 overflow-hidden bg-line-strong xl:w-16">
                  <motion.span
                    className="absolute inset-0 origin-left bg-sodium"
                    initial={false}
                    animate={{ scaleX: i < active ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: ease.out }}
                  />
                </span>
              )}
            </li>
          ))}
        </ol>

        <Reveal className="mt-14 md:mt-20 lg:ml-auto lg:max-w-[34ch]">
          <p className="font-serif text-[clamp(1.6rem,2.8vw,2.6rem)] italic leading-[1.15]">
            “I enjoy the part where a problem stops being a problem and becomes something I can build.”
          </p>
        </Reveal>
      </div>
    </section>
  );
}
