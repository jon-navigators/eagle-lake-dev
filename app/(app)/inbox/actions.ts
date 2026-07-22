"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

function refreshAll() {
  revalidatePath("/");
  revalidatePath("/inbox");
  revalidatePath("/team");
}

/**
 * Accept a request. The recipient (current owner) keeps the commitment and the
 * requester gets an "accepted" note in their inbox.
 */
export async function acceptRequest(formData: FormData) {
  const me = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const req = await prisma.commitment.findFirst({
    where: { id, ownerId: me.id, requestStatus: "PENDING" },
    select: { id: true, title: true, requesterId: true },
  });
  if (!req) return;

  await prisma.$transaction(async (tx) => {
    await tx.commitment.update({
      where: { id: req.id },
      data: { requestStatus: "ACCEPTED" },
    });
    if (req.requesterId) {
      await tx.notification.create({
        data: {
          type: "REQUEST_ACCEPTED",
          recipientId: req.requesterId,
          commitmentId: req.id,
          commitmentTitle: req.title,
          actorName: me.name ?? me.email,
        },
      });
    }
  });

  refreshAll();
}

/**
 * Decline a request. A plain no — no reason. The commitment bounces back to the
 * requester (who becomes the owner) and they get a "declined" note.
 */
export async function declineRequest(formData: FormData) {
  const me = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const req = await prisma.commitment.findFirst({
    where: { id, ownerId: me.id, requestStatus: "PENDING" },
    select: { id: true, title: true, requesterId: true },
  });
  if (!req || !req.requesterId) {
    // A request with no requester can't bounce anywhere; just drop it.
    if (req) await prisma.commitment.delete({ where: { id: req.id } });
    refreshAll();
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.commitment.update({
      where: { id: req.id },
      data: { requestStatus: "DECLINED", ownerId: req.requesterId! },
    });
    await tx.notification.create({
      data: {
        type: "REQUEST_DECLINED",
        recipientId: req.requesterId!,
        commitmentId: req.id,
        commitmentTitle: req.title,
        actorName: me.name ?? me.email,
      },
    });
  });

  refreshAll();
}

/** Withdraw a still-pending request you sent. Simply removes it. */
export async function withdrawRequest(formData: FormData) {
  const me = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.commitment.deleteMany({
    where: { id, requesterId: me.id, requestStatus: "PENDING" },
  });

  refreshAll();
}

export async function markNotificationRead(formData: FormData) {
  const me = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.notification.updateMany({
    where: { id, recipientId: me.id },
    data: { read: true },
  });
  revalidatePath("/inbox");
}

export async function markAllNotificationsRead() {
  const me = await requireUser();
  await prisma.notification.updateMany({
    where: { recipientId: me.id, read: false },
    data: { read: true },
  });
  revalidatePath("/inbox");
}
