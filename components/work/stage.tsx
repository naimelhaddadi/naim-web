"use client";

import { motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useState } from "react";
import type { Inspect } from "@/components/diagrams/primitives";

/*
  Building blocks for diagrams that are *scrubbed* by the scroll: every
  element takes the same progress value (0 → 1) and a range inside it, so
  scrolling down builds the system and scrolling up takes it apart again.

  `collapse` (0 → 1) pulls an element into a single point — that's how the
  LH diagram folds itself into the line that becomes the next project.
*/

export type StageProps = {
  p: MotionValue<number>;
  onInspect: (info: Inspect) => void;
  /** Reduced motion: no looping packets. */
  still?: boolean;
};

export const C = {
  fg: "#ecebe7",
  muted: "#9aa0a8",
  dim: "#5e646d",
  line: "rgba(255,255,255,0.26)",
  faint: "rgba(255,255,255,0.1)",
  box: "#0e1014",
  sodium: "#f2a15a",
  signal: "#8db4ff",
  live: "#7fd6a4",
};

/** 0 → 1 while p goes from a to b (clamped). */
export function useRange(p: MotionValue<number>, a: number, b: number) {
  return useTransform(p, [a, b], [0, 1]);
}

/** true while a ≤ p < b. Kept as state so things like looping packets can mount and unmount. */
export function useBetween(p: MotionValue<number>, a: number, b = Infinity) {
  const test = (v: number) => v >= a && v < b;
  const [on, setOn] = useState(() => test(p.get()));
  useMotionValueEvent(p, "change", (v) => {
    const next = test(v);
    if (next !== on) setOn(next);
  });
  return on;
}

type NodeProps = {
  p: MotionValue<number>;
  at: [number, number];
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  sub?: string;
  /** Optional colour/dash that change with the scroll. */
  stroke?: MotionValue<string> | string;
  fill?: string;
  dash?: MotionValue<string> | string;
  collapse?: MotionValue<number>;
  to?: [number, number];
  info?: string;
  onInspect?: (info: Inspect) => void;
  textTone?: string;
};

export function SNode({
  p,
  at,
  x,
  y,
  w,
  h = 36,
  label,
  sub,
  stroke = C.line,
  fill = C.box,
  dash = "0",
  collapse,
  to = [x, y],
  info,
  onInspect,
  textTone = C.fg,
}: NodeProps) {
  const zero = useMotionValue(0);
  const k = collapse ?? zero;
  const appear = useRange(p, at[0], at[1]);
  const opacity = useTransform([appear, k], ([v, c]: number[]) => v * (1 - c));
  const scale = useTransform([appear, k], ([v, c]: number[]) => (0.86 + 0.14 * v) * (1 - 0.8 * c));
  const dx = useTransform(k, (c) => (to[0] - x) * c);
  const dy = useTransform([appear, k], ([v, c]: number[]) => (1 - v) * 10 + (to[1] - y) * c);

  const interactive = Boolean(info && onInspect);
  const enter = () => {
    if (interactive && opacity.get() > 0.5) onInspect!({ name: label, detail: info! });
  };
  const leave = () => interactive && onInspect!(null);

  return (
    <motion.g
      style={{ opacity, scale, x: dx, y: dy, transformBox: "fill-box", transformOrigin: "50% 50%" }}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? `${label}: ${info}` : undefined}
      aria-hidden={interactive ? undefined : true}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className={interactive ? "cursor-help outline-none [&:focus-visible>rect]:stroke-sodium" : undefined}
    >
      <motion.rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={4}
        fill={fill}
        style={{ stroke, strokeDasharray: dash }}
        strokeWidth={1}
      />
      <text
        x={x}
        y={sub ? y - 4 : y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textTone}
        fontSize={12}
        fontWeight={500}
        className="font-sans"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x}
          y={y + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={C.muted}
          fontSize={8.5}
          letterSpacing={0.8}
          className="font-mono uppercase"
        >
          {sub}
        </text>
      )}
    </motion.g>
  );
}

type EdgeProps = {
  p: MotionValue<number>;
  at: [number, number];
  d: string;
  color?: string;
  dashed?: boolean;
  arrow?: boolean;
  fade?: MotionValue<number>;
  width?: number;
};

/* A path that draws itself as p moves through its range. */
export function SEdge({ p, at, d, color = C.line, dashed, arrow, fade, width = 1 }: EdgeProps) {
  const zero = useMotionValue(0);
  const f = fade ?? zero;
  const length = useRange(p, at[0], at[1]);
  const opacity = useTransform([length, f], ([v, c]: number[]) => (v > 0.001 ? 1 - c : 0));
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? "3 4" : undefined}
      markerEnd={arrow ? "url(#stage-arrow)" : undefined}
      style={{ pathLength: length, opacity }}
      aria-hidden
    />
  );
}

/* Small rounded label (chips, chat bubbles). */
export function SChip({
  p,
  at,
  x,
  y,
  w,
  text,
  tone = C.fg,
  fade,
}: {
  p: MotionValue<number>;
  at: [number, number];
  x: number;
  y: number;
  w: number;
  text: string;
  tone?: string;
  fade?: MotionValue<number>;
}) {
  const zero = useMotionValue(0);
  const f = fade ?? zero;
  const appear = useRange(p, at[0], at[1]);
  const opacity = useTransform([appear, f], ([v, c]: number[]) => v * (1 - c));
  const dy = useTransform(appear, (v) => (1 - v) * 6);
  return (
    <motion.g style={{ opacity, y: dy }} aria-hidden>
      <rect x={x - w / 2} y={y - 10} width={w} height={20} rx={10} fill="#13161b" stroke="rgba(255,255,255,0.16)" />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fill={tone} className="font-mono">
        {text}
      </text>
    </motion.g>
  );
}

export function StageMarkers() {
  return (
    <defs>
      <marker id="stage-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0.5 L7.5 4 L0 7.5" fill="none" stroke={C.line} strokeWidth="1.2" />
      </marker>
    </defs>
  );
}
