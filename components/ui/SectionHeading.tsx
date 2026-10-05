import type { ReactNode } from "react";
import { MaskLines } from "./MaskLines";

type SectionHeadingProps = {
  index: string;
  label: string;
  id?: string;
  lines: ReactNode[];
  aside?: ReactNode;
};

/* "(03) — Selected work" index line followed by a large masked heading. */
export function SectionHeading({ index, label, id, lines, aside }: SectionHeadingProps) {
  return (
    <header className="grid gap-8 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <p className="label mb-6 flex items-center gap-3">
          <span className="text-sodium">({index})</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          {label}
        </p>
        <h2 id={id} className="display text-[clamp(2.75rem,7vw,7.5rem)]">
          <MaskLines lines={lines} />
        </h2>
      </div>
      {aside && <div className="text-muted md:col-span-4 md:pb-3">{aside}</div>}
    </header>
  );
}
