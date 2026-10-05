import { site } from "@/lib/site";
import { ArrowUpRight } from "@/components/ui/Icons";
import { MaskLines } from "@/components/ui/MaskLines";
import { Reveal } from "@/components/ui/Reveal";

const direction = ["Java", "JPA", "Spring Boot"];

/* Who he is, in three sentences. Everything else is in the CV. */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <p className="label flex items-center gap-3 self-start lg:col-span-3 lg:pt-4">
          <span className="text-sodium">(01)</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          About
        </p>

        <div className="lg:col-span-9">
          <h2 id="about-title" className="display max-w-[20ch] text-[clamp(2.2rem,4.8vw,5rem)] leading-[0.98]">
            <MaskLines lines={["Computers have always been something I liked to experiment with."]} />
          </h2>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[34ch] text-[clamp(1.25rem,2vw,1.75rem)] leading-snug text-muted">
              About two years ago, I started programming seriously — and I haven&apos;t really stopped since.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-14 grid gap-10 border-t border-line pt-8 md:grid-cols-2">
            <p className="max-w-[40ch] text-lg">
              I enjoy understanding problems, figuring out how they work and building the solution.
            </p>
            <div className="flex flex-col gap-6 md:items-end">
              <div>
                <p className="label mb-3">Where I&apos;m heading</p>
                <p className="flex flex-wrap items-center gap-2 font-mono text-sm">
                  {direction.map((step, i) => (
                    <span key={step} className="flex items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 ${i === direction.length - 1 ? "border-sodium/60 text-sodium" : "border-line-strong"}`}>
                        {step}
                      </span>
                      <span aria-hidden className="text-dim">
                        →
                      </span>
                    </span>
                  ))}
                  <span className="text-muted">backend</span>
                </p>
                <p className="mt-3 text-sm text-muted">And Python, because I enjoy it.</p>
              </div>
              <a
                href={site.cv}
                target="_blank"
                rel="noopener"
                data-cursor="Open"
                className="group inline-flex items-center gap-2 border-b border-sodium/50 pb-1 text-sm font-medium transition-colors hover:border-sodium hover:text-sodium"
              >
                View CV
                <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
