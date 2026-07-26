"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";

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
            <Label>Timeframe</Label>
            <div className="flex gap-3">
              {(["QUARTERLY", "ANNUAL"] as const).map((p) => (
                <label key={p} className="flex-1">
                  <input
                    type="radio"
                    name="period"
                    value={p}
                    defaultChecked={(initial?.period ?? "QUARTERLY") === p}
                    className="peer sr-only"
                  />
                  <span className="block cursor-pointer border-[3px] border-ink bg-paper px-3 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink transition-[background-color,color,box-shadow] hover:bg-tan peer-checked:bg-red peer-checked:text-paper peer-checked:shadow-[4px_4px_0_#1c1a17]">
                    {p === "ANNUAL" ? "Annual" : "Quarterly"}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="neutral" onClick={close}>
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
