import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base",
      },
      variant: {
        primary: "bg-primary text-white hover:brightness-110 hover:shadow-md active:scale-[0.98] active:brightness-90",
        secondary: "border border-border bg-surface text-text hover:bg-border/50 active:scale-[0.98]",
        ghost: "bg-transparent text-muted hover:bg-surface hover:text-text active:scale-[0.98]",
        danger: "border border-danger/40 bg-danger/15 text-danger hover:border-danger hover:bg-danger hover:text-white active:scale-[0.98]",
        icon: "min-h-10 min-w-10 bg-transparent p-1.5 text-muted hover:bg-surface hover:text-text active:scale-[0.98]",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  },
);

export const Button = forwardRef(function Button(
  { asChild = false, children, className, loading = false, size, variant, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonVariants({ size, variant }),
        loading && "pointer-events-none opacity-80",
        className,
      )}
      ref={ref}
      {...props}
    >
      {loading ? <Loader2 aria-hidden="true" className="animate-spin" size={16} /> : null}
      {children}
    </Comp>
  );
});