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
    GameStore  a request goes down the layers and comes back as 200 OK
    Academia   students → filtered by course → ranked → statistics
    Market     a price line that reacts to an event, turn by turn
  (LH Sport and the dental clinic use the bigger diagrams in components/diagrams.)
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

/* ── GameStore: Controller → Service → Repository → Database ── */

const layers = [
  { label: "Controller", note: "@RestController · DTO", x: 74 },
  { label: "Service", note: "@Service", x: 196 },
  { label: "Repository", note: "JpaRepository", x: 318 },
  { label: "Database", note: "H2", x: 440 },
];

export function GameStoreVisual({ active }: VisualProps) {
  return (
    <svg viewBox="0 0 520 220" className="h-full w-full" aria-hidden>
      <motion.text
        x={20}
        y={44}
        fontSize={10.5}
        className="font-mono"
        initial={false}
        animate={{ opacity: active ? 1 : 0.5 }}
        fill={C.fg}
      >
        <tspan fill={C.signal}>GET</tspan> /games/top/5
      </motion.text>

      {/* request goes right, response comes back underneath */}
      <path d="M128 98 H142 M250 98 H264 M372 98 H386" stroke={C.faint} />
      <Edge d="M128 98 H142" active={active} delay={0.1} />
      <Edge d="M250 98 H264" active={active} delay={0.2} />
      <Edge d="M372 98 H386" active={active} delay={0.3} />
      <Edge d="M440 124 V150 H74 V124" active={active} delay={0.45} color={C.signal} dashed />

      {layers.map((l, i) => (
        <motion.g
          key={l.label}
          initial={false}
          animate={{ y: active ? 0 : 4, opacity: active ? 1 : 0.6 }}
          transition={{ duration: 0.6, ease: ease.out, delay: active ? i * 0.07 : 0 }}
        >
          <rect x={l.x - 54} y={72} width={108} height={52} rx={4} fill={C.box} stroke={active && i === 3 ? C.sodium : C.line} style={{ transition: "stroke .5s" }} />
          <text x={l.x} y={93} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill={C.fg} fontWeight={500} className="font-sans">
            {l.label}
          </text>
          <text x={l.x} y={110} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={C.muted} className="font-mono">
            {l.note}
          </text>
        </motion.g>
      ))}

      <Packet show={active} points={[[20, 98], [440, 98]]} duration={2} delay={0.5} />
      <Packet show={active} color={C.signal} points={[[440, 124], [440, 150], [74, 150], [74, 124]]} duration={1.6} delay={2.1} />

      <motion.g initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.4, delay: active ? 3.4 : 0 }}>
        <rect x={20} y={168} width={64} height={22} rx={11} fill="#13161b" stroke={C.faint} />
        <text x={52} y={180} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={C.live} className="font-mono">
          200 OK
        </text>
      </motion.g>
    </svg>
  );
}

/* ── Financial Market Simulator: events move the price, turn by turn ── */

const calm = [[20, 120], [70, 112], [120, 118], [170, 104], [220, 110], [270, 98], [320, 104], [370, 96]];
const shocked = [[20, 120], [70, 112], [120, 118], [170, 104], [220, 150], [270, 140], [320, 128], [370, 132]];
const line = (pts: number[][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

export function MarketVisual({ active }: VisualProps) {
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
      {calm.map(([x], i) => (
        <g key={x}>
          <line x1={x} y1={40} x2={x} y2={170} stroke={C.faint} strokeDasharray="2 5" />
          <text x={x} y={188} textAnchor="middle" fontSize={8.5} fill={C.dim} className="font-mono">
            T{i + 1}
          </text>
        </g>
      ))}
      <motion.path
        d={line(calm)}
        fill="none"
        stroke={C.signal}
        strokeWidth={1.5}
        initial={false}
        animate={{ d: line(active ? shocked : calm) }}
        transition={{ duration: 0.9, ease: ease.inOut, delay: active ? 0.5 : 0 }}
      />
      {/* the event that moves the market */}
      <motion.g initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.4, delay: active ? 0.2 : 0 }}>
        <line x1={220} y1={46} x2={220} y2={170} stroke={C.sodium} strokeOpacity={0.7} />
        <rect x={188} y={30} width={64} height={20} rx={10} fill="#13161b" stroke={C.sodium} strokeOpacity={0.6} />
        <text x={220} y={41} textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fill={C.sodium} className="font-mono">
          event
        </text>
      </motion.g>
      <text x={20} y={210} fontSize={9} letterSpacing={1.4} fill={C.dim} className="font-mono uppercase">
        {active ? "input validated · turn processed" : "turn-based · python"}
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
