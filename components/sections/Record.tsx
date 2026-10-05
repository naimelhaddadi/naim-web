import { record } from "@/lib/content";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { Download, FileText } from "@/components/ui/Icons";

/* Education and languages: deliberately compact, the work above carries the weight. */
export function Record() {
  return (
    <section aria-labelledby="record-title" className="pb-[var(--section-y)]">
      <div className="container-x">
        <Reveal className="grid gap-12 border-t border-line pt-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="label flex items-center gap-3">
              <span className="text-sodium">(06)</span>
              <span className="h-px w-8 bg-line-strong" aria-hidden />
              <span id="record-title">Record</span>
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 text-sm">
              <a href={site.cv} download className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-fg">
                <Download className="text-sodium" /> Download CV (PDF)
              </a>
              <a href={site.letter} target="_blank" rel="noopener" className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-fg">
                <FileText className="text-sodium" /> Recommendation letter
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h3 className="label mb-4">Education</h3>
            <ul className="border-t border-line">
              {record.education.map((e) => (
                <li key={e.title} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-line py-4">
                  <span className="font-medium">{e.title}</span>
                  <span className="text-right font-mono text-xs tabular-nums text-muted">{e.date ?? ""}</span>
                  <span className="text-sm text-muted">{e.sub}</span>
                  {e.note && (
                    <span className="text-right font-mono text-xs text-sodium">{e.note}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="label mb-4">Languages</h3>
            <ul className="border-t border-line">
              {record.languages.map((l) => (
                <li key={l.name} className="flex justify-between gap-6 border-b border-line py-4">
                  <span>{l.name}</span>
                  <span className="font-mono text-xs text-muted">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
