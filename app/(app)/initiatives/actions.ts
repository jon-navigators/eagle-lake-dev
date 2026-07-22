"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

function refresh() {
  revalidatePath("/company");
  revalidatePath("/");
}

export async function createInitiative(formData: FormData) {
  await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const period = String(formData.get("period") ?? "QUARTERLY");

  await prisma.initiative.create({
    data: {
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      period: period === "ANNUAL" ? "ANNUAL" : "QUARTERLY",
    },
  });
  refresh();
}

export async function updateInitiative(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return;
  const period = String(formData.get("period") ?? "QUARTERLY");

  await prisma.initiative.update({
    where: { id },
    data: {
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      period: period === "ANNUAL" ? "ANNUAL" : "QUARTERLY",
    },
  });
  refresh();
}

/** Delete an initiative. Linked commitments are simply unlinked (schema). */
export async function deleteInitiative(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.initiative.delete({ where: { id } });
  refresh();
}
