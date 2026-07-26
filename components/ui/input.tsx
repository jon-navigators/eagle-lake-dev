import * as React from "react";
import { cn } from "@/lib/utils";

// 3px black border, zero radius; focus casts a hard red offset shadow.
const fieldStyles =
  "w-full rounded-none border-[3px] border-ink bg-paper px-3 py-2.5 text-[14px] font-medium text-ink placeholder:text-muted focus:outline-none focus:shadow-[4px_4px_0_#c1352b] transition-shadow duration-150";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(fieldStyles, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(fieldStyles, "min-h-20 resize-y", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn(fieldStyles, className)} {...props} />
));
Select.displayName = "Select";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink",
        className,
      )}
      {...props}
    />
  );
}
