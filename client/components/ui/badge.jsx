import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium border border-transparent whitespace-nowrap transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:    "bg-primary text-primary-foreground",
        secondary:  "bg-secondary text-secondary-foreground",
        outline:    "border-border text-foreground",
        // status variants
        active:     "bg-primary/15 text-primary",
        paid:       "bg-primary/15 text-primary",
        pending:    "bg-muted-foreground/15 text-muted-foreground",
        partial:    "bg-primary/10 text-primary/70",
        cancelled:  "bg-border/40 text-muted-foreground/60",
        overdue:    "bg-destructive/15 text-destructive",
        inactive:   "bg-background/60 text-muted-foreground/50",
        exited:     "bg-background/60 text-muted-foreground/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  dot = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />}
      {props.children}
    </Comp>
  );
}

export { Badge, badgeVariants }
