"use client";

import { motion } from "motion/react";
import type { ComponentType } from "react";
import type { ProjectId } from "@/lib/content";
import { Packet } from "@/components/diagrams/primitives";
import { ease } from "@/lib/motion";

/*
  The small diagrams on the personal project tiles. Each one tells its
  project's story in one move when the tile becomes active (hover, focus,
  or simply being on screen on touch devices):
    GameStore  a request goes down Controller → Service → Repository → JPA → Database and back as 200 OK
    Academia   students → filtered by course → ranked → statistics
    Market     event → price change → market state → next turn, around and around
  (The real-world projects use the bigger, scroll-built stages in this folder.)
*/

export type VisualProps = { active: boolean };

const C = {
  fg: "#ecebe7",
  muted: "#9aa0a8",
  dim: "#5e646d",
  line: "rgba(255,255,255,0.18)",
  faint: "rgba(255,255,255,0.08)",
  sodium: "#f2a15a",
  signal: "#8db4ff",
  live: "#7fd6a4",
  box: "#0e1014",
};

function Pill({ x, y, w, label, tone = "default" }: { x: number; y: number; w: number; label: string; tone?: "default" | "accent" | "signal" }) {
  const stroke = tone === "accent" ? C.sodium : tone === "signal" ? C.signal : C.line;
  return (
    <g>
      <rect x={x - w / 2} y={y - 14} width={w} height={28} rx={4} fill={C.box} stroke={stroke} style={{ transition: "stroke .5s" }} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill={C.fg} className="font-sans" fontWeight={500}>
        {label}
      </text>
    </g>
  );
}

function Edge({ d, active, delay = 0, color = C.line, dashed }: { d: string; active: boolean; delay?: number; color?: string; dashed?: boolean }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeDasharray={dashed ? "3 4" : undefined}
      initial={false}
      animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
      transition={{ duration: 0.8, ease: ease.inOut, delay: active ? delay : 0 }}
    />
  );
}

/* ── GameStore: a request down the layers, the response back up ── */

const layers = [
  { label: "Controller", note: "@RestController · DTO" },
  { label: "Service", note: "@Service · rules" },
  { label: "Repository", note: "Spring Data JPA" },
  { label: "JPA", note: "Hibernate" },
  { label: "Database", note: "H2" },
];
const LX = 232;
const HW = 98; // half the width of a layer box
const LY = (i: number) => 24 + i * 40;

export function GameStoreVisual({ active }: VisualProps) {
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
      <motion.text x={10} y={LY(0) + 4} fontSize={10} className="font-mono" initial={false} animate={{ opacity: active ? 1 : 0.55 }} fill={C.fg}>
        <tspan fill={C.signal}>GET</tspan> /games/top/5
      </motion.text>

      {layers.slice(1).map((_, i) => (
        <g key={i}>
          <line x1={LX} y1={LY(i) + 13} x2={LX} y2={LY(i + 1) - 13} stroke={C.faint} />
          <Edge d={`M${LX} ${LY(i) + 13} V ${LY(i + 1) - 13}`} active={active} delay={0.1 + i * 0.12} />
        </g>
      ))}
      {/* response path, back up on the right */}
      <Edge d={`M${LX + HW} ${LY(4)} H ${LX + HW + 16} V ${LY(0)} H ${LX + HW}`} active={active} delay={0.75} color={C.signal} dashed />

      {layers.map((l, i) => (
        <motion.g
          key={l.label}
          initial={false}
          animate={{ x: active ? 0 : (i % 2 ? 6 : -6), opacity: active ? 1 : 0.55 }}
          transition={{ duration: 0.6, ease: ease.out, delay: active ? i * 0.06 : 0 }}
        >
          <rect x={LX - HW} y={LY(i) - 13} width={HW * 2} height={26} rx={4} fill={C.box} stroke={active && i === 4 ? C.sodium : C.line} style={{ transition: "stroke .5s" }} />
          <text x={LX - HW + 12} y={LY(i) + 1} dominantBaseline="middle" fontSize={11} fill={C.fg} fontWeight={500} className="font-sans">
            {l.label}
          </text>
          <text x={LX + HW - 12} y={LY(i) + 1} textAnchor="end" dominantBaseline="middle" fontSize={8.5} fill={C.muted} className="font-mono">
            {l.note}
          </text>
        </motion.g>
      ))}

      <Packet show={active} points={[[LX, LY(0) - 13], [LX, LY(4) - 13]]} duration={1.8} delay={0.4} />
      <Packet show={active} color={C.signal} points={[[LX + HW, LY(4)], [LX + HW + 16, LY(4)], [LX + HW + 16, LY(0)], [LX + HW, LY(0)]]} duration={1.5} delay={2.1} />

      <motion.g initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.4, delay: active ? 3.2 : 0 }}>
        <rect x={10} y={LY(1) - 4} width={64} height={22} rx={11} fill="#13161b" stroke={C.faint} />
        <text x={42} y={LY(1) + 8} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={C.live} className="font-mono">
          200 OK
        </text>
      </motion.g>
    </svg>
  );
}

/* ── Financial Market Simulator: event → price change → market state → next turn ── */

const loopNodes = [
  { label: "Event", x: 92, y: 52 },
  { label: "Price change", x: 308, y: 52 },
  { label: "Market state", x: 308, y: 168 },
  { label: "Next turn", x: 92, y: 168 },
];
const LOOP = "M 140 52 H 252 M 308 66 V 154 M 256 168 H 140 M 92 154 V 66";
const calm = [[140, 128], [162, 122], [184, 126], [206, 114], [228, 118], [250, 108]];
const moved = [[140, 128], [162, 122], [184, 126], [206, 138], [228, 132], [250, 124]];
const spark = (pts: number[][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

export function MarketVisual({ active }: VisualProps) {
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
      <path d={LOOP} stroke={C.faint} fill="none" />
      <Edge d={LOOP} active={active} delay={0.15} color={C.line} />
      {loopNodes.map((n, i) => (
        <motion.g
          key={n.label}
          initial={false}
          animate={{ opacity: active ? 1 : 0.55 }}
          transition={{ duration: 0.5, delay: active ? i * 0.12 : 0 }}
        >
          <Pill x={n.x} y={n.y} w={i === 0 || i === 3 ? 86 : 104} label={n.label} tone={active && i === 0 ? "accent" : active && i === 2 ? "signal" : "default"} />
        </motion.g>
      ))}
      {/* the market inside the loop: the event bends the price line */}
      <motion.path
        d={spark(calm)}
        fill="none"
        stroke={C.signal}
        strokeWidth={1.5}
        initial={false}
        animate={{ d: spark(active ? moved : calm) }}
        transition={{ duration: 0.9, ease: ease.inOut, delay: active ? 0.6 : 0 }}
      />
      <Packet show={active} points={[[140, 52], [252, 52], [308, 52], [308, 154], [256, 168], [140, 168], [92, 154], [92, 66]]} duration={3.2} delay={0.4} />
      <text x={200} y={208} textAnchor="middle" fontSize={8.5} letterSpacing={1.4} fill={C.dim} className="font-mono uppercase">
        {active ? "input validated · turn processed" : "python · turn-based"}
      </text>
    </svg>
  );
}

/* ── Academia API: students → by course → ranking → statistics ── */

const academia = [
  { label: "Students", x: 56 },
  { label: "By course", x: 152 },
  { label: "Ranking", x: 248 },
  { label: "Stats", x: 340 },
];

export function AcademiaVisual({ active }: VisualProps) {
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
      <text x={20} y={46} fontSize={10.5} className="font-mono" fill={C.fg} opacity={active ? 1 : 0.5} style={{ transition: "opacity .5s" }}>
        <tspan fill={C.signal}>GET</tspan> /students/top/3
      </text>
      <path d="M100 110 H108 M196 110 H204 M292 110 H306" stroke={C.faint} />
      {academia.slice(1).map((n, i) => (
        <Edge key={n.label} d={`M${academia[i].x + 44} 110 H${n.x - 34}`} active={active} delay={0.1 + i * 0.12} />
      ))}
      {academia.map((n, i) => (
        <motion.g
          key={n.label}
          initial={false}
          animate={{ opacity: active ? 1 : 0.6, y: active ? 0 : 3 }}
          transition={{ duration: 0.5, ease: ease.out, delay: active ? i * 0.07 : 0 }}
        >
          <Pill x={n.x} y={110} w={i === 0 ? 88 : 68} label={n.label} tone={active && i === 3 ? "accent" : "default"} />
        </motion.g>
      ))}
      <Packet show={active} points={[[100, 110], [306, 110]]} duration={1.8} delay={0.5} />
      {/* ranking bars, by grade */}
      <motion.g initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.4, delay: active ? 1.2 : 0 }}>
        {[46, 38, 30].map((w, i) => (
          <rect key={w} x={225} y={140 + i * 9} width={w} height={4} rx={2} fill={i === 0 ? C.sodium : C.line} />
        ))}
      </motion.g>
      <text x={20} y={204} fontSize={9} letterSpacing={1.4} fill={C.dim} className="font-mono uppercase">
        java · spring boot · spring data jpa
      </text>
    </svg>
  );
}

export const visuals: Partial<Record<ProjectId, ComponentType<VisualProps>>> = {
  gamestore: GameStoreVisual,
  market: MarketVisual,
  academia: AcademiaVisual,
};
