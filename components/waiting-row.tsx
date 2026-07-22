import { Badge } from "@/components/ui/badge";
import { formatDueDate } from "@/lib/utils";
import { withdrawRequest } from "@/app/(app)/inbox/actions";

export type WaitingView = {
  id: string;
  title: string;
  dueDate: string | null;
  toName: string;
};

/** A request you sent that's still pending — visible, but calm. */
export function WaitingRow({ item }: { item: WaitingView }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone/70 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm text-bark">
          {item.title}{" "}
          <span className="text-bark-soft">— waiting on {item.toName}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        {item.dueDate ? (
          <Badge tone="muted">{formatDueDate(item.dueDate)}</Badge>
        ) : null}
        <form action={withdrawRequest}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="text-xs text-bark-soft hover:text-clay-600"
          >
            Withdraw
          </button>
        </form>
      </div>
    </div>
  );
}
