import type Lenis from "lenis";

/*
  The one Lenis instance, so other components can pause smooth scrolling
  (the case overlay does, while it's open) without prop drilling.
*/
export const smooth: { lenis: Lenis | null } = { lenis: null };
