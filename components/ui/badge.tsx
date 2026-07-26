import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "@/components/ui/flash";

type Tone =
  | "due" // black outline on paper
  | "overdue" // gold fill + star (deliberately NOT red)
  | "initiative" // green fill
  | "waiting" // blue fill — "Waiting on <person>" only
  | "you" // red fill
  | "muted"
  // legacy aliases
  | "neutral"
  | "teal"
  | "gold"
  | "moss"
  | "clay"
  | "sky";

const tones: Record<Tone, string> = {
  due: "border-[2px] border-ink bg-transparent text-ink",
  overdue: "border-[2px] border-ink bg-gold text-ink",
  initiative: "border-[2px] border-ink bg-green text-paper",
  waiting: "border-[2px] border-ink bg-blue text-paper",
  you: "border-[2px] border-paper bg-red text-paper",
  muted: "border-[2px] border-muted-border bg-transparent text-muted",
  neutral: "border-[2px] border-ink bg-transparent text-ink",
  teal: "border-[2px] border-ink bg-green text-paper",
  gold: "border-[2px] border-ink bg-gold text-ink",
  moss: "border-[2px] border-ink bg-green text-paper",
  clay: "border-[2px] border-ink bg-gold text-ink",
  sky: "border-[2px] border-ink bg-blue text-paper",
};

export function Badge({
  tone = "due",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em]",
        tones[tone],
        className,
      )}
      {...props}
    >
      {tone === "overdue" ? <Star size={10} className="text-ink" /> : null}
      {children}
    </span>
  );
}
