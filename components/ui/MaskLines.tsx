"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ease } from "@/lib/motion";

type MaskLinesProps = {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** "mount" animates on first paint (hero); "view" when scrolled into view. */
  trigger?: "mount" | "view";
};

/*
  Each line slides up from behind its own mask. The wrapper is what gets
  observed: the lines themselves start fully clipped, so an observer on them
  would never fire.
*/
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  trigger = "view",
}: MaskLinesProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const shown = trigger === "mount" || inView;

  return (
    <span ref={ref} className={`block ${className ?? ""}`}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <motion.span
            className={`block will-change-transform ${lineClassName ?? ""}`}
            initial={{ y: "105%" }}
            animate={{ y: shown ? "0%" : "105%" }}
            transition={{ duration: 1.1, ease: ease.out, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
