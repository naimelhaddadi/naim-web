"use client";

import { motion, useTransform } from "motion/react";
import { Packet } from "@/components/diagrams/primitives";
import { C, SChip, SEdge, SNode, StageMarkers, useBetween, useRange, type StageProps } from "./stage";

/*
  The dental clinic, built by the scroll. Timeline of p (0 → 1):

    0.00 – 0.06  the thread from the previous project arrives at the top
    0.04 – 0.12  first job: the clinic's website
    0.12 – 0.32  the manual process: one message per patient, by hand
    0.30 – 0.46  appointment → webhook → n8n, on a VPS
    0.48 – 0.72  LLM, WhatsApp Business API, the patient
    0.72 – 1.00  in production: replies come back, messages keep flowing
*/

const JUNCTION: [number, number] = [280, 24];
const RECEPTION: [number, number] = [150, 250];
const patients: [number, number][] = [
  [420, 150],
  [490, 205],
  [415, 265],
  [490, 325],
  [420, 390],
];

function ManualLine({ p, to, i }: { p: StageProps["p"]; to: [number, number]; i: number }) {
  const fade = useRange(p, 0.27, 0.32);
  return (
    <SEdge
      p={p}
      at={[0.14 + i * 0.012, 0.19 + i * 0.012]}
      d={`M${RECEPTION[0] + 62} ${RECEPTION[1]} L${to[0] - 14} ${to[1]}`}
      color={C.faint}
      dashed
      fade={fade}
    />
  );
}

function PatientDot({ p, at, i }: { p: StageProps["p"]; at: [number, number]; i: number }) {
  const opacity = useTransform(p, [0.13 + i * 0.012, 0.17 + i * 0.012, 0.27, 0.32], [0, 1, 1, 0]);
  const [x, y] = at;
  return (
    <motion.g style={{ opacity }} aria-hidden>
      <circle cx={x} cy={y} r={12} fill={C.box} stroke="rgba(255,255,255,0.24)" />
      <circle cx={x} cy={y - 3} r={3.2} fill="#7a8089" />
      <path d={`M${x - 5.5} ${y + 6} a5.5 4.5 0 0 1 11 0`} fill="#7a8089" />
    </motion.g>
  );
}

export function DentalStage({ p, onInspect, still }: StageProps) {
  const manualFade = useRange(p, 0.27, 0.32);
  const live = useBetween(p, 0.8) && !still;
  const manual = useBetween(p, 0.16, 0.29) && !still;
  const n8nStroke = useTransform(p, [0.78, 0.82], [C.line, C.sodium]);
  const patientStroke = useTransform(p, [0.78, 0.82], [C.line, C.sodium]);
  const vps = useRange(p, 0.38, 0.44);
  const junction = useTransform(p, [0.04, 0.06], [0, 1]);

  return (
    <svg viewBox="0 0 560 460" className="h-full w-full overflow-visible" role="group" aria-label="Dental clinic: from manual patient messages to an appointment flow through webhooks, n8n, an LLM and the WhatsApp Business API">
      <StageMarkers />

      {/* the thread from LH arrives here */}
      <SEdge p={p} at={[0, 0.06]} d={`M${JUNCTION[0]} 0 V ${JUNCTION[1]}`} color={C.sodium} width={1.25} />
      <motion.circle cx={JUNCTION[0]} cy={JUNCTION[1]} r={3.5} fill={C.sodium} style={{ opacity: junction }} />

      {/* first: the website */}
      <SEdge p={p} at={[0.05, 0.1]} d={`M${JUNCTION[0]} ${JUNCTION[1]} H 110 V 52`} color={C.line} arrow />
      <SNode p={p} at={[0.08, 0.13]} x={110} y={74} w={136} h={38} label="Clinic website" sub="HTML5 · CSS3" onInspect={onInspect} info="The corporate website for a newly opened private dental clinic." />

      {/* the manual process */}
      {patients.map((pt, i) => (
        <ManualLine key={i} p={p} to={pt} i={i} />
      ))}
      {patients.map((pt, i) => (
        <PatientDot key={i} p={p} at={pt} i={i} />
      ))}
      <SNode p={p} at={[0.12, 0.17]} collapse={manualFade} x={RECEPTION[0]} y={RECEPTION[1]} w={124} h={42} label="By hand" sub="one message each" onInspect={onInspect} info="Confirmations and reminders, one patient at a time." />
      <SChip p={p} at={[0.18, 0.22]} x={300} y={196} w={110} text="Confirm your visit?" fade={manualFade} />
      <SChip p={p} at={[0.2, 0.24]} x={310} y={306} w={120} text="Reminder: tomorrow…" fade={manualFade} />
      {manual &&
        patients.map(([x, y], i) => (
          <Packet key={i} show color="#9aa0a8" r={2.5} points={[[RECEPTION[0] + 62, RECEPTION[1]], [x - 14, y]]} duration={1.4} delay={i * 0.25} />
        ))}

      {/* the automated flow */}
      <motion.rect x={170} y={122} width={366} height={158} rx={6} fill="none" stroke={C.faint} strokeDasharray="4 5" style={{ opacity: vps }} />
      <motion.text x={184} y={272} fontSize={8.5} letterSpacing={1.4} fill={C.dim} className="font-mono uppercase" style={{ opacity: vps }}>
        Linux VPS · administered by me
      </motion.text>

      <SEdge p={p} at={[0.3, 0.34]} d={`M${JUNCTION[0]} ${JUNCTION[1]} V 60`} color={C.sodium} width={1.25} />
      <SNode p={p} at={[0.31, 0.36]} x={280} y={80} w={128} h={36} label="Appointment" sub="booked" onInspect={onInspect} info="An appointment is what starts the conversation." />
      <SEdge p={p} at={[0.34, 0.38]} d="M280 98 V 134" arrow />
      <SNode p={p} at={[0.35, 0.4]} x={280} y={152} w={116} h={34} label="Webhook" sub="event in" onInspect={onInspect} info="Webhooks bring appointment events into the workflows." />
      <SEdge p={p} at={[0.4, 0.44]} d="M280 169 V 208" arrow />
      <SNode p={p} at={[0.4, 0.46]} x={280} y={232} w={132} h={44} label="n8n" sub="workflows" stroke={n8nStroke} onInspect={onInspect} info="The n8n workflows handle appointments, confirmations and reminders." />

      <SEdge p={p} at={[0.48, 0.53]} d="M346 232 H 396" dashed />
      <SNode p={p} at={[0.49, 0.55]} x={452} y={232} w={110} h={34} label="LLM" sub="integration" stroke={C.signal} onInspect={onInspect} info="An LLM integrated into the conversation flow." />

      <SEdge p={p} at={[0.56, 0.6]} d="M280 254 V 298" arrow />
      <SNode p={p} at={[0.57, 0.63]} x={280} y={318} w={180} h={36} label="WhatsApp Business API" sub="messages" onInspect={onInspect} info="Messages are sent and received through the WhatsApp Business API." />
      <SEdge p={p} at={[0.64, 0.68]} d="M280 336 V 382" arrow />
      <SNode p={p} at={[0.65, 0.71]} x={280} y={404} w={120} h={42} label="Patient" sub="real people" stroke={patientStroke} onInspect={onInspect} info="Real patients: the system is in production." />

      {/* replies come back */}
      <SEdge p={p} at={[0.72, 0.8]} d="M220 404 H 130 V 232 H 210" color={C.signal} dashed arrow />
      <SChip p={p} at={[0.78, 0.82]} x={450} y={382} w={120} text="Reminder sent" tone={C.sodium} />
      <SChip p={p} at={[0.8, 0.84]} x={450} y={408} w={120} text="Confirmed ✓" tone={C.live} />
      <SChip p={p} at={[0.84, 0.88]} x={450} y={434} w={150} text="● in production" tone={C.live} />

      <Packet show={live} points={[[280, 98], [280, 134], [280, 208], [280, 298], [280, 382]]} duration={2.6} />
      <Packet show={live} color={C.signal} points={[[220, 404], [130, 404], [130, 232], [210, 232]]} duration={1.8} delay={1.6} />
      <Packet show={live} color={C.signal} r={2.5} points={[[346, 232], [396, 232]]} duration={0.7} delay={1.1} />
    </svg>
  );
}
