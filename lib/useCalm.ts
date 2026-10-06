"use client";

import { useMedia } from "./useMedia";

/*
  prefers-reduced-motion, hydration-safe: it reads as false while the page
  hydrates (matching the server HTML) and switches to the real value right
  after, so the static versions swap in without a hydration mismatch.
*/
export function useCalm() {
  return useMedia("(prefers-reduced-motion: reduce)");
}
