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
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(28,26,23,0.5)] p-4 pt-[10vh]"
          onClick={close}
        >
          <div
            className={cn(
              "w-full max-w-md rounded-none border-[3px] border-ink bg-paper shadow-[10px_10px_0_rgba(28,26,23,0.55)]",
            )}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* red-hatched cap */}
            <div className="hatch-red h-3 border-b-[3px] border-ink" />
            <div className="p-6">
              <h2 className="font-display text-[21px] leading-tight text-ink">
                {title}
              </h2>
              <div className="mt-5">{children(close)}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
