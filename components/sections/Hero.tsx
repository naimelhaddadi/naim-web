"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import cutout from "@/assets/photos/naim-cutout.webp";
import { OrbitField } from "@/components/hero/OrbitField";
import { Button } from "@/components/ui/Button";
import { Github } from "@/components/ui/Icons";
import { MaskLines } from "@/components/ui/MaskLines";
import { site } from "@/lib/site";
import { ease } from "@/lib/motion";

const motto = ["think", "build", "solve"];

/* The photo melts into the page at the bottom and at the right edge. */
const photoMask = {
  maskImage: "linear-gradient(to top, transparent 2%, #000 26%), linear-gradient(to left, transparent 0%, #000 7%)",
  WebkitMaskImage: "linear-gradient(to top, transparent 2%, #000 26%), linear-gradient(to left, transparent 0%, #000 7%)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const;

const panelMask = {
  maskImage: "linear-gradient(to top, transparent 4%, #000 45%)",
  WebkitMaskImage: "linear-gradient(to top, transparent 4%, #000 45%)",
} as const;

/*
  Entrance, in order: the orbit nodes gather (OrbitField), the photo comes
  out of the "screen", the orbits close around it, then the name and the
  motto. Nothing waits for it: the page can be scrolled from the first frame.
*/
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const figureY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // pointer parallax: the photo (foreground) moves and turns the most, the
  // screen behind it less, the orbits (OrbitField) less still
  const mx = useSpring(useMotionValue(0), { stiffness: 50, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 50, damping: 18 });
  const photoX = useTransform(mx, [-0.5, 0.5], [18, -18]);
  const photoY = useTransform(my, [-0.5, 0.5], [10, -10]);
  const photoTurn = useTransform(mx, [-0.5, 0.5], [-3, 3]);
  const panelX = useTransform(mx, [-0.5, 0.5], [7, -7]);
  const panelY = useTransform(my, [-0.5, 0.5], [4, -4]);
  const panelTurn = useTransform(mx, [-0.5, 0.5], [-1.5, 1.5]);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-name"
      onPointerMove={onPointerMove}
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      <OrbitField anchor={coreRef} scale={figureRef} backClassName="z-0" frontClassName="z-20" />

      {/* Naim, coming out of the screen */}
      <motion.div
        ref={figureRef}
        className="absolute left-1/2 top-[calc(var(--nav-h)-0.5rem)] z-10 aspect-[1086/1102] w-[min(112vw,580px)] -translate-x-[48%] lg:bottom-[-3svh] lg:left-auto lg:right-[2vw] lg:top-auto lg:w-[min(50vw,86svh)] lg:translate-x-0"
        style={reduce ? undefined : { y: figureY }}
      >
        <motion.div aria-hidden className="absolute inset-0" style={reduce ? undefined : { x: panelX, y: panelY, rotateY: panelTurn, transformPerspective: 1600 }}>
          {/* light behind the head */}
          <motion.div
            className="absolute inset-[-20%] bg-[radial-gradient(circle_at_52%_34%,rgba(141,180,255,0.17),transparent_42%),radial-gradient(circle_at_30%_70%,rgba(242,161,90,0.08),transparent_40%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: ease.out, delay: 0.4 }}
          />
          {/* the screen: the head and shoulders break out over its top edge */}
          <motion.div
            className="absolute bottom-0 left-[7%] right-[3%] top-[33%] overflow-hidden rounded-[28px] border border-line-strong bg-gradient-to-b from-ink-3 to-ink"
            style={panelMask}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: ease.out, delay: 0.55 }}
          >
            <div className="hairline-grid absolute inset-0 opacity-60" />
            <div className="absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-signal/70 to-transparent" />
            <p className="label absolute left-5 top-4 text-[0.62rem] text-dim">core</p>
          </motion.div>
        </motion.div>

        <motion.div className="absolute inset-0" style={reduce ? undefined : { x: photoX, y: photoY, rotateY: photoTurn, transformPerspective: 1600 }}>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, y: 46, scale: 0.97, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: ease.out, delay: 0.85 }}
          >
            <div className="absolute inset-0" style={photoMask}>
              <Image
                src={cutout}
                alt="Naim El Haddadi working on his laptop"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 112vw"
                className="object-contain object-bottom [filter:drop-shadow(0_36px_48px_rgba(0,0,0,0.6))_drop-shadow(-12px_-8px_36px_rgba(141,180,255,0.14))]"
              />
            </div>
          </motion.div>
          {/* the nucleus the orbits turn around */}
          <span ref={coreRef} aria-hidden className="absolute left-[52%] top-[34%] size-px" />
        </motion.div>
      </motion.div>

      {/* Copy */}
      <motion.div
        className="container-x relative z-30 flex min-h-[100svh] flex-col pb-8 pt-[calc(var(--nav-h)+min(112vw,580px)*0.78)] lg:pb-10 lg:pt-[calc(var(--nav-h)+8svh)]"
        style={reduce ? undefined : { y: contentY, opacity: fade }}
      >
        <div className="lg:max-w-[50%]">
          <h1 id="hero-name" className="display text-[clamp(2.6rem,5.4vw,6.25rem)]">
            <MaskLines trigger="mount" delay={1.35} lines={["Naim El Haddadi"]} />
          </h1>
          <motion.p
            className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted md:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 1.55 }}
          >
            <span className="text-fg">Backend Developer</span>
          </motion.p>
        </div>

        <div className="flex flex-1 items-end py-10 lg:py-12">
          <p className="display text-[clamp(3.25rem,7.6vw,9rem)] leading-[0.86]">
            <span className="sr-only">I think. I build. I solve.</span>
            {motto.map((word, i) => (
              <span key={word} aria-hidden className="block" style={{ marginLeft: `${i * 0.6}em` }}>
                <MaskLines
                  trigger="mount"
                  delay={1.7 + i * 0.13}
                  lines={[
                    <>
                      I {word}
                      <span className="text-sodium">.</span>
                    </>,
                  ]}
                />
              </span>
            ))}
          </p>
        </div>

        <motion.div
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-5 border-t border-line pt-6 lg:max-w-[50%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: ease.out, delay: 2.2 }}
        >
          <p className="label">Java · Spring Boot · SQL · Python</p>
          <div className="flex items-center gap-3">
            <Button href="#work">View work</Button>
            <Button href={site.github} target="_blank" rel="noopener" variant="ghost" icon={<Github />}>
              GitHub
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
