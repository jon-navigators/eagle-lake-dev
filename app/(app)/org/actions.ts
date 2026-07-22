"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { wouldCreateCycle } from "@/lib/org";

function refresh() {
  revalidatePath("/org");
  revalidatePath("/team");
}

/** Create a new role. Starts as a root until it's dragged under a parent. */
export async function createRole(formData: FormData) {
  await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const personName = String(formData.get("personName") ?? "").trim();
  if (!title || !personName) return;

  await prisma.role.create({
    data: {
      title,
      personName,
      description: String(formData.get("description") ?? "").trim() || null,
    },
  });
  refresh();
}

export async function updateRole(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const personName = String(formData.get("personName") ?? "").trim();
  if (!id || !title || !personName) return;

  await prisma.role.update({
    where: { id },
    data: {
      title,
      personName,
      description: String(formData.get("description") ?? "").trim() || null,
    },
  });
  refresh();
}

/** Delete a role. Its children fall back to roots (parent set null in schema). */
export async function deleteRole(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.role.delete({ where: { id } });
  refresh();
}

export type MoveResult = { ok: boolean; reason?: string };

/**
 * Re-parent a role (drag one box onto another). newParentId "" means detach to
 * a root. Rejects moves that would create a cycle.
 */
export async function moveRole(
  id: string,
  newParentIdRaw: string,
): Promise<MoveResult> {
  await requireUser();
  if (!id) return { ok: false, reason: "missing id" };
  const newParentId = newParentIdRaw || null;
  if (newParentId === id) return { ok: false, reason: "cannot parent to self" };

  const roles = await prisma.role.findMany({
    select: { id: true, parentId: true },
  });
  if (wouldCreateCycle(roles, id, newParentId)) {
    return { ok: false, reason: "That would create a loop in the chart." };
  }

  await prisma.role.update({ where: { id }, data: { parentId: newParentId } });
  refresh();
  return { ok: true };
}

/** "This is me" — claim a role box as the signed-in user. */
export async function claimRole(formData: FormData) {
  const me = await requireUser();
  const roleId = String(formData.get("roleId") ?? "");
  if (!roleId) return;
  await prisma.role.update({
    where: { id: roleId },
    data: { userId: me.id },
  });
  refresh();
}

/** Release a role you had claimed. */
export async function unclaimRole(formData: FormData) {
  const me = await requireUser();
  const roleId = String(formData.get("roleId") ?? "");
  if (!roleId) return;
  await prisma.role.updateMany({
    where: { id: roleId, userId: me.id },
    data: { userId: null },
  });
  refresh();
}
