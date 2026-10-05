"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

export type Inspect = { name: string; detail: string } | null;
export type DiagramProps = { step: number; onInspect: (info: Inspect) => void };

const tones = {
  default: { stroke: "rgba(255,255,255,0.22)", fill: "#0e1014", text: "#ecebe7" },
  accent: { stroke: "#f2a15a", fill: "rgba(242,161,90,0.08)", text: "#ecebe7" },
  signal: { stroke: "#8db4ff", fill: "rgba(141,180,255,0.07)", text: "#ecebe7" },
  ghost: { stroke: "rgba(255,255,255,0.14)", fill: "transparent", text: "#9aa0a8" },
} as const;

type NodeProps = {
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  sub?: string;
  tone?: keyof typeof tones;
  dashed?: boolean;
  show?: boolean;
  glow?: boolean;
  info?: string;
  onInspect?: (info: Inspect) => void;
  delay?: number;
};

/* A labelled box, centred on (x, y). Focusable when it carries info for the inspector. */
export function Node({
  x,
  y,
  w,
  h = 36,
  label,
  sub,
  tone = "default",
  dashed,
  show = true,
  glow,
  info,
  onInspect,
  delay = 0,
}: NodeProps) {
  const t = tones[tone];
  const interactive = Boolean(info && onInspect);
  const enter = () => interactive && onInspect!({ name: label, detail: info! });
  const leave = () => interactive && onInspect!(null);

  return (
    <motion.g
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.7, ease: ease.out, delay: show ? delay : 0 }}
      tabIndex={interactive && show ? 0 : -1}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? `${label}: ${info}` : undefined}
      aria-hidden={interactive ? undefined : true}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className={interactive ? "cursor-help outline-none [&:focus-visible>rect]:stroke-sodium" : undefined}
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      {glow && (
        <motion.rect
          x={x - w / 2 - 6}
          y={y - h / 2 - 6}
          width={w + 12}
          height={h + 12}
          rx={8}
          fill="none"
          stroke={t.stroke}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={4}
        fill={t.fill}
        stroke={t.stroke}
        strokeWidth={1}
        strokeDasharray={dashed ? "4 4" : undefined}
        style={{ transition: "stroke .5s, fill .5s" }}
      />
      <text
        x={x}
        y={sub ? y - 4 : y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={t.text}
        fontSize={11.5}
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
          fill="#9aa0a8"
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
  d: string;
  show?: boolean;
  tone?: "line" | "accent" | "signal" | "faint";
  dashed?: boolean;
  arrow?: boolean;
  delay?: number;
};

const edgeTones = {
  line: "rgba(255,255,255,0.28)",
  accent: "#f2a15a",
  signal: "#8db4ff",
  faint: "rgba(255,255,255,0.12)",
};

/* A path that draws itself in when shown. */
export function Edge({ d, show = true, tone = "line", dashed, arrow, delay = 0 }: EdgeProps) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={edgeTones[tone]}
      strokeWidth={1}
      strokeDasharray={dashed ? "3 4" : undefined}
      markerEnd={arrow ? `url(#arrow-${tone})` : undefined}
      initial={false}
      animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.9, ease: ease.inOut, delay: show ? delay : 0 }}
      aria-hidden
    />
  );
}

/* Arrowhead markers, one per edge tone. Render once inside each <svg>. */
export function Markers() {
  return (
    <defs>
      {Object.entries(edgeTones).map(([k, c]) => (
        <marker key={k} id={`arrow-${k}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0.5 L7.5 4 L0 7.5" fill="none" stroke={c} strokeWidth="1.2" />
        </marker>
      ))}
    </defs>
  );
}

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

export function Caption({ x, y, children, show = true, anchor = "start" }: { x: number; y: number; children: ReactNode; show?: boolean; anchor?: "start" | "middle" | "end" }) {
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="#5e646d"
      fontSize={8.5}
      letterSpacing={1.4}
      className="font-mono uppercase"
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      aria-hidden
    >
      {children}
    </motion.text>
  );
}
