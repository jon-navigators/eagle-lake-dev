import { cn } from "@/lib/utils";

/** A quiet progress bar — moss fill on a stone track. No urgency, no red. */
export function Progress({
  value,
  className,
}: {
  value: number; // 0–100
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-stone", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-moss transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
