import { site } from "@/lib/site";
import { ArrowUpRight } from "@/components/ui/Icons";
import { MaskLines } from "@/components/ui/MaskLines";
import { Reveal } from "@/components/ui/Reveal";

/* The mindset behind the work, not a biography. The details are in the CV. */
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
          <h2 id="about-title" className="display text-[clamp(2.4rem,5.4vw,5.75rem)] leading-[0.95]">
            <MaskLines
              lines={[
                "Curiosity got me into computers.",
                <span key="2" className="text-muted">
                  Building things kept me there.
                </span>,
              ]}
            />
          </h2>

          <Reveal delay={0.1} className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
            <p className="text-lg text-muted">
              I&apos;ve always liked taking things apart to understand how they work and how they could work better.
              Programming was the natural next step — about two years ago it became the thing I do every day.
            </p>
            <p className="text-lg text-muted">
              Today I focus on backend development: <span className="text-fg">Java</span>,{" "}
              <span className="text-fg">Spring Boot</span>, <span className="text-fg">databases</span> and the systems
              that connect them.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-14 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[34ch] font-serif text-[clamp(1.45rem,2.4vw,2.2rem)] italic leading-[1.15]">
              I enjoy the part where a vague problem becomes a system you can actually reason about.
            </p>
            <a
              href={site.cv}
              target="_blank"
              rel="noopener"
              data-cursor="Open"
              className="group inline-flex shrink-0 items-center gap-2 self-start border-b border-sodium/50 pb-1 text-sm font-medium transition-colors hover:border-sodium hover:text-sodium md:self-auto"
            >
              View CV
              <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
