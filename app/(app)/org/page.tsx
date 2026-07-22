import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { OrgChart } from "@/components/org-chart/OrgChart";
import type { RoleInput } from "@/components/org-chart/useOrgLayout";

export const dynamic = "force-dynamic";

export default async function OrgPage() {
  const me = await requireUser();
  const roles = await prisma.role.findMany({ orderBy: { createdAt: "asc" } });

  const input: RoleInput[] = roles.map((r) => ({
    id: r.id,
    title: r.title,
    personName: r.personName,
    description: r.description,
    parentId: r.parentId,
    isMe: r.userId === me.id,
    claimed: !!r.userId,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Org chart</h1>
        <p className="mt-1 max-w-2xl text-bark-soft">
          Add roles, then drag a box onto another to set who reports to whom.
          Click a box to edit it or claim it as your own — teams follow the chart.
        </p>
      </div>
      <OrgChart roles={input} />
    </div>
  );
}
