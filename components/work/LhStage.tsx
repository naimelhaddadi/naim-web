"use client";

import { motion, useTransform } from "motion/react";
import { Packet } from "@/components/diagrams/primitives";
import { C, SChip, SEdge, SNode, StageMarkers, useBetween, useRange, type StageProps } from "./stage";

/*
  LH Management, built by the scroll. Timeline of p (0 → 1):

    0.00 – 0.18  the problem: loose fragments of player information
    0.16 – 0.34  the data model: entities appear, still a draft (dashed)
    0.33 – 0.48  the database: SQL Server around them, relations drawn
    0.48 – 0.58  business logic: stored procedures and triggers
    0.60 – 0.70  the web interface on top, feeding the database
    0.72 – 0.84  running: data moves through the model
    0.84 – 1.00  everything folds into one point, and a line leaves
                 downwards — the thread the next project picks up

  The case-study page stops before the fold.
*/

export const LH = { POINT: [280, 440] as [number, number], BUILT: 0.8 };

const ENT = { w: 96, h: 32 };
const entities = [
  { id: "agent", x: 110, y: 232, label: "Agents", info: "Agents representing players, linked to the player record." },
  { id: "club", x: 450, y: 232, label: "Clubs", info: "Clubs, each one part of a league." },
  { id: "player", x: 280, y: 300, label: "Players", info: "The centre of the model: almost every other entity connects back here." },
  { id: "league", x: 466, y: 330, label: "Leagues", info: "The competitions clubs play in." },
  { id: "transfer", x: 110, y: 372, label: "Transfers", info: "Movements between clubs, tied to a player and the clubs involved." },
  { id: "contract", x: 360, y: 384, label: "Contracts", info: "Agreements between players and clubs, protected by constraints and triggers." },
  { id: "more", x: 230, y: 398, label: "+ more", info: "More than 10 entities in total." },
];
const E = Object.fromEntries(entities.map((e) => [e.id, e])) as Record<string, (typeof entities)[number]>;

const relations: [string, string][] = [
  ["player", "agent"],
  ["player", "club"],
  ["club", "league"],
  ["player", "contract"],
  ["contract", "club"],
  ["transfer", "player"],
];

const fragments = [
  { x: 130, y: 200, r: -8, t: "player · notes" },
  { x: 330, y: 170, r: 6, t: "club ?" },
  { x: 450, y: 250, r: -4, t: "contract" },
  { x: 190, y: 300, r: 10, t: "agent" },
  { x: 390, y: 340, r: -10, t: "player (dup)" },
  { x: 120, y: 390, r: 4, t: "transfer" },
  { x: 470, y: 400, r: 7, t: "league" },
  { x: 290, y: 250, r: -3, t: "stats" },
];

function Fragment({ p, f, i }: { p: StageProps["p"]; f: (typeof fragments)[number]; i: number }) {
  const opacity = useTransform(p, [0, 0.03 + i * 0.006, 0.13, 0.18], [0, 1, 1, 0]);
  const drift = useTransform(p, [0.12, 0.18], [0, 1]);
  const x = useTransform(drift, (d) => (280 - f.x) * d * 0.4);
  const y = useTransform(drift, (d) => (300 - f.y) * d * 0.4);
  return (
    <motion.g style={{ opacity, x, y }} aria-hidden>
      <g transform={`rotate(${f.r} ${f.x} ${f.y})`}>
        <rect x={f.x - 42} y={f.y - 11} width={84} height={22} rx={3} fill={C.box} stroke="rgba(255,255,255,0.14)" strokeDasharray="3 3" />
        <text x={f.x} y={f.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#7a8089" className="font-mono">
          {f.t}
        </text>
      </g>
    </motion.g>
  );
}

export function LhStage({ p, onInspect, still }: StageProps) {
  const fold = useRange(p, 0.84, 0.96);
  const solid = useTransform(p, (v): string => (v < 0.4 ? "4 4" : "0"));
  const running = useBetween(p, 0.72, 0.86) && !still;
  const entityStroke = useTransform(p, [0.7, 0.74], [C.line, C.signal]);
  const accentStroke = useTransform(p, [0.7, 0.74], [C.line, C.sodium]);
  const boundaryOpacity = useTransform([useRange(p, 0.33, 0.38), fold], ([v, c]: number[]) => v * (1 - c));
  const captionOpacity = boundaryOpacity;

  const common = { p, collapse: fold, to: LH.POINT, onInspect };

  return (
    <svg viewBox="0 0 560 460" className="h-full w-full overflow-visible" role="group" aria-label="LH Management: a web form feeding a SQL Server relational model of players, clubs, leagues, contracts, agents and transfers">
      <StageMarkers />

      {fragments.map((f, i) => (
        <Fragment key={f.t} p={p} f={f} i={i} />
      ))}

      {/* database boundary */}
      <motion.rect x={24} y={168} width={512} height={258} rx={6} fill="none" stroke={C.faint} strokeDasharray="4 5" style={{ opacity: boundaryOpacity }} />
      <motion.text x={40} y={190} fontSize={8.5} letterSpacing={1.4} fill={C.dim} className="font-mono uppercase" style={{ opacity: captionOpacity }}>
        Relational model · referential integrity
      </motion.text>

      {/* relations */}
      {relations.map(([a, b], i) => (
        <SEdge key={a + b} p={p} at={[0.37 + i * 0.015, 0.46 + i * 0.015]} d={`M${E[a].x} ${E[a].y} L${E[b].x} ${E[b].y}`} fade={fold} />
      ))}

      {/* entities */}
      {entities.map((e, i) => (
        <SNode
          key={e.id}
          {...common}
          at={[0.16 + i * 0.022, 0.24 + i * 0.022]}
          x={e.x}
          y={e.y}
          w={ENT.w}
          h={ENT.h}
          label={e.label}
          info={e.info}
          dash={e.id === "more" ? "4 4" : solid}
          stroke={e.id === "player" ? accentStroke : e.id === "more" ? C.faint : entityStroke}
          textTone={e.id === "more" ? C.muted : C.fg}
        />
      ))}

      {/* SQL Server */}
      <SEdge p={p} at={[0.36, 0.42]} d="M280 138 V166" arrow fade={fold} />
      <SNode {...common} at={[0.33, 0.39]} x={280} y={118} w={160} h={40} label="SQL Server" sub="T-SQL · 10+ entities" stroke={accentStroke} info="The relational database, designed and implemented from scratch." />

      {/* business logic */}
      <SEdge p={p} at={[0.5, 0.56]} d="M156 118 H200" dashed fade={fold} />
      <SEdge p={p} at={[0.52, 0.58]} d="M404 118 H360" dashed fade={fold} />
      <SNode {...common} at={[0.48, 0.54]} x={104} y={118} w={104} h={30} label="Procedures" info="T-SQL stored procedures carry the business logic." />
      <SNode {...common} at={[0.5, 0.56]} x={452} y={118} w={96} h={30} label="Triggers" info="Triggers keep the data consistent whenever it changes." />

      {/* web interface */}
      <SEdge p={p} at={[0.63, 0.7]} d="M280 61 V96" arrow fade={fold} />
      <SNode {...common} at={[0.6, 0.66]} x={280} y={42} w={132} h={38} label="Web form" sub="data entry" info="The web interface that connects the agency's workflow with the database." />

      {/* result */}
      <SChip p={p} at={[0.76, 0.8]} x={452} y={42} w={170} text="Recommendation letter ✓" tone={C.live} fade={fold} />

      <Packet show={running} points={[[280, 61], [280, 98], [280, 138], [280, 168], [280, 284]]} duration={2.4} />
      <Packet show={running} color={C.signal} r={2.5} points={[[280, 300], [450, 232], [466, 330]]} duration={2} delay={1.2} />
      <Packet show={running} color={C.signal} r={2.5} points={[[280, 300], [360, 384]]} duration={1.2} delay={1.8} />

      {/* the fold: one point, then the thread down to the next project */}
      <motion.circle cx={LH.POINT[0]} cy={LH.POINT[1]} r={3.5} fill={C.sodium} style={{ opacity: useTransform(p, [0.9, 0.94], [0, 1]) }} />
      <SEdge p={p} at={[0.93, 1]} d={`M${LH.POINT[0]} ${LH.POINT[1]} V 460`} color={C.sodium} width={1.25} />
    </svg>
  );
}
