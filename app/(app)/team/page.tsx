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
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const me = await requireUser();
  const roles = await prisma.role.findMany({
    select: { id: true, title: true, parentId: true, userId: true },
  });

  const myRoles = roles.filter((r) => r.userId === me.id);

  if (myRoles.length === 0) {
    return (
      <>
        <PageHeader title="Your team" />
        <div className="mx-auto max-w-6xl px-6 py-9">
          <EmptyState
            dashedTop
            title="Claim your spot first."
            hint="Your team is everyone below you on the org chart. Find your box and choose “This is me.”"
          >
            <Link href="/org">
              <Button>Go to the org chart</Button>
            </Link>
          </EmptyState>
        </div>
      </>
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <>
      <PageHeader
        title="Team"
        subtitle={`Everyone below ${leadTitles} on the org chart`}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-9">
        <Card tone="ink" className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-[19px] uppercase text-cream">
              Team progress
            </p>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold">
              {done} of {total} done
            </p>
          </div>
          <Progress value={pct} tone="gold" className="mt-4" />
          {unclaimedSeats > 0 ? (
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-nav-email">
              {unclaimedSeats} seat{unclaimedSeats === 1 ? "" : "s"} on the chart
              not yet claimed — they don&apos;t count here.
            </p>
          ) : null}
        </Card>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => {
            const open = m.ownedCommitments.filter((c) => c.status === "OPEN");
            const mDone = m.ownedCommitments.length - open.length;
            const isMe = m.id === me.id;
            return (
              <Card key={m.id}>
                <CardBody>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <p className="font-display text-[19px] leading-tight text-ink">
                      {m.name ?? m.email}
                    </p>
                    {isMe ? <Badge tone="you">You</Badge> : null}
                  </div>
                  <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">
                    {open.length} open · {mDone} done
                  </p>
                  {open.length > 0 ? (
                    <ul className="mt-4 space-y-2.5">
                      {open.map((c) => {
                        const isOverdue = !!c.dueDate && c.dueDate < today;
                        return (
                          <li
                            key={c.id}
                            className="flex items-start justify-between gap-3 border-t-2 border-muted-border pt-2.5 text-[13px]"
                          >
                            <span className="text-body">{c.title}</span>
                            {c.dueDate ? (
                              <span
                                className={
                                  isOverdue
                                    ? "shrink-0 text-[11px] font-extrabold uppercase tracking-[0.1em] text-gold-dark"
                                    : "shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-muted"
                                }
                              >
                                {formatDueDate(c.dueDate.toISOString())}
                              </span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-green">
                      All clear.
                    </p>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
