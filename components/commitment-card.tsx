"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommitmentDialog, type InitiativeOption } from "@/components/commitment-form";
import {
  toggleCommitmentDone,
  updateCommitment,
  deleteCommitment,
} from "@/app/(app)/commitments/actions";
import { cn, formatDueDate } from "@/lib/utils";

export type CommitmentView = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null; // ISO
  status: "OPEN" | "DONE";
  initiative: { id: string; title: string } | null;
};

function isOverdue(iso: string | null, done: boolean) {
  if (!iso || done) return false;
  const due = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function CommitmentCard({
  commitment,
  initiatives = [],
}: {
  commitment: CommitmentView;
  initiatives?: InitiativeOption[];
}) {
  const done = commitment.status === "DONE";
  const overdue = isOverdue(commitment.dueDate, done);
  const dueYmd = commitment.dueDate
    ? new Date(commitment.dueDate).toISOString().slice(0, 10)
    : "";

  return (
    <Card className="flex items-start gap-3 p-4">
      {/* Done toggle */}
      <form action={toggleCommitmentDone} className="pt-0.5">
        <input type="hidden" name="id" value={commitment.id} />
        <input type="hidden" name="done" value={done ? "false" : "true"} />
        <button
          type="submit"
          aria-label={done ? "Mark as not done" : "Mark as done"}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
            done
              ? "border-teal bg-teal text-white"
              : "border-teal-25 hover:border-teal",
          )}
        >
          {done ? (
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M7.5 13.5 4 10l1.4-1.4 2.1 2.1 5.1-5.1L14 7z" />
            </svg>
          ) : null}
        </button>
      </form>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-medium",
            done ? "text-bark-soft line-through" : "text-bark",
          )}
        >
          {commitment.title}
        </p>
        {commitment.description ? (
          <p className="mt-1 whitespace-pre-wrap text-sm text-bark-soft">
            {commitment.description}
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {commitment.dueDate ? (
            <Badge tone={overdue ? "gold" : "neutral"}>
              {overdue
                ? `Overdue · ${formatDueDate(commitment.dueDate)}`
                : formatDueDate(commitment.dueDate)}
            </Badge>
          ) : null}
          {commitment.initiative ? (
            <Badge tone="teal">{commitment.initiative.title}</Badge>
          ) : null}
        </div>
      </div>

      {/* Row actions */}
      <div className="flex shrink-0 items-center gap-1">
        <CommitmentDialog
          title="Edit commitment"
          action={updateCommitment}
          initiatives={initiatives}
          initial={{
            id: commitment.id,
            title: commitment.title,
            description: commitment.description,
            dueDate: dueYmd,
            initiativeId: commitment.initiative?.id ?? "",
          }}
          trigger={
            <button
              className="rounded-lg px-2 py-1 text-sm text-bark-soft hover:bg-stone/50 hover:text-bark"
              type="button"
            >
              Edit
            </button>
          }
        />
        <form action={deleteCommitment}>
          <input type="hidden" name="id" value={commitment.id} />
          <button
            type="submit"
            className="rounded-lg px-2 py-1 text-sm text-bark-soft hover:text-clay-600"
            aria-label="Delete commitment"
          >
            Delete
          </button>
        </form>
      </div>
    </Card>
  );
}
