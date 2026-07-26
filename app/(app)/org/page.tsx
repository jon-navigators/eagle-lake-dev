import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { OrgChart } from "@/components/org-chart/OrgChart";
import { PageHeader } from "@/components/page-header";
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
    <>
      <PageHeader
        title="Org chart"
        subtitle="Drag a box onto another to set who reports to whom — teams follow the chart"
      />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <OrgChart roles={input} />
      </div>
    </>
  );
}
