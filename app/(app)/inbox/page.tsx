import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/empty-state";
import { RequestRow, type PendingRequestView } from "@/components/request-row";
import {
  NotificationRow,
  type NotificationView,
} from "@/components/notification-row";
import { markAllNotificationsRead } from "@/app/(app)/inbox/actions";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const me = await requireUser();

  const [pending, notifications] = await Promise.all([
    prisma.commitment.findMany({
      where: { ownerId: me.id, requestStatus: "PENDING" },
      include: { requester: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.findMany({
      where: { recipientId: me.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const requests: PendingRequestView[] = pending.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    dueDate: c.dueDate ? c.dueDate.toISOString() : null,
    fromName: c.requester?.name ?? c.requester?.email ?? "Someone",
  }));

  const notes: NotificationView[] = notifications.map((n) => ({
    id: n.id,
    type: n.type,
    actorName: n.actorName,
    commitmentTitle: n.commitmentTitle,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
  }));

  const hasUnread = notes.some((n) => !n.read);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl">Inbox</h1>
        <p className="mt-1 text-bark-soft">
          Requests waiting on you, and word back on what you&apos;ve asked.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-bark-soft">
          Requests {requests.length > 0 ? `· ${requests.length}` : ""}
        </h2>
        {requests.length === 0 ? (
          <EmptyState
            title="No requests waiting."
            hint="When a teammate asks you to take something on, it shows up here."
          />
        ) : (
          requests.map((r) => <RequestRow key={r.id} request={r} />)
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-bark-soft">
            Notifications
          </h2>
          {hasUnread ? (
            <form action={markAllNotificationsRead}>
              <button
                type="submit"
                className="text-xs text-bark-soft hover:text-bark"
              >
                Mark all read
              </button>
            </form>
          ) : null}
        </div>
        {notes.length === 0 ? (
          <p className="text-sm text-bark-soft">Nothing yet.</p>
        ) : (
          <div className="space-y-2">
            {notes.map((n) => (
              <NotificationRow key={n.id} note={n} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
