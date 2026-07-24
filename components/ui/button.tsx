import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "neutral" | "ghost" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-25 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // Teal is the primary action. Gold is never a CTA color.
  primary: "bg-teal text-white hover:bg-teal-hover",
  secondary:
    "border-[1.5px] border-teal bg-white text-teal hover:bg-teal-10",
  neutral: "border border-hair bg-white text-coffee hover:bg-subtle",
  ghost: "bg-transparent text-coffee hover:bg-subtle",
  danger: "border border-hair bg-white text-danger hover:bg-danger/5",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
