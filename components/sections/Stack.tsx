import { stack } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/* Three short lists. The projects above are the proof; this is just the index. */
export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="section-y">
      <div className="container-x">
        <SectionHeading index="04" label="Stack" id="stack-title" lines={["Tools I build with."]} />

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          {stack.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.08}>
              <h3 className="label flex items-center justify-between border-b border-line-strong pb-4">
                {group.title}
                <span className="tabular-nums text-dim">{String(group.items.length).padStart(2, "0")}</span>
              </h3>
              <ul>
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group flex items-center justify-between border-b border-line py-3.5 text-lg transition-colors hover:text-fg md:text-xl"
                  >
                    {item}
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-sodium opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
