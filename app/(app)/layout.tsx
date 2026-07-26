import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Nav } from "@/components/nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  // Inbox badge = pending requests waiting on me + unread notifications.
  const [pending, unread] = await Promise.all([
    prisma.commitment.count({
      where: { ownerId: user.id, requestStatus: "PENDING" },
    }),
    prisma.notification.count({
      where: { recipientId: user.id, read: false },
    }),
  ]);

  return (
    <div className="min-h-screen">
      <Nav userEmail={user.email} inboxCount={pending + unread} />
      <main>{children}</main>
    </div>
  );
}
