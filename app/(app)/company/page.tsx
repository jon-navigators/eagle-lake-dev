import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { InitiativeDialog } from "@/components/initiative-form";
import {
  createInitiative,
  updateInitiative,
  deleteInitiative,
} from "@/app/(app)/initiatives/actions";
import { initiativeProgress, rollupProgress } from "@/lib/initiative";

export const dynamic = "force-dynamic";

export default async function CompanyPage() {
  await requireUser();

  const initiatives = await prisma.initiative.findMany({
    include: {
      commitments: {
        select: {
          status: true,
          owner: { select: { name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const org = rollupProgress(initiatives.map((i) => i.commitments));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Company</h1>
          <p className="mt-1 text-bark-soft">
            The big goals we&apos;re moving toward, and how they&apos;re tracking.
          </p>
        </div>
        <InitiativeDialog
          title="New initiative"
          action={createInitiative}
          trigger={<Button>+ New initiative</Button>}
        />
      </div>

      {initiatives.length === 0 ? (
        <EmptyState
          title="No initiatives yet."
          hint="Set a quarterly or annual goal, then link commitments to it — progress adds up on its own."
        >
          <InitiativeDialog
            title="New initiative"
            action={createInitiative}
            trigger={<Button>+ Add the first initiative</Button>}
          />
        </EmptyState>
      ) : (
        <>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <p className="font-medium text-bark">Org-wide progress</p>
                <p className="text-sm text-bark-soft">
                  {org.done} of {org.total} linked commitments done
                </p>
              </div>
              <Progress value={org.pct} className="mt-3" />
            </CardBody>
          </Card>

          <div className="space-y-4">
            {initiatives.map((i) => {
              const p = initiativeProgress(i.commitments);
              const contributors = new Set(
                i.commitments.map(
                  (c) => c.owner?.name ?? c.owner?.email ?? "?",
                ),
              );
              return (
                <Card key={i.id}>
                  <CardBody>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl">{i.title}</h2>
                          <Badge tone="sky">
                            {i.period === "ANNUAL" ? "Annual" : "Quarterly"}
                          </Badge>
                        </div>
                        {i.description ? (
                          <p className="mt-1 text-sm text-bark-soft">
                            {i.description}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <InitiativeDialog
                          title="Edit initiative"
                          action={updateInitiative}
                          initial={{
                            id: i.id,
                            title: i.title,
                            description: i.description,
                            period: i.period,
                          }}
                          trigger={
                            <button
                              type="button"
                              className="rounded-lg px-2 py-1 text-sm text-bark-soft hover:bg-stone/50 hover:text-bark"
                            >
                              Edit
                            </button>
                          }
                        />
                        <form action={deleteInitiative}>
                          <input type="hidden" name="id" value={i.id} />
                          <button
                            type="submit"
                            className="rounded-lg px-2 py-1 text-sm text-bark-soft hover:text-clay-600"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <Progress value={p.pct} />
                      <span className="w-16 shrink-0 text-right text-sm text-bark-soft">
                        {p.pct}%
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-bark-soft">
                      {p.done} of {p.total} commitments done
                      {p.total > 0
                        ? ` · ${contributors.size} contributor${
                            contributors.size === 1 ? "" : "s"
                          }`
                        : " · nothing linked yet"}
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
