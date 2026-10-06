"use client";

import { motion } from "motion/react";

/* What a diagram node reports when it's hovered or focused. */
export type Inspect = { name: string; detail: string } | null;

type PacketProps = {
  points: [number, number][];
  show: boolean;
  color?: string;
  duration?: number;
  delay?: number;
  r?: number;
};

/* A dot travelling along a polyline, looping while shown. */
export function Packet({ points, show, color = "#f2a15a", duration = 3, delay = 0, r = 3.5 }: PacketProps) {
  if (!show) return null;
  // Keyframe times proportional to distance, so speed is constant.
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0) || 1;
  const times = [0];
  lengths.forEach((l) => times.push(times[times.length - 1] + l / total));
  return (
    <motion.circle
      r={r}
      fill={color}
      initial={{ cx: points[0][0], cy: points[0][1], opacity: 0 }}
      animate={{
        cx: points.map((p) => p[0]),
        cy: points.map((p) => p[1]),
        opacity: points.map((_, i) => (i === 0 || i === points.length - 1 ? 0 : 1)),
      }}
      transition={{ duration, delay, times, repeat: Infinity, repeatDelay: 0.6, ease: "linear" }}
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      aria-hidden
    />
  );
}
