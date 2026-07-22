"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Label } from "@/components/ui/input";

export type InitiativeOption = { id: string; title: string };

export type CommitmentDraft = {
  id?: string;
  title?: string;
  description?: string | null;
  dueDate?: string | null; // yyyy-mm-dd
  initiativeId?: string | null;
};

/** Shared create/edit dialog for a commitment. */
export function CommitmentDialog({
  action,
  trigger,
  title,
  initial,
  initiatives = [],
}: {
  action: (formData: FormData) => Promise<void>;
  trigger: React.ReactNode;
  title: string;
  initial?: CommitmentDraft;
  initiatives?: InitiativeOption[];
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  return (
    <Modal trigger={trigger} title={title}>
      {(close) => (
        <form
          action={async (fd) => {
            setPending(true);
            try {
              await action(fd);
              close();
              router.refresh();
            } finally {
              setPending(false);
            }
          }}
          className="space-y-4"
        >
          {initial?.id ? (
            <input type="hidden" name="id" value={initial.id} />
          ) : null}

          <div>
            <Label htmlFor="title">What are you committing to?</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initial?.title ?? ""}
              placeholder="Draft the summer schedule"
              required
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="description">Notes (optional)</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initial?.description ?? ""}
              placeholder="Anything that helps future-you."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="dueDate">Due date (optional)</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={initial?.dueDate ?? ""}
              />
            </div>
            {initiatives.length > 0 ? (
              <div>
                <Label htmlFor="initiativeId">Initiative (optional)</Label>
                <Select
                  id="initiativeId"
                  name="initiativeId"
                  defaultValue={initial?.initiativeId ?? ""}
                >
                  <option value="">— none —</option>
                  {initiatives.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.title}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
