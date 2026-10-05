import { site } from "@/lib/site";
import { MadridClock } from "@/components/ui/MadridClock";
import { ArrowUpRight } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="container-x">
      <div className="grid gap-6 border-t border-line py-8 text-sm text-muted md:grid-cols-3 md:items-center">
        <p>© 2026 {site.name}</p>
        <p className="md:text-center">
          Designed and built by me — Next.js, TypeScript, Tailwind, Motion.{" "}
          <a href={site.source} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-sodium">
            Source <ArrowUpRight />
          </a>
        </p>
        <div className="flex items-center justify-between gap-6 md:justify-end">
          <MadridClock className="label tabular-nums" />
          <a href="#top" className="label transition-colors hover:text-fg">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
