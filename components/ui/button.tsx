import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss/60 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // One accent for primary actions — clay — used sparingly.
  primary: "bg-clay text-cream hover:bg-clay-600",
  secondary: "bg-pine text-cream hover:bg-pine-700",
  ghost: "bg-transparent text-bark hover:bg-stone/50",
  danger: "bg-transparent text-clay hover:bg-clay/10 border border-clay/40",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
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
