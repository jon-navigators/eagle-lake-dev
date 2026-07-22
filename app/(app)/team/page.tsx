import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { formatDueDate } from "@/lib/utils";
import { subtreeRoleIds } from "@/lib/org";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const me = await requireUser();
  const roles = await prisma.role.findMany({
    select: { id: true, title: true, parentId: true, userId: true },
  });

  const myRoles = roles.filter((r) => r.userId === me.id);

  if (myRoles.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl">Your team</h1>
        <EmptyState
          title="Claim your spot first."
          hint="Your team is everyone below you on the org chart. Find your box and choose “This is me.”"
        >
          <Link href="/org">
            <Button>Go to the org chart</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  // Union the subtree of every role I hold; collect the users in those roles.
  const subtreeIds = new Set<string>();
  for (const r of myRoles) {
    for (const id of subtreeRoleIds(roles, r.id)) subtreeIds.add(id);
  }
  const teamUserIds = new Set(
    roles.filter((r) => r.userId && subtreeIds.has(r.id)).map((r) => r.userId!),
  );
  const unclaimedSeats = [...subtreeIds].filter(
    (id) => !roles.find((r) => r.id === id)?.userId,
  ).length;

  const members = await prisma.user.findMany({
    where: { id: { in: [...teamUserIds] } },
    select: {
      id: true,
      name: true,
      email: true,
      ownedCommitments: {
        where: { requestStatus: { not: "PENDING" } },
        select: {
          id: true,
          title: true,
          status: true,
          dueDate: true,
        },
        orderBy: [{ status: "asc" }, { dueDate: "asc" }],
      },
    },
    orderBy: { name: "asc" },
  });

  const allCommitments = members.flatMap((m) => m.ownedCommitments);
  const total = allCommitments.length;
  const done = allCommitments.filter((c) => c.status === "DONE").length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const leadTitles = myRoles.map((r) => r.title).join(", ");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">Your team</h1>
        <p className="mt-1 text-bark-soft">
          Everyone below {leadTitles} on the org chart.
        </p>
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <p className="font-medium text-bark">Team progress</p>
            <p className="text-sm text-bark-soft">
              {done} of {total} done
            </p>
          </div>
          <Progress value={pct} className="mt-3" />
          {unclaimedSeats > 0 ? (
            <p className="mt-2 text-xs text-bark-soft">
              {unclaimedSeats} seat{unclaimedSeats === 1 ? "" : "s"} on the chart
              not yet claimed.
            </p>
          ) : null}
        </CardBody>
      </Card>

      <div className="space-y-4">
        {members.map((m) => {
          const open = m.ownedCommitments.filter((c) => c.status === "OPEN");
          const mDone = m.ownedCommitments.length - open.length;
          const isMe = m.id === me.id;
          return (
            <Card key={m.id}>
              <CardBody>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-bark">
                    {m.name ?? m.email}
                    {isMe ? (
                      <span className="ml-2 align-middle">
                        <Badge tone="moss">You</Badge>
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-bark-soft">
                    {open.length} open · {mDone} done
                  </p>
                </div>
                {open.length > 0 ? (
                  <ul className="mt-3 space-y-1.5">
                    {open.map((c) => (
                      <li
                        key={c.id}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="text-bark">{c.title}</span>
                        {c.dueDate ? (
                          <span className="shrink-0 text-xs text-bark-soft">
                            {formatDueDate(c.dueDate.toISOString())}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-bark-soft">All clear.</p>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
