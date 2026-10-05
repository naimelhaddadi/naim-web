import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="container-x">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-7 text-sm text-muted">
        <p>© 2026 {site.name} · Madrid</p>
        <p>
          Designed and built by me ·{" "}
          <a href={site.source} target="_blank" rel="noopener" className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-sodium">
            source
          </a>
        </p>
        <a href="#top" className="label transition-colors hover:text-fg">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
