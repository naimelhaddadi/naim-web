import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "./Icons";
import { Magnetic } from "./Magnetic";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "solid" | "ghost";
  size?: "md" | "lg";
  icon?: ReactNode;
};

/*
  Pill link-button. The label rolls up on hover (two stacked copies),
  the arrow nudges right, and the whole thing is magnetic.
*/
export function Button({ variant = "solid", size = "md", icon, children, className, ...rest }: ButtonProps) {
  const tone =
    variant === "solid"
      ? "bg-fg text-ink hover:bg-sodium"
      : "border border-line-strong text-fg hover:border-fg/60";
  const pad = size === "lg" ? "h-16 px-8 text-base md:h-20 md:px-10 md:text-lg" : "h-11 px-5 text-sm";

  return (
    <Magnetic>
      <a
        className={`group relative inline-flex items-center gap-3 rounded-full font-medium tracking-tight transition-colors duration-500 ease-out-expo ${tone} ${pad} ${className ?? ""}`}
        {...rest}
      >
        <span className="relative block overflow-hidden">
          <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
            {children}
          </span>
          <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
            {children}
          </span>
        </span>
        <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
          {icon ?? <ArrowRight />}
        </span>
      </a>
    </Magnetic>
  );
}
