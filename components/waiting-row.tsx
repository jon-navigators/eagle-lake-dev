import { Badge } from "@/components/ui/badge";
import { formatDueDate } from "@/lib/utils";
import { withdrawRequest } from "@/app/(app)/inbox/actions";

export type WaitingView = {
  id: string;
  title: string;
  dueDate: string | null;
  toName: string;
};

/** A request you sent that's still pending — provisional, so it's hatched + dashed. */
export function WaitingRow({ item }: { item: WaitingView }) {
  return (
    <div className="hatch-paper flex flex-wrap items-center justify-between gap-4 border-[3px] border-dashed border-ink px-5 py-4">
      <div className="min-w-0">
        <p className="font-display text-[17px] leading-tight text-ink">
          {item.title}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <Badge tone="waiting">Waiting on {item.toName}</Badge>
          {item.dueDate ? (
            <Badge tone="due">Due {formatDueDate(item.dueDate)}</Badge>
          ) : null}
        </div>
      </div>
      <form action={withdrawRequest}>
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          className="border-[2px] border-muted-border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted hover:border-red hover:text-red"
        >
          Withdraw
        </button>
      </form>
    </div>
  );
}
