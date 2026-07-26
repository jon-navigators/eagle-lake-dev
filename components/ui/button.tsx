import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "neutral" | "ghost" | "danger" | "accept";
type Size = "sm" | "md";

// Uppercase, outlined, hard offset shadow. Presses into its own shadow.
const base =
  "press inline-flex items-center justify-center gap-2 rounded-none border-ink font-extrabold uppercase tracking-[0.12em] transition-[background-color,color,box-shadow,transform] duration-150 active:shadow-[2px_2px_0_#1c1a17] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // Red is the ONLY primary-action color.
  primary:
    "border-[3px] bg-red text-paper shadow-[4px_4px_0_#1c1a17] hover:bg-red-dark",
  secondary:
    "border-[3px] bg-paper text-ink shadow-[4px_4px_0_#1c1a17] hover:bg-tan",
  // Green has exactly one job: Accept.
  accept:
    "border-[3px] bg-green text-paper shadow-[4px_4px_0_#1c1a17] hover:brightness-90",
  neutral:
    "border-[2px] border-muted-border bg-transparent text-body hover:border-ink hover:text-ink",
  ghost:
    "border-[2px] border-ink bg-transparent text-ink hover:bg-gold shadow-none active:shadow-none",
  danger:
    "border-[2px] border-muted-border bg-transparent text-muted hover:border-red hover:text-red shadow-none active:shadow-none",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[11px]",
  md: "px-5 py-2.5 text-[12px]",
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
