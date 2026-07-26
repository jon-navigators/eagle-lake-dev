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

  const actionBtn = done
    ? "border-[2px] border-muted-border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-body hover:border-ink hover:text-ink"
    : "border-[2px] border-ink px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink hover:bg-gold";
  const deleteBtn =
    "border-[2px] border-muted-border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted hover:border-red hover:text-red";

  return (
    <Card tone={done ? "done" : "paper"} className="flex items-start gap-4 p-5">
      {/* Done toggle */}
      <form action={toggleCommitmentDone} className="pt-0.5">
        <input type="hidden" name="id" value={commitment.id} />
        <input type="hidden" name="done" value={done ? "false" : "true"} />
        <button
          type="submit"
          aria-label={done ? "Mark as not done" : "Mark as done"}
          className={cn(
            "flex h-[26px] w-[26px] items-center justify-center rounded-full border-[3px] border-ink transition-colors",
            done ? "bg-ink text-gold" : "bg-transparent hover:bg-gold",
          )}
        >
          {done ? (
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path d="M7.5 14 3.5 10l1.6-1.6 2.4 2.4 5.4-5.4L14.5 7z" />
            </svg>
          ) : null}
        </button>
      </form>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-display text-[19px] leading-tight",
            done
              ? "text-muted line-through decoration-2"
              : "text-ink",
          )}
        >
          {commitment.title}
        </p>
        {commitment.description ? (
          <p className="mt-2 max-w-[60ch] whitespace-pre-wrap text-[14px] leading-relaxed text-body">
            {commitment.description}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          {commitment.dueDate ? (
            <Badge tone={overdue ? "overdue" : done ? "muted" : "due"}>
              {overdue
                ? `Overdue · ${formatDueDate(commitment.dueDate)}`
                : `Due ${formatDueDate(commitment.dueDate)}`}
            </Badge>
          ) : null}
          {commitment.initiative ? (
            <Badge tone={done ? "muted" : "initiative"}>
              {commitment.initiative.title}
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Row actions */}
      <div className="flex shrink-0 items-start gap-2">
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
            <button className={actionBtn} type="button">
              Edit
            </button>
          }
        />
        <form action={deleteCommitment}>
          <input type="hidden" name="id" value={commitment.id} />
          <button
            type="submit"
            className={deleteBtn}
            aria-label="Delete commitment"
          >
            Delete
          </button>
        </form>
      </div>
    </Card>
  );
}
