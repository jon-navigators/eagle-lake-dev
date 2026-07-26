import { cn } from "@/lib/utils";

/**
 * Outlined track with a hard-edged fill. No blur, no gradient blends.
 * - `tone="red"`  — solid red fill in a black-outlined track (initiative cards).
 * - `tone="gold"` — 45° gold hatch in a cream-outlined track (dark roll-up panels).
 */
export function Progress({
  value,
  tone = "red",
  className,
}: {
  value: number; // 0–100
  tone?: "red" | "gold";
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const onDark = tone === "gold";
  return (
    <div
      className={cn(
        "h-4 w-full overflow-hidden rounded-none border-[3px]",
        onDark ? "border-cream bg-ink" : "border-ink bg-paper",
        className,
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full", onDark ? "hatch-gold" : "bg-red")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
