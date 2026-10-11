"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { home, langs, localePath } from "@/lib/dictionary";
import { useLang, useT } from "@/lib/lang";

/*
  EN / ES. Each language is its own set of pages (/, /work/… and /es,
  /es/work/…), so switching is just a link to the same page in the other
  language. scroll={false} keeps you at the same point of the page instead
  of jumping back to the top.
*/
export function LangSwitch({ className }: { className?: string }) {
  const lang = useLang();
  const t = useT();
  const pathname = usePathname();
  // the current page without its language prefix: "/es/work/x" → "/work/x"
  const page = lang === "es" ? pathname.slice(home.es.length) || "/" : pathname;

  return (
    <div className={`flex items-center rounded-full border border-line-strong p-0.5 font-mono text-[11px] uppercase tracking-[0.12em] ${className ?? ""}`}>
      {langs.map((l) =>
        l === lang ? (
          <span key={l} aria-current="true" className="rounded-full bg-fg px-2.5 py-1 text-ink">
            {l}
          </span>
        ) : (
          <Link
            key={l}
            href={localePath(l, page)}
            scroll={false}
            hrefLang={l}
            lang={l}
            aria-label={t.nav.switchLabel}
            className="rounded-full px-2.5 py-1 text-muted transition-colors hover:text-fg"
          >
            {l}
          </Link>
        ),
      )}
    </div>
  );
}
