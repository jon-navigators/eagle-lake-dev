import * as React from "react";
import { cn } from "@/lib/utils";

/** Five-point star — the only ornament in this design language. */
export function Star({
  className,
  size = 14,
  fill = "currentColor",
}: {
  className?: string;
  size?: number;
  fill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M12 1.5l2.9 7.2 7.6.5-5.9 4.9 1.9 7.4L12 17.4 5.5 21.5l1.9-7.4L1.5 9.2l7.6-.5z"
        fill={fill}
      />
    </svg>
  );
}

/** Notched red banner ribbon — carries screen and modal titles. */
export function Ribbon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ribbon-notch inline-block border-[3px] border-ink bg-red px-6 py-2.5 shadow-[5px_5px_0_#1c1a17]",
        className,
      )}
    >
      <h1 className="px-3.5 font-display text-[34px] leading-none tracking-[0.02em] text-paper">
        {children}
      </h1>
    </div>
  );
}

/** Uppercase Alfa Slab label + 3px black rule + a star. */
export function SectionHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <h2 className="font-display text-base tracking-[0.06em] text-ink">
        {children}
      </h2>
      <span className="h-[3px] flex-1 bg-ink" />
      <Star className="text-ink" />
    </div>
  );
}

/** A dashed, hatched panel — marks provisional things. */
export function DashedPanel({
  children,
  className,
  hatch = true,
}: {
  children: React.ReactNode;
  className?: string;
  hatch?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-[3px] border-dashed border-ink p-5",
        hatch ? "hatch-paper" : "bg-paper",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Gold notice box with a leading star (e.g. the org-chart cycle warning). */
export function Notice({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 border-[3px] border-ink bg-gold px-3.5 py-2.5 shadow-[4px_4px_0_#1c1a17]",
        className,
      )}
    >
      <Star className="mt-0.5 text-ink" size={12} />
      <span className="text-[12px] font-bold uppercase leading-snug tracking-[0.08em] text-ink">
        {children}
      </span>
    </div>
  );
}
