"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

/*
  Runs on every navigation (home ⇄ case studies): a thin sodium line sweeps
  across the top while the new page rises in.
*/
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-right bg-sodium"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 1.1, ease: ease.inOut, delay: 0.1 }}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out }}>
        {children}
      </motion.div>
    </>
  );
}
