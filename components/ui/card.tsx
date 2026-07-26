import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Paper surface, 3px black outline, hard 6px offset shadow, zero radius.
 * `tone="done"` is the muted completed-row treatment.
 */
export function Card({
  className,
  tone = "paper",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: "paper" | "done" | "ink" }) {
  const tones = {
    paper: "border-ink bg-paper shadow-[6px_6px_0_#1c1a17]",
    done: "border-muted-border bg-tan-done shadow-[6px_6px_0_#9c8c6d]",
    ink: "border-ink bg-ink shadow-[6px_6px_0_#1c1a17]",
  } as const;
  return (
    <div
      className={cn("rounded-none border-[3px]", tones[tone], className)}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}
