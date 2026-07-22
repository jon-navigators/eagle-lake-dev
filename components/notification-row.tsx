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
  const accepted = note.type === "REQUEST_ACCEPTED";
  const verb = accepted ? "accepted" : "declined";

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl border px-4 py-3",
        note.read
          ? "border-stone/60 bg-transparent"
          : "border-stone bg-cream",
      )}
    >
      <div className="min-w-0">
        <p className="text-sm text-bark">
          {!note.read ? (
            <span
              className={cn(
                "mr-2 inline-block h-2 w-2 rounded-full align-middle",
                accepted ? "bg-moss" : "bg-clay",
              )}
              aria-hidden
            />
          ) : null}
          <span className="font-medium">{note.actorName}</span> {verb} your
          request:{" "}
          <span className="text-bark-soft">{note.commitmentTitle}</span>
        </p>
        <p className="mt-0.5 text-xs text-bark-soft">{timeAgo(note.createdAt)}</p>
      </div>

      {!note.read ? (
        <form action={markNotificationRead}>
          <input type="hidden" name="id" value={note.id} />
          <button
            type="submit"
            className="shrink-0 rounded-lg px-2 py-1 text-xs text-bark-soft hover:text-bark"
          >
            Mark read
          </button>
        </form>
      ) : null}
    </div>
  );
}
