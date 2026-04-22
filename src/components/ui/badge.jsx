import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-border bg-bg/60 text-text",
        outline: "border-border bg-bg/40 text-muted",
        success: "border-primary/30 bg-primary/10 text-primary",
        danger: "border-danger/30 bg-danger/10 text-danger",
        vacant: "border-border bg-bg/65 text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}