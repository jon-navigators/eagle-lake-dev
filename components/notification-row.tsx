import { cn, timeAgo } from "@/lib/utils";
import { markNotificationRead } from "@/app/(app)/inbox/actions";

export type NotificationView = {
  id: string;
  type: "REQUEST_ACCEPTED" | "REQUEST_DECLINED";
  actorName: string;
  commitmentTitle: string;
  read: boolean;
  createdAt: string;
};

export function NotificationRow({ note }: { note: NotificationView }) {
  const verb = note.type === "REQUEST_ACCEPTED" ? "accepted" : "declined";

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-5 py-4",
        note.read ? "bg-paper-2" : "bg-paper",
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {/* unread = red outlined dot; read = empty muted dot */}
        <span
          className={cn(
            "mt-1 h-3 w-3 shrink-0 rounded-full border-[3px]",
            note.read ? "border-muted-border" : "border-red bg-red",
          )}
          aria-hidden
        />
        <div className="min-w-0">
          <p
            className={cn(
              "text-[14px] leading-snug",
              note.read ? "text-muted" : "text-ink",
            )}
          >
            <span className="font-bold">{note.actorName}</span> {verb} your
            request: <span className="font-medium">{note.commitmentTitle}</span>
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            {timeAgo(note.createdAt)}
          </p>
        </div>
      </div>

      {!note.read ? (
        <form action={markNotificationRead}>
          <input type="hidden" name="id" value={note.id} />
          <button
            type="submit"
            className="shrink-0 rounded-full border-[2px] border-ink px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink hover:bg-gold"
          >
            Mark read
          </button>
        </form>
      ) : null}
    </div>
  );
}
