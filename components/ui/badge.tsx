import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "teal" | "gold" | "muted" | "moss" | "clay" | "sky";

const tones: Record<Tone, string> = {
  neutral: "bg-subtle text-slate border border-hair",
  teal: "bg-teal-10 text-teal",
  gold: "bg-gold-10 text-gold-press border border-gold-25",
  muted: "bg-transparent text-slate",
  // legacy aliases → Camp Ledger equivalents
  moss: "bg-teal-10 text-teal",
  clay: "bg-gold-10 text-gold-press border border-gold-25",
  sky: "bg-teal-10 text-teal",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
