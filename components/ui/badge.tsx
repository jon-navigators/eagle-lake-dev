import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "moss" | "clay" | "sky" | "muted";

const tones: Record<Tone, string> = {
  neutral: "bg-stone/60 text-bark",
  moss: "bg-moss/20 text-pine",
  clay: "bg-clay/15 text-clay-600",
  sky: "bg-sky/20 text-bark",
  muted: "bg-transparent text-bark-soft",
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
