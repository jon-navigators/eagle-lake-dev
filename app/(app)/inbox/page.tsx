import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/empty-state";
import { RequestRow, type PendingRequestView } from "@/components/request-row";
import {
  NotificationRow,
  type NotificationView,
} from "@/components/notification-row";
import { markAllNotificationsRead } from "@/app/(app)/inbox/actions";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/ui/flash";
import { Card } from "@/components/ui/card";

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
    <>
      <PageHeader
        title="Inbox"
        subtitle="Requests waiting on you, and word back on what you've asked"
      />

      <div className="mx-auto max-w-6xl px-6 py-9">
        <section>
          <SectionHeader className="mb-4">
            Requests {requests.length > 0 ? `· ${requests.length}` : ""}
          </SectionHeader>
          {requests.length === 0 ? (
            <EmptyState
              title="No requests waiting."
              hint="When a teammate asks you to take something on, it shows up here."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {requests.map((r) => (
                <RequestRow key={r.id} request={r} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 mt-10 flex items-center gap-3.5">
            <SectionHeader className="flex-1">Notifications</SectionHeader>
            {hasUnread ? (
              <form action={markAllNotificationsRead}>
                <button
                  type="submit"
                  className="shrink-0 border-[2px] border-ink px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink hover:bg-gold"
                >
                  Mark all read
                </button>
              </form>
            ) : null}
          </div>
          {notes.length === 0 ? (
            <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">
              Nothing yet.
            </p>
          ) : (
            <Card className="divide-y-[3px] divide-ink overflow-hidden">
              {notes.map((n) => (
                <NotificationRow key={n.id} note={n} />
              ))}
            </Card>
          )}
        </section>
      </div>
    </>
  );
}
