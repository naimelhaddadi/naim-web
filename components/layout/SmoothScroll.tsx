"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/* Inertial scrolling on desktop. Skipped entirely for reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: 0 },
      lerp: 0.11,
      stopInertiaOnNavigate: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
