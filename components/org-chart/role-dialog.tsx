"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";

export type RoleDraft = {
  id?: string;
  title?: string;
  personName?: string;
  description?: string | null;
};

export function RoleDialog({
  action,
  trigger,
  title,
  initial,
  open,
  onOpenChange,
}: {
  action: (formData: FormData) => Promise<void>;
  trigger?: React.ReactNode;
  title: string;
  initial?: RoleDraft;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  return (
    <Modal
      trigger={trigger}
      title={title}
      open={open}
      onOpenChange={onOpenChange}
    >
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
            <Label htmlFor="role-title">Role</Label>
            <Input
              id="role-title"
              name="title"
              defaultValue={initial?.title ?? ""}
              placeholder="Program Director"
              required
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="role-person">Person</Label>
            <Input
              id="role-person"
              name="personName"
              defaultValue={initial?.personName ?? ""}
              placeholder="Jamie Rivera"
              required
            />
          </div>
          <div>
            <Label htmlFor="role-desc">Short description (optional)</Label>
            <Textarea
              id="role-desc"
              name="description"
              defaultValue={initial?.description ?? ""}
              placeholder="What this role owns."
            />
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
