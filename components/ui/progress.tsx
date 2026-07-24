import { cn } from "@/lib/utils";

/**
 * A quiet progress bar. Teal fill on a subtle track by default; a gold fill on a
 * translucent track for use on the dark (espresso) company card.
 */
export function Progress({
  value,
  tone = "teal",
  className,
}: {
  value: number; // 0–100
  tone?: "teal" | "gold";
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const onDark = tone === "gold";
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full",
        onDark ? "bg-white/20" : "bg-subtle",
        className,
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          onDark ? "bg-gold" : "bg-teal",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
