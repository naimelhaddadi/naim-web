"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import portrait from "@/assets/photos/naim-portrait-cutout.webp";
import { OrbitField } from "@/components/hero/OrbitField";
import { Button } from "@/components/ui/Button";
import { Github } from "@/components/ui/Icons";
import { MaskLines } from "@/components/ui/MaskLines";
import { site } from "@/lib/site";
import { ease } from "@/lib/motion";
import { useCalm } from "@/lib/useCalm";

const motto = ["think", "build", "solve"];

/* The portrait melts into the page at the bottom and at both shoulders. */
const photoMask = {
  maskImage: "linear-gradient(to top, transparent 2%, #000 32%), linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(to top, transparent 2%, #000 32%), linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const;

/*
  Entrance, in order: the orbits draw themselves (OrbitField), the photo
  rises into the middle of them, the atoms appear, then the name and the
  motto. Nothing waits for it: the page can be scrolled from the first frame.
*/
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLSpanElement>(null);
  const reduce = useCalm();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  /*
    On the way out (one continuous move, no pause):
      Naim drifts up and back (smaller, dimmer) — he stays the core
      the orbit system opens up and its nodes leave the frame (OrbitField)
      the type shrinks towards the bottom-left and lifts away
      each line of the motto slides its own way
      the page darkens from the bottom into the next section
  */
  const figureY = useTransform(scrollYProgress, [0, 1], ["0%", "-9%"]);
  const figureScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const figureFade = useTransform(scrollYProgress, [0.2, 0.95], [1, 0.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const fade = useTransform(scrollYProgress, [0.1, 0.75], [1, 0]);
  const dusk = useTransform(scrollYProgress, [0, 0.65], [0, 1]);
  const mottoX = [
    useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]),
    useTransform(scrollYProgress, [0, 1], ["0%", "6%"]),
    useTransform(scrollYProgress, [0, 1], ["0%", "-3%"]),
  ];

  // pointer parallax: the photo (foreground) moves and turns the most, the
  // light behind it less, the orbits (OrbitField) less still
  const mx = useSpring(useMotionValue(0), { stiffness: 50, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 50, damping: 18 });
  const photoX = useTransform(mx, [-0.5, 0.5], [18, -18]);
  const photoY = useTransform(my, [-0.5, 0.5], [10, -10]);
  const photoTurn = useTransform(mx, [-0.5, 0.5], [-3, 3]);
  const glowX = useTransform(mx, [-0.5, 0.5], [7, -7]);
  const glowY = useTransform(my, [-0.5, 0.5], [4, -4]);
  const glowTurn = useTransform(mx, [-0.5, 0.5], [-1.5, 1.5]);

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
      <OrbitField anchor={coreRef} scale={figureRef} backClassName="z-0" frontClassName="z-20" exit={reduce ? undefined : scrollYProgress} />

      {/* Naim, at the centre of the system */}
      <motion.div
        ref={figureRef}
        className="absolute left-1/2 top-[calc(var(--nav-h)-0.5rem)] z-10 aspect-[1086/1358] w-[min(92vw,460px)] -translate-x-1/2 lg:bottom-[-3svh] lg:left-auto lg:right-[5vw] lg:top-auto lg:w-[min(40vw,70svh)] lg:translate-x-0"
        style={reduce ? undefined : { y: figureY, scale: figureScale, opacity: figureFade }}
      >
        <motion.div aria-hidden className="absolute inset-0" style={reduce ? undefined : { x: glowX, y: glowY, rotateY: glowTurn, transformPerspective: 1600 }}>
          {/* light behind the head */}
          <motion.div
            className="absolute inset-[-20%] bg-[radial-gradient(closest-side_at_50%_36%,rgba(141,180,255,0.2),transparent),radial-gradient(closest-side_at_30%_74%,rgba(242,161,90,0.08),transparent)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: ease.out, delay: 0.4 }}
          />
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
                src={portrait}
                alt="Naim El Haddadi, arms crossed"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="object-contain object-bottom [filter:drop-shadow(0_36px_48px_rgba(0,0,0,0.6))_drop-shadow(0_-6px_28px_rgba(141,180,255,0.22))]"
              />
            </div>
          </motion.div>
          {/* the nucleus the orbits turn around */}
          <span ref={coreRef} aria-hidden className="absolute left-1/2 top-[40%] size-px" />
        </motion.div>
      </motion.div>

      {/* Copy */}
      <motion.div
        className="container-x relative z-30 flex min-h-[100svh] flex-col pb-8 pt-[calc(var(--nav-h)+min(92vw,460px)*1.02)] lg:pb-10 lg:pt-[calc(var(--nav-h)+8svh)]"
        style={reduce ? undefined : { y: contentY, scale: contentScale, opacity: fade, transformOrigin: "0% 100%" }}
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
              <motion.span
                key={word}
                aria-hidden
                className="block"
                style={{ marginLeft: `${i * 0.6}em`, ...(reduce ? {} : { x: mottoX[i] }) }}
              >
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
              </motion.span>
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

      {/* the hero hands over to the page: it darkens from the bottom as it leaves */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[60%] bg-gradient-to-t from-ink via-ink/70 to-transparent"
        style={{ opacity: reduce ? 0 : dusk }}
      />
    </section>
  );
}
