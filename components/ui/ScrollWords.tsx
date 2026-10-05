"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";

type Line = { text: string; className?: string };

function Word({ children, progress, range }: { children: ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/*
  Text that lights up word by word as it scrolls through the viewport —
  the scroll position *is* the reading position. Screen readers get the
  plain text.
*/
export function ScrollWords({ lines, className }: { lines: Line[]; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = lines.flatMap((line, l) => line.text.split(" ").map((w) => ({ w, l })));
  let i = 0;

  return (
    <span ref={ref} className={`block ${className ?? ""}`}>
      <span className="sr-only">{lines.map((l) => l.text).join(" ")}</span>
      <span aria-hidden>
        {lines.map((line, l) => (
          <span key={l} className={`block ${line.className ?? ""}`}>
            {words
              .filter((x) => x.l === l)
              .map(({ w }) => {
                const n = i++;
                return (
                  <Word key={n} progress={scrollYProgress} range={[n / words.length, (n + 1) / words.length]}>
                    {w}
                  </Word>
                );
              })}
          </span>
        ))}
      </span>
    </span>
  );
}
