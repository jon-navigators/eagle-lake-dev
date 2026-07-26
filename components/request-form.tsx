"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Label } from "@/components/ui/input";
import { requestCommitment } from "@/app/(app)/commitments/actions";
import type { InitiativeOption } from "@/components/commitment-form";

export type PersonOption = { id: string; label: string };

export function RequestDialog({
  people,
  initiatives = [],
  trigger,
}: {
  people: PersonOption[];
  initiatives?: InitiativeOption[];
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  return (
    <Modal trigger={trigger} title="Ask a teammate">
      {(close) => (
        <form
          action={async (fd) => {
            setPending(true);
            try {
              await requestCommitment(fd);
              close();
              router.refresh();
            } finally {
              setPending(false);
            }
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="toUserId">Who are you asking?</Label>
            <Select id="toUserId" name="toUserId" required defaultValue="">
              <option value="" disabled>
                Choose a teammate…
              </option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="req-title">What are you asking them to do?</Label>
            <Input
              id="req-title"
              name="title"
              placeholder="Review the retreat budget"
              required
            />
          </div>

          <div>
            <Label htmlFor="req-desc">Notes (optional)</Label>
            <Textarea
              id="req-desc"
              name="description"
              placeholder="Context that helps them decide."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="req-due">Due date (optional)</Label>
              <Input id="req-due" name="dueDate" type="date" />
            </div>
            {initiatives.length > 0 ? (
              <div>
                <Label htmlFor="req-init">Initiative (optional)</Label>
                <Select id="req-init" name="initiativeId" defaultValue="">
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

          <p className="text-xs text-bark-soft">
            They can accept or decline. A decline simply sends it back to you — no
            hard feelings.
          </p>

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="neutral" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || people.length === 0}>
              {pending ? "Sending…" : "Send request"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
