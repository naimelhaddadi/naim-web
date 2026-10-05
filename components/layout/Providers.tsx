"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/* reducedMotion="user" drops transform animations when the OS asks for less motion. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
