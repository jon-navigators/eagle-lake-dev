"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A small controlled modal. Renders its trigger inline; clicking it opens an
 * overlay with the modal content. Closes on backdrop click or Escape.
 */
export function Modal({
  trigger,
  title,
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  title: string;
  children: (close: () => void) => React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolled;

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolled(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );

  const close = React.useCallback(() => setOpen(false), [setOpen]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)} className="contents">
          {trigger}
        </span>
      ) : null}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#392f2c]/42 p-4 pt-[10vh]"
          onClick={close}
        >
          <div
            className={cn(
              "w-full max-w-md overflow-hidden rounded-[10px] border-t-[3px] border-t-gold bg-white shadow-[0_28px_56px_-12px_rgba(57,47,44,0.4)]",
            )}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="p-6">
              <h2 className="mb-1 text-2xl">{title}</h2>
              <div className="mt-4">{children(close)}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
