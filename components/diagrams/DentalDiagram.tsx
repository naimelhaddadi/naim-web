"use client";

import { motion } from "motion/react";
import { Caption, Edge, Markers, Node, Packet, type DiagramProps } from "./primitives";

/*
  Dental clinic automation — four states that follow the story:
  0 manual       reception messaging patients one by one
  1 repetitive   the same messages going out again and again
  2 automation   webhook → n8n (+ LLM) → WhatsApp Business API → patient, on a VPS
  3 real         live traffic: reminders out, confirmations back
*/

const patients: [number, number][] = [
  [440, 70],
  [500, 140],
  [430, 205],
  [505, 270],
  [440, 335],
  [500, 395],
];

const RECEPTION: [number, number] = [120, 232];

function Bubble({ x, y, w = 74, text, show, tone = "#ecebe7", delay = 0 }: { x: number; y: number; w?: number; text: string; show: boolean; tone?: string; delay?: number }) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }}
      transition={{ duration: 0.6, delay: show ? delay : 0 }}
      aria-hidden
    >
      <rect x={x} y={y} width={w} height={20} rx={10} fill="#13161b" stroke="rgba(255,255,255,0.14)" />
      <text x={x + w / 2} y={y + 11} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={tone} className="font-sans">
        {text}
      </text>
    </motion.g>
  );
}

export function DentalDiagram({ step, onInspect }: DiagramProps) {
  const manual = step <= 1;
  const repetitive = step === 1;
  const auto = step >= 2;
  const live = step >= 3;
  const node = { onInspect, show: auto };

  return (
    <svg viewBox="0 0 560 440" className="h-auto w-full" role="group" aria-label="Diagram: from manual patient messaging to an automated WhatsApp workflow">
      <Markers />

      {/* ── Before: reception messaging every patient by hand ── */}
      <Node x={RECEPTION[0]} y={RECEPTION[1]} w={120} h={44} label="Reception" sub="by hand" show={manual} tone={repetitive ? "accent" : "default"} info="Staff messaging every patient manually." onInspect={onInspect} />
      {patients.map(([x, y], i) => (
        <g key={i} style={{ opacity: manual ? 1 : 0, transition: "opacity .6s" }} aria-hidden>
          <line x1={RECEPTION[0] + 60} y1={RECEPTION[1]} x2={x - 14} y2={y} stroke="rgba(255,255,255,0.1)" strokeDasharray="2 5" />
          <circle cx={x} cy={y} r={12} fill="#0e1014" stroke="rgba(255,255,255,0.22)" />
          <circle cx={x} cy={y - 3} r={3.2} fill="#7a8089" />
          <path d={`M${x - 5.5} ${y + 6} a5.5 4.5 0 0 1 11 0`} fill="#7a8089" />
          {(i === 1 || i === 4) && (
            <text x={x} y={y + 24} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#5e646d" className="font-mono uppercase" letterSpacing={1}>
              {i === 1 ? "no reply" : "no-show"}
            </text>
          )}
        </g>
      ))}
      {manual &&
        patients.map(([x, y], i) => (
          <Packet
            key={`m${i}`}
            show
            color="#9aa0a8"
            r={2.5}
            points={[[RECEPTION[0] + 60, RECEPTION[1]], [x - 14, y]]}
            duration={repetitive ? 1.3 : 2.6}
            delay={i * (repetitive ? 0.22 : 0.9)}
          />
        ))}
      <Bubble x={190} y={150} w={92} text="Reminder: tomorrow…" show={repetitive} />
      <Bubble x={210} y={300} w={86} text="Can you confirm?" show={repetitive} delay={0.2} />
      <Bubble x={170} y={350} w={92} text="Reminder: tomorrow…" show={repetitive} delay={0.4} />
      <Caption x={RECEPTION[0]} y={290} anchor="middle" show={repetitive}>
        same message · every day
      </Caption>

      {/* ── After: the automated flow ── */}
      <Edge d="M190 18 H546 V214 H190 Z" show={auto} tone="faint" dashed />
      <Caption x={202} y={36} show={auto}>
        Linux VPS · administered by me
      </Caption>

      <Node {...node} x={84} y={86} w={112} label="Appointment" sub="booked" info="A new or upcoming appointment is the trigger." />
      <Node {...node} x={262} y={86} w={100} label="Webhook" sub="event in" info="Webhooks push appointment events into the workflow." delay={0.1} />
      <Node {...node} x={438} y={86} w={124} h={44} label="n8n" sub="workflows" tone={live ? "accent" : "default"} glow={live} info="n8n orchestrates appointments, confirmations and reminders." delay={0.2} />
      <Node {...node} x={438} y={176} w={124} label="LLM" sub="integration" tone={live ? "signal" : "default"} info="An LLM integrated into the conversation flow." delay={0.3} />
      <Node {...node} x={438} y={270} w={156} label="WhatsApp Business API" sub="messages" info="Messages are sent and received through the official WhatsApp Business API." delay={0.4} />
      <Node {...node} x={438} y={372} w={112} h={44} label="Patient" sub="real people" tone={live ? "accent" : "default"} info="Real patients receiving reminders and confirming appointments." delay={0.5} />

      <Edge d="M140 86 H206" show={auto} arrow delay={0.3} />
      <Edge d="M312 86 H370" show={auto} arrow delay={0.4} />
      <Edge d="M438 108 V158" show={auto} delay={0.5} dashed />
      <Edge d="M418 194 V252" show={auto} arrow delay={0.6} />
      <Edge d="M418 288 V346" show={auto} arrow delay={0.7} />
      {/* reply path */}
      <Edge d="M494 372 H528 V86 H502" show={auto} tone="signal" dashed arrow delay={0.8} />

      <Bubble x={236} y={340} w={100} text="Reminder sent" show={live} tone="#f2a15a" />
      <Bubble x={250} y={372} w={86} text="Confirmed ✓" show={live} tone="#7fd6a4" delay={0.5} />
      <Bubble x={236} y={404} w={100} text="Reply received" show={live} tone="#8db4ff" delay={1} />

      <Packet show={live} points={[[140, 86], [206, 86], [312, 86], [376, 86], [418, 86], [418, 252], [418, 288], [418, 350]]} duration={3.4} />
      <Packet show={live} color="#8db4ff" points={[[494, 372], [528, 372], [528, 86], [502, 86]]} duration={2} delay={2.2} />
    </svg>
  );
}
