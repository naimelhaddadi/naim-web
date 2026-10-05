import { Fragment } from "react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ArrowUpRight, Github, Linkedin, Mail } from "@/components/ui/Icons";
import { MaskLines } from "@/components/ui/MaskLines";
import { Reveal } from "@/components/ui/Reveal";

const links = [
  { href: site.github, label: "GitHub", handle: "naimelhaddadi", Icon: Github, external: true },
  { href: site.linkedin, label: "LinkedIn", handle: "in/naimelhaddadi", Icon: Linkedin, external: true },
  { href: `mailto:${site.email}`, label: "Email", handle: site.email, Icon: Mail, external: false },
];

/* The story ends where the loop starts again: a new problem. */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pb-16 pt-[var(--section-y)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(242,161,90,0.12),transparent_65%)]"
      />
      <div className="container-x relative">
        <p className="label mb-10 flex items-center gap-3">
          <span className="text-sodium">(07)</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          Back to Think
        </p>

        <h2 id="contact-title" className="display text-[clamp(3.1rem,10vw,11.5rem)] leading-[0.88]">
          <MaskLines
            lines={[
              "Looking for",
              "the next",
              <Fragment key="last">
                <span className="font-serif font-normal italic tracking-normal text-sodium">problem</span> to solve.
              </Fragment>,
            ]}
          />
        </h2>

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:items-end">
          <Reveal className="min-w-0 lg:col-span-5">
            <p className="max-w-md text-lg text-muted">
              I&apos;m looking for a junior backend opportunity where I can keep learning, contribute from day one and
              build things that matter.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href={`mailto:${site.email}?subject=Hi%20Naim`} size="lg" data-cursor="Write">
                Let&apos;s talk
              </Button>
              <a
                href={site.cv}
                download
                className="h-16 rounded-full border border-line-strong px-7 text-sm leading-[4rem] text-muted transition-colors hover:border-fg/60 hover:text-fg md:h-20 md:px-9 md:leading-[5rem]"
              >
                Download CV
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0 lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-line">
              {links.map(({ href, label, handle, Icon, external }) => (
                <li key={label} className="flex items-center gap-4 border-b border-line">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener" } : {})}
                    className="group flex min-w-0 flex-1 items-center gap-5 py-5"
                  >
                    <Icon className="shrink-0 text-xl text-muted transition-colors group-hover:text-sodium" />
                    <span className="display text-2xl md:text-3xl">{label}</span>
                    <span className="ml-auto truncate font-mono text-xs text-muted transition-colors group-hover:text-fg">
                      {handle}
                    </span>
                    <ArrowUpRight className="shrink-0 text-muted transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                  </a>
                  {label === "Email" && (
                    <CopyEmail email={site.email} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-muted transition-colors hover:border-fg/50 hover:text-fg" />
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
