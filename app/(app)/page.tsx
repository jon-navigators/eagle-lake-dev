import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { CommitmentDialog } from "@/components/commitment-form";
import { CommitmentCard, type CommitmentView } from "@/components/commitment-card";
import { RequestDialog, type PersonOption } from "@/components/request-form";
import { WaitingRow, type WaitingView } from "@/components/waiting-row";
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

  const [initiatives, commitments, waitingRaw, people] = await Promise.all([
    prisma.initiative.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.commitment.findMany({
      where: { ownerId: user.id, requestStatus: { not: "PENDING" } },
      include: { initiative: { select: { id: true, title: true } } },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    }),
    // Requests I've sent that are still pending on someone else.
    prisma.commitment.findMany({
      where: { requesterId: user.id, requestStatus: "PENDING" },
      include: { owner: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { NOT: { id: user.id } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const open = commitments.filter((c) => c.status === "OPEN").map(toView);
  const done = commitments.filter((c) => c.status === "DONE").map(toView);

  const waiting: WaitingView[] = waitingRaw.map((c) => ({
    id: c.id,
    title: c.title,
    dueDate: c.dueDate ? c.dueDate.toISOString() : null,
    toName: c.owner?.name ?? c.owner?.email ?? "someone",
  }));

  const peopleOptions: PersonOption[] = people.map((p) => ({
    id: p.id,
    label: p.name ? `${p.name} (${p.email})` : p.email,
  }));

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
        <div className="flex items-center gap-2">
          <RequestDialog
            people={peopleOptions}
            initiatives={initiatives}
            trigger={<Button variant="ghost">Ask a teammate</Button>}
          />
          <CommitmentDialog
            title="New commitment"
            action={createCommitment}
            initiatives={initiatives}
            trigger={<Button>+ New commitment</Button>}
          />
        </div>
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

      {waiting.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-medium uppercase tracking-wide text-bark-soft">
            Waiting on others · {waiting.length}
          </h2>
          {waiting.map((w) => (
            <WaitingRow key={w.id} item={w} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
