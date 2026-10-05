"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import night from "@/assets/photos/naim-night.webp";
import { MaskLines } from "@/components/ui/MaskLines";
import { MadridClock } from "@/components/ui/MadridClock";
import { ease } from "@/lib/motion";

const motto = ["think", "build", "solve"];

/* Photo dissolves into the page on the left and at the bottom. */
const photoMask = {
  maskImage:
    "linear-gradient(to right, transparent 0%, #000 42%), linear-gradient(to top, transparent 0%, #000 38%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, #000 42%), linear-gradient(to top, transparent 0%, #000 38%)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const;

const photoMaskMobile = {
  maskImage: "linear-gradient(to top, transparent 4%, #000 55%)",
  WebkitMaskImage: "linear-gradient(to top, transparent 4%, #000 55%)",
} as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const shift = [
    useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]),
    useTransform(scrollYProgress, [0, 1], ["0%", "3%"]),
    useTransform(scrollYProgress, [0, 1], ["0%", "-1.5%"]),
  ];

  // A warm "street light" that follows the pointer across the photo.
  const px = useSpring(useMotionValue(66), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(38), { stiffness: 60, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(520px circle at ${px}% ${py}%, rgba(242,161,90,0.13), transparent 62%)`;

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 100);
    py.set(((e.clientY - r.top) / r.height) * 100);
  }

  const still = reduce ?? false;

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-name"
      onPointerMove={onPointerMove}
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      {/* Photograph */}
      <motion.div
        className="absolute inset-x-0 top-0 -z-10 h-[76svh] md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[66%]"
        initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.6, ease: ease.inOut, delay: 0.1 }}
      >
        <motion.div className="relative h-full w-full" style={still ? undefined : { y: imgY, scale: imgScale }}>
          <div className="absolute inset-0 md:hidden" style={photoMaskMobile}>
            <Image
              src={night}
              alt="Naim El Haddadi working on his laptop at night in Madrid's business district"
              fill
              priority
              placeholder="blur"
              sizes="100vw"
              className="object-cover object-[58%_30%] [filter:saturate(0.8)_contrast(1.06)_brightness(0.8)]"
            />
          </div>
          <div className="absolute inset-0 hidden md:block" style={photoMask}>
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: ease.out, delay: 0.1 }}
            >
              <Image
                src={night}
                alt=""
                fill
                priority
                placeholder="blur"
                sizes="66vw"
                className="object-cover object-[50%_32%] [filter:saturate(0.8)_contrast(1.06)_brightness(0.82)]"
              />
            </motion.div>
          </div>
        </motion.div>
        <motion.div aria-hidden className="absolute inset-0 hidden md:block" style={{ background: glow }} />
      </motion.div>

      {/* Copy */}
      <motion.div
        className="container-x relative flex min-h-[100svh] flex-col pb-8 pt-[calc(var(--nav-h)+4vh)] md:pb-10 md:pt-[calc(var(--nav-h)+8vh)]"
        style={still ? undefined : { y: contentY, opacity: fade }}
      >
        <div className="mt-[52svh] md:mt-0">
          <h1 id="hero-name" className="display text-[clamp(2.4rem,4.6vw,5rem)]">
            <MaskLines trigger="mount" delay={0.35} lines={["Naim El Haddadi"]} />
            <span className="sr-only">, backend developer in Madrid.</span>
          </h1>
          <motion.p
            className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted md:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.6 }}
          >
            <span className="text-fg">Backend Developer</span>
            <span aria-hidden className="h-px w-6 bg-line-strong" />
            <span>Madrid, Spain</span>
          </motion.p>
        </div>

        <div className="flex flex-1 items-end py-10 md:py-12">
          <p className="display text-[clamp(4.25rem,13vw,14rem)] leading-[0.84]">
            <span className="sr-only">I think. I build. I solve.</span>
            {motto.map((word, i) => (
              <motion.span
                key={word}
                aria-hidden
                className="block"
                style={{
                  marginLeft: `${i * 0.62}em`,
                  ...(still ? {} : { x: shift[i] }),
                }}
              >
                <MaskLines
                  trigger="mount"
                  delay={0.55 + i * 0.14}
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
          className="grid gap-6 border-t border-line pt-6 text-sm md:grid-cols-12 md:items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: ease.out, delay: 1.2 }}
        >
          <p className="max-w-sm text-muted md:col-span-4">
            I build software to solve real problems — focused on Java, databases and systems that run in the real world.
          </p>
          <p className="label md:col-span-4">Java · Backend · Databases · Automation</p>
          <div className="flex items-center justify-between md:col-span-4">
            <MadridClock className="label tabular-nums" />
            <a href="#philosophy" className="label group flex items-center gap-3 text-fg">
              Scroll
              <span className="relative block h-9 w-px overflow-hidden bg-line-strong" aria-hidden>
                <span className="absolute inset-0 bg-sodium [animation:scroll-cue_2.2s_var(--ease-in-out-quart)_infinite]" />
              </span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
