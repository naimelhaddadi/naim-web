"use client";

import { Caption, Edge, Markers, Node, Packet, type DiagramProps } from "./primitives";

/*
  LH Sport & Entertainment Management — four states that follow the story:
  0 problem   scattered player information, no structure
  1 thinking  the domain modelled as entities, not yet connected
  2 system    relations + the capture pipeline (form → T-SQL → SQL Server)
  3 result    data flowing from a scout's form into one consistent model
*/

const E = { w: 92, h: 32 };
const ent = {
  agent: { x: 92, y: 182, label: "Agent", info: "Agents representing players. Linked to the player record." },
  player: { x: 210, y: 270, label: "Player", info: "The centre of the model. Every other entity connects back here." },
  club: { x: 400, y: 270, label: "Club", info: "Clubs players belong to, each one part of a league." },
  league: { x: 470, y: 182, label: "League", info: "Competitions clubs play in." },
  transfer: { x: 92, y: 370, label: "Transfer", info: "Movements between clubs, tied to a player and the clubs involved." },
  contract: { x: 305, y: 370, label: "Contract", info: "Agreements between a player and a club. Integrity enforced by constraints and triggers." },
} as const;

const fragments = [
  { x: 120, y: 190, r: -8, t: "player · notes" },
  { x: 300, y: 165, r: 6, t: "club ?" },
  { x: 440, y: 230, r: -4, t: "contract" },
  { x: 180, y: 300, r: 10, t: "agent" },
  { x: 380, y: 330, r: -10, t: "player (dup)" },
  { x: 110, y: 385, r: 4, t: "transfer" },
  { x: 470, y: 380, r: 7, t: "league" },
  { x: 270, y: 240, r: -3, t: "stats" },
];

export function LhDiagram({ step, onInspect }: DiagramProps) {
  const problem = step === 0;
  const modelled = step >= 1;
  const system = step >= 2;
  const result = step >= 3;
  const node = { onInspect, show: system };

  return (
    <svg viewBox="0 0 560 440" className="h-auto w-full" role="group" aria-label="Diagram: from scattered player data to a relational model in SQL Server">
      <Markers />

      {/* Capture pipeline */}
      <Node x={60} y={56} w={92} label="Scouts" sub="register" tone={result ? "accent" : "default"} onInspect={onInspect} info="Several scouts collecting player information." />
      <Node {...node} x={186} y={56} w={104} label="Web form" sub="data capture" info="A web interface with forms. Registering a player inserts it straight into the database." delay={0.1} />
      <Node {...node} x={330} y={56} w={128} label="T-SQL" sub="procs · triggers" info="Stored procedures and triggers hold the business rules, so the data stays consistent." delay={0.2} />
      <Node {...node} x={482} y={56} w={112} label="SQL Server" sub="10+ entities" tone={result ? "accent" : "default"} info="Relational database designed from scratch: 10+ interconnected entities." delay={0.3} />
      <Edge d="M106 56 H132" show={system} arrow delay={0.2} />
      <Edge d="M238 56 H264" show={system} arrow delay={0.3} />
      <Edge d="M394 56 H424" show={system} arrow delay={0.4} />
      <Edge d="M482 74 V118" show={system} arrow delay={0.5} />

      {/* Database boundary */}
      <Edge d="M14 120 H546 V426 H14 Z" show={modelled} tone="faint" dashed />
      <Caption x={26} y={140} show={modelled}>
        {system ? "Relational model · referential integrity" : "Domain model · first draft"}
      </Caption>

      {/* Problem: loose, inconsistent fragments */}
      {fragments.map((f, i) => (
        <g key={f.t} style={{ opacity: problem ? 1 : 0, transition: `opacity .6s ${problem ? i * 0.05 : 0}s` }} aria-hidden>
          <line x1={60} y1={76} x2={f.x} y2={f.y} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 5" />
          <g transform={`rotate(${f.r} ${f.x} ${f.y})`}>
            <rect x={f.x - 40} y={f.y - 11} width={80} height={22} rx={3} fill="#0e1014" stroke="rgba(255,255,255,0.14)" strokeDasharray="3 3" />
            <text x={f.x} y={f.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#7a8089" className="font-mono">
              {f.t}
            </text>
          </g>
        </g>
      ))}

      {/* Relations */}
      <Edge d={`M${ent.player.x + 46} 270 H${ent.club.x - 46}`} show={system} delay={0.3} />
      <Edge d={`M${ent.player.x - 30} ${ent.player.y - 16} L${ent.agent.x + 20} ${ent.agent.y + 16}`} show={system} delay={0.35} />
      <Edge d={`M${ent.club.x + 26} ${ent.club.y - 16} L${ent.league.x - 14} ${ent.league.y + 16}`} show={system} delay={0.4} />
      <Edge d={`M${ent.player.x + 20} ${ent.player.y + 16} L${ent.contract.x - 26} ${ent.contract.y - 16}`} show={system} delay={0.45} />
      <Edge d={`M${ent.contract.x + 26} ${ent.contract.y - 16} L${ent.club.x - 20} ${ent.club.y + 16}`} show={system} delay={0.5} />
      <Edge d={`M${ent.transfer.x + 20} ${ent.transfer.y - 16} L${ent.player.x - 26} ${ent.player.y + 16}`} show={system} delay={0.55} />
      <Edge d={`M${ent.transfer.x + 30} ${ent.transfer.y + 16} Q 250 432 ${ent.club.x + 30} ${ent.club.y + 16}`} show={system} delay={0.6} />

      {/* Entities */}
      {Object.values(ent).map((e, i) => (
        <Node
          key={e.label}
          x={e.x}
          y={e.y}
          w={E.w}
          h={E.h}
          label={e.label}
          dashed={!system}
          tone={result && e.label === "Player" ? "accent" : result ? "signal" : "default"}
          glow={result && e.label === "Player"}
          show={modelled}
          delay={0.08 * i}
          info={e.info}
          onInspect={onInspect}
        />
      ))}
      <Node x={470} y={370} w={92} h={32} label="+ more" tone="ghost" dashed show={modelled} delay={0.5} info="More entities beyond these six — over ten in total." onInspect={onInspect} />

      {/* Result: a registration travelling through the system */}
      <Packet show={result} points={[[106, 56], [482, 56], [482, 150], [482, 230], [ent.club.x + 46, 270], [ent.player.x + 46, 270]]} duration={3.2} />
      <Packet show={result} color="#8db4ff" r={2.5} points={[[ent.player.x, 286], [ent.contract.x - 26, 354], [ent.contract.x + 26, 354], [ent.club.x - 20, 286]]} duration={2.4} delay={1.6} />
      <Packet show={result} color="#8db4ff" r={2.5} points={[[ent.player.x - 30, 254], [ent.agent.x + 20, 198]]} duration={1.2} delay={2.2} />
    </svg>
  );
}
