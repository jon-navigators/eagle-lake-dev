"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Label } from "@/components/ui/input";

export type InitiativeDraft = {
  id?: string;
  title?: string;
  description?: string | null;
  period?: "QUARTERLY" | "ANNUAL";
};

export function InitiativeDialog({
  action,
  trigger,
  title,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  trigger: React.ReactNode;
  title: string;
  initial?: InitiativeDraft;
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
            <Label htmlFor="init-title">Goal</Label>
            <Input
              id="init-title"
              name="title"
              defaultValue={initial?.title ?? ""}
              placeholder="Grow summer enrollment 15%"
              required
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="init-desc">Description (optional)</Label>
            <Textarea
              id="init-desc"
              name="description"
              defaultValue={initial?.description ?? ""}
              placeholder="Why this matters this season."
            />
          </div>
          <div>
            <Label htmlFor="init-period">Timeframe</Label>
            <Select
              id="init-period"
              name="period"
              defaultValue={initial?.period ?? "QUARTERLY"}
            >
              <option value="QUARTERLY">Quarterly</option>
              <option value="ANNUAL">Annual</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
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
