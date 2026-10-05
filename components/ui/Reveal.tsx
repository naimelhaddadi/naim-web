"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { ease } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/* Fade + rise once the element enters the viewport. */
export function Reveal({ delay = 0, y = 24, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: ease.out, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
