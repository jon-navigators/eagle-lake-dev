import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { CommitmentDialog } from "@/components/commitment-form";
import { CommitmentCard, type CommitmentView } from "@/components/commitment-card";
import { EmptyState } from "@/components/empty-state";
import { createCommitment } from "@/app/(app)/commitments/actions";

export const dynamic = "force-dynamic";

function toView(c: {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: "OPEN" | "DONE";
  initiative: { id: string; title: string } | null;
}): CommitmentView {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    dueDate: c.dueDate ? c.dueDate.toISOString() : null,
    status: c.status,
    initiative: c.initiative,
  };
}

export default async function HomePage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] ?? user.email.split("@")[0];

  const [initiatives, commitments] = await Promise.all([
    prisma.initiative.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.commitment.findMany({
      where: { ownerId: user.id, requestStatus: { not: "PENDING" } },
      include: { initiative: { select: { id: true, title: true } } },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const open = commitments.filter((c) => c.status === "OPEN").map(toView);
  const done = commitments.filter((c) => c.status === "DONE").map(toView);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Your commitments</h1>
          <p className="mt-1 text-bark-soft">
            {open.length > 0
              ? `${open.length} open · ${firstName}'s list`
              : `Nothing open right now, ${firstName}.`}
          </p>
        </div>
        <CommitmentDialog
          title="New commitment"
          action={createCommitment}
          initiatives={initiatives}
          trigger={<Button>+ New commitment</Button>}
        />
      </div>

      {open.length === 0 && done.length === 0 ? (
        <EmptyState
          title="Nothing on your plate. Enjoy the quiet."
          hint="When you make a promise — to yourself or someone else — add it here."
        >
          <CommitmentDialog
            title="New commitment"
            action={createCommitment}
            initiatives={initiatives}
            trigger={<Button>+ Add your first commitment</Button>}
          />
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {open.map((c) => (
            <CommitmentCard key={c.id} commitment={c} initiatives={initiatives} />
          ))}
        </div>
      )}

      {done.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-bark-soft">
            Done · {done.length}
          </h2>
          {done.map((c) => (
            <CommitmentCard key={c.id} commitment={c} initiatives={initiatives} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
