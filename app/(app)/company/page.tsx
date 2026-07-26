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
import { PageHeader } from "@/components/page-header";

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
    <>
      <PageHeader
        title="Company"
        subtitle="The big goals we're moving toward, and how they're tracking"
        actions={
          <InitiativeDialog
            title="New initiative"
            action={createInitiative}
            trigger={<Button>+ New initiative</Button>}
          />
        }
      />

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-9">
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
          <Card tone="ink" className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-[19px] uppercase text-cream">
                Org-wide progress
              </p>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold">
                {org.done} of {org.total} linked commitments done
              </p>
            </div>
            <Progress value={org.pct} tone="gold" className="mt-4" />
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            {initiatives.map((i) => {
              const p = initiativeProgress(i.commitments);
              const contributors = new Set(
                i.commitments.map(
                  (c) => c.owner?.name ?? c.owner?.email ?? "?",
                ),
              );
              return (
                <Card key={i.id} className="flex flex-col">
                  <CardBody className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 font-display text-[21px] leading-tight text-ink">
                        {i.title}
                      </h2>
                      <Badge tone="due" className="shrink-0">
                        {i.period === "ANNUAL" ? "Annual" : "Quarterly"}
                      </Badge>
                    </div>
                    {/* signature red rule */}
                    <div className="mt-3 h-1 w-[52px] bg-red" />
                    {i.description ? (
                      <p className="mt-3 text-[14px] leading-relaxed text-body">
                        {i.description}
                      </p>
                    ) : null}

                    <div className="mt-5 flex items-center gap-4">
                      <Progress value={p.pct} />
                      <span className="shrink-0 font-display text-[19px] leading-none text-red">
                        {p.pct}%
                      </span>
                    </div>
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                      {p.done} of {p.total} commitments done
                      {p.total > 0
                        ? ` · ${contributors.size} contributor${
                            contributors.size === 1 ? "" : "s"
                          }`
                        : " · nothing linked yet"}
                    </p>

                    <div className="mt-auto flex items-center gap-2 border-t-2 border-muted-border pt-4 mt-5">
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
                            className="border-[2px] border-ink px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink hover:bg-gold"
                          >
                            Edit
                          </button>
                        }
                      />
                      <form action={deleteInitiative}>
                        <input type="hidden" name="id" value={i.id} />
                        <button
                          type="submit"
                          className="border-[2px] border-muted-border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted hover:border-red hover:text-red"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </>
      )}
      </div>
    </>
  );
}
