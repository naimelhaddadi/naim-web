"use client";

import { motion } from "motion/react";
import type { ComponentType } from "react";
import type { ProjectId } from "@/lib/content";
import { Packet } from "@/components/diagrams/primitives";
import { ease } from "@/lib/motion";

/*
  The small diagrams on the project cards. Each one tells its project's
  story in one move when the card becomes active (hover, focus, or simply
  being on screen on touch devices):
    LH Sport   scattered pieces snap into a connected model
    Market     a price line that reacts to an event, turn by turn
    Academia   students → filtered by course → ranked → statistics
    Dental     appointment → n8n → WhatsApp → patient, and the reply back
    GameStore  a request goes down the layers and comes back as 200 OK
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

/* ── LH Sport: from scattered information to a structured system ── */

const lhNodes = [
  { id: "player", label: "Player", x: 168, y: 132, w: 74, scatter: [-34, 44, -9] },
  { id: "transfer", label: "Transfer", x: 292, y: 78, w: 80, scatter: [46, -22, 11] },
  { id: "more", label: "+ more", x: 336, y: 178, w: 70, scatter: [30, 38, -14] },
  { id: "contract", label: "Contract", x: 236, y: 206, w: 80, scatter: [-56, 18, 8] },
  { id: "agent", label: "Agent", x: 70, y: 74, w: 64, scatter: [18, 66, 12] },
] as const;

export function LhVisual({ active }: VisualProps) {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" aria-hidden>
      {/* the relations only exist once the model is structured */}
      <Edge d="M205 132 H261 V92" active={active} delay={0.25} />
      <Edge d="M292 92 V150 H301" active={active} delay={0.35} />
      <Edge d="M168 146 V206 H196" active={active} delay={0.45} />
      <Edge d="M276 206 H292 V92" active={active} delay={0.55} color={C.faint} />
      <Edge d="M131 132 H70 V88" active={active} delay={0.4} />

      {lhNodes.map((n, i) => (
        <motion.g
          key={n.id}
          initial={false}
          animate={
            active
              ? { x: 0, y: 0, rotate: 0, opacity: 1 }
              : { x: n.scatter[0], y: n.scatter[1], rotate: n.scatter[2], opacity: 0.55 }
          }
          transition={{ duration: 0.9, ease: ease.out, delay: active ? i * 0.04 : 0 }}
        >
          <Pill x={n.x} y={n.y} w={n.w} label={n.label} tone={active && n.id === "player" ? "accent" : active ? "signal" : "default"} />
        </motion.g>
      ))}

      <Packet show={active} points={[[205, 132], [261, 132], [261, 92], [292, 92], [292, 150], [301, 150]]} duration={2.6} delay={0.9} />
      <Packet show={active} color={C.signal} points={[[168, 146], [168, 206], [196, 206]]} duration={1.6} delay={1.6} />

      <text x={16} y={244} fontSize={9} letterSpacing={1.4} fill={C.dim} className="font-mono uppercase">
        {active ? "sql server · 10+ entities" : "scattered · duplicated · unlinked"}
      </text>
    </svg>
  );
}

/* ── Dental: appointment → n8n → WhatsApp → patient ── */

export function DentalVisual({ active }: VisualProps) {
  const row = 104;
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" aria-hidden>
      <g opacity={active ? 1 : 0.6} style={{ transition: "opacity .6s" }}>
        <Pill x={58} y={row} w={92} label="Appointment" />
        <Pill x={160} y={row} w={58} label="n8n" tone={active ? "accent" : "default"} />
        <Pill x={256} y={row} w={84} label="WhatsApp" />
        <Pill x={350} y={row} w={68} label="Patient" tone={active ? "signal" : "default"} />
      </g>
      <path d={`M104 ${row} H131 M189 ${row} H214 M298 ${row} H316`} stroke={C.faint} />
      <Edge d={`M104 ${row} H131`} active={active} delay={0.1} color={C.line} />
      <Edge d={`M189 ${row} H214`} active={active} delay={0.25} color={C.line} />
      <Edge d={`M298 ${row} H316`} active={active} delay={0.4} color={C.line} />
      {/* the reply comes back to the workflow */}
      <Edge d={`M350 ${row + 14} V176 H160 V${row + 14}`} active={active} delay={0.55} color={C.signal} dashed />

      <Packet show={active} points={[[104, row], [214, row], [298, row], [316, row]]} duration={2.2} delay={0.6} />
      <Packet show={active} color={C.signal} points={[[350, row + 14], [350, 176], [160, 176], [160, row + 14]]} duration={1.8} delay={1.9} />

      <motion.g initial={false} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 6 }} transition={{ duration: 0.5, delay: active ? 0.9 : 0 }}>
        <rect x={214} y={38} width={128} height={24} rx={12} fill="#13161b" stroke={C.faint} />
        <text x={278} y={51} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={C.sodium} className="font-sans">
          Reminder: tomorrow 10:00
        </text>
      </motion.g>
      <motion.g initial={false} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 6 }} transition={{ duration: 0.5, delay: active ? 2.2 : 0 }}>
        <rect x={204} y={190} width={92} height={24} rx={12} fill="#13161b" stroke={C.faint} />
        <text x={250} y={203} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={C.live} className="font-sans">
          Confirmed ✓
        </text>
      </motion.g>

      <text x={16} y={244} fontSize={9} letterSpacing={1.4} fill={C.dim} className="font-mono uppercase">
        {active ? "automated · in production" : "by hand · one message at a time"}
      </text>
    </svg>
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

export const visuals: Record<ProjectId, ComponentType<VisualProps>> = {
  "lh-sport": LhVisual,
  dental: DentalVisual,
  gamestore: GameStoreVisual,
  market: MarketVisual,
  academia: AcademiaVisual,
};
