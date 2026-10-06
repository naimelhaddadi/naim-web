"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

/*
  The phone version of the project diagrams: the same system, as a single
  readable column instead of a scaled-down drawing. Each row comes in as
  the scroll reaches it and the connector below it draws itself.
*/

export type FlowRow =
  | { kind: "node"; label: string; sub?: string; accent?: boolean }
  | { kind: "pair"; left: { label: string; sub?: string }; right: { label: string; sub?: string } }
  | { kind: "grid"; caption: string; items: string[] };

function Row({ row, p, from, to }: { row: FlowRow; p: MotionValue<number>; from: number; to: number }) {
  const v = useTransform(p, [from, to], [0, 1]);
  const y = useTransform(v, (t) => (1 - t) * 14);
  return (
    <motion.li style={{ opacity: v, y }} className="relative">
      {row.kind === "node" && (
        <div className={`rounded border bg-ink-2 px-4 py-3 ${row.accent ? "border-sodium/60" : "border-line-strong"}`}>
          <p className="text-[15px] font-medium">{row.label}</p>
          {row.sub && <p className="label mt-0.5 text-[0.62rem]">{row.sub}</p>}
        </div>
      )}
      {row.kind === "pair" && (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {[row.left, row.right].map((n, i) => (
            <div key={n.label} className={`rounded border bg-ink-2 px-4 py-3 ${i === 1 ? "col-start-3 border-signal/50" : "border-line-strong"}`}>
              <p className="text-[15px] font-medium">{n.label}</p>
              {n.sub && <p className="label mt-0.5 text-[0.62rem]">{n.sub}</p>}
            </div>
          ))}
          <span aria-hidden className="col-start-2 row-start-1 font-mono text-xs text-signal">⇄</span>
        </div>
      )}
      {row.kind === "grid" && (
        <div className="rounded border border-dashed border-line-strong p-3">
          <p className="label mb-2.5 text-[0.62rem]">{row.caption}</p>
          <ul className="grid grid-cols-3 gap-1.5">
            {row.items.map((item) => (
              <li key={item} className="rounded border border-line bg-ink-2 px-2 py-2 text-center text-[13px]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.li>
  );
}

function Connector({ p, from, to }: { p: MotionValue<number>; from: number; to: number }) {
  const scaleY = useTransform(p, [from, to], [0, 1]);
  return (
    <li aria-hidden className="flex h-7 justify-center">
      <motion.span className="block h-full w-px origin-top bg-line-strong" style={{ scaleY }} />
    </li>
  );
}

export function MobileFlow({ rows, p, label }: { rows: FlowRow[]; p: MotionValue<number>; label: string }) {
  const step = 0.85 / rows.length;
  return (
    <ol aria-label={label} className="flex flex-col">
      {rows.flatMap((row, i) => {
        const from = i * step;
        const items = [<Row key={`r${i}`} row={row} p={p} from={from} to={from + step * 0.8} />];
        if (i < rows.length - 1) items.push(<Connector key={`c${i}`} p={p} from={from + step * 0.6} to={from + step} />);
        return items;
      })}
    </ol>
  );
}
