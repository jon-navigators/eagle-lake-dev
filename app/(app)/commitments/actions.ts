"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

function parseDueDate(raw: FormDataEntryValue | null): Date | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Create a personal commitment (a plain to-do you own). */
export async function createCommitment(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  await prisma.commitment.create({
    data: {
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      dueDate: parseDueDate(formData.get("dueDate")),
      ownerId: user.id,
      requestStatus: "NONE",
      initiativeId: String(formData.get("initiativeId") ?? "") || null,
    },
  });

  revalidatePath("/");
}

/** Edit a commitment you own. */
export async function updateCommitment(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return;

  // Ownership guard: only update rows the caller owns.
  const result = await prisma.commitment.updateMany({
    where: { id, ownerId: user.id },
    data: {
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      dueDate: parseDueDate(formData.get("dueDate")),
    },
  });
  if (result.count === 0) return;

  revalidatePath("/");
}

/** Toggle a commitment between OPEN and DONE. */
export async function toggleCommitmentDone(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const done = String(formData.get("done") ?? "") === "true";
  if (!id) return;

  await prisma.commitment.updateMany({
    where: { id, ownerId: user.id },
    data: { status: done ? "DONE" : "OPEN" },
  });

  revalidatePath("/");
  revalidatePath("/team");
  revalidatePath("/company");
}

/** Delete a commitment you own. */
export async function deleteCommitment(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.commitment.deleteMany({ where: { id, ownerId: user.id } });
  revalidatePath("/");
}

/** Link (or unlink) a commitment to a company initiative. */
export async function linkCommitmentToInitiative(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const initiativeId = String(formData.get("initiativeId") ?? "") || null;

  await prisma.commitment.updateMany({
    where: { id, ownerId: user.id },
    data: { initiativeId },
  });

  revalidatePath("/");
  revalidatePath("/company");
}
