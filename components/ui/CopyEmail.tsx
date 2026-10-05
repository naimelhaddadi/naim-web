"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check, Copy } from "./Icons";

export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button type="button" onClick={copy} className={className} aria-label={`Copy ${email} to clipboard`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "idle"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5"
        >
          {copied ? <Check className="text-live" /> : <Copy />}
          <span className="font-mono text-[11px] uppercase tracking-[0.12em]">{copied ? "Copied" : "Copy"}</span>
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email copied" : ""}
      </span>
    </button>
  );
}
