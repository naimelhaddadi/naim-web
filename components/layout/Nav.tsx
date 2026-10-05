"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { ease } from "@/lib/motion";
import { Button } from "@/components/ui/Button";

export function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 200 && y > prev && !open);
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: ease.out }}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-transparent transition-opacity duration-500 ${scrolled || open ? "opacity-100" : "opacity-0"}`}
        />
        <div className="container-x relative flex h-(--nav-h) items-center justify-between gap-6">
          <a href="#top" className="group flex items-baseline gap-3" aria-label={`${site.name}, back to top`}>
            <span className="font-display text-[1.05rem] font-semibold tracking-tight">Naim El Haddadi</span>
            <span className="label hidden transition-colors group-hover:text-fg sm:inline">Backend</span>
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="group relative py-2 text-sm text-muted transition-colors hover:text-fg">
                    {item.label}
                    <span className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-sodium transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-7">
            <p className="hidden items-center gap-2.5 text-xs text-muted lg:flex">
              <span className="live-dot relative size-1.5 rounded-full bg-live text-live" aria-hidden />
              Open to junior roles
            </p>
            <span className="hidden md:inline-block">
              <Button href="#contact">Let&apos;s talk</Button>
            </span>
            <button
              type="button"
              className="label relative z-10 -mr-2 p-2 text-fg md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-sodium/70"
          style={{ scaleX: progress }}
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-(--gutter) pb-10 pt-[calc(var(--nav-h)+2rem)] md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: ease.inOut }}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {[...nav, { href: "#contact", label: "Contact" }].map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="display block py-1 text-[15vw]"
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.8, ease: ease.out, delay: 0.25 + i * 0.06 }}
                    >
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center justify-between text-sm text-muted">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <span className="flex items-center gap-2">
                <span className="live-dot relative size-1.5 rounded-full bg-live text-live" aria-hidden />
                Available
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
