import { Fragment } from "react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ArrowUpRight } from "@/components/ui/Icons";
import { MaskLines } from "@/components/ui/MaskLines";
import { Reveal } from "@/components/ui/Reveal";

const links = [
  { href: `mailto:${site.email}`, label: "Email", handle: site.email },
  { href: site.linkedin, label: "LinkedIn", handle: "in/naimelhaddadi" },
  { href: site.github, label: "GitHub", handle: "naimelhaddadi" },
  { href: site.cv, label: "CV", handle: "PDF" },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pb-14 pt-[var(--section-y)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(242,161,90,0.1),transparent_65%)]"
      />
      <div className="container-x relative">
        <p className="label mb-10 flex items-center gap-3">
          <span className="text-sodium">(06)</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          Contact
        </p>

        <h2 id="contact-title" className="display text-[clamp(3rem,9.6vw,11rem)] leading-[0.88]">
          <MaskLines
            lines={[
              "Let's build",
              <Fragment key="2">
                something <span className="font-serif font-normal italic tracking-normal text-sodium">useful.</span>
              </Fragment>,
            ]}
          />
        </h2>

        <Reveal className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg">
            Junior Backend Developer
            <span aria-hidden className="h-px w-6 bg-line-strong" />
            <span className="text-muted">Madrid, Spain</span>
          </p>
          <Button href={`mailto:${site.email}?subject=Hi%20Naim`} size="lg" data-cursor="Write">
            Let&apos;s talk
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-16 grid border-t border-line sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {links.map((l) => (
              <li key={l.label} className="flex items-center gap-3 border-b border-line lg:border-b-0 lg:border-r lg:pr-6 lg:last:border-r-0 lg:[&:not(:first-child)]:pl-6">
                <a
                  href={l.href}
                  {...(l.href.startsWith("mailto") ? {} : { target: "_blank", rel: "noopener" })}
                  className="group flex min-w-0 flex-1 items-center gap-4 py-5"
                >
                  <span className="label shrink-0 text-fg">{l.label}</span>
                  <span className="truncate font-mono text-xs text-muted transition-colors group-hover:text-fg">{l.handle}</span>
                  <ArrowUpRight className="ml-auto shrink-0 text-muted transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                </a>
                {l.label === "Email" && (
                  <CopyEmail email={site.email} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-muted transition-colors hover:border-fg/50 hover:text-fg" />
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
