import { forwardRef } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = forwardRef(function Select(
  { children, className, error, helper, label, ...props },
  ref,
) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="block text-xs font-medium uppercase tracking-[0.24em] text-muted">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full appearance-none rounded-md border border-border bg-surface px-3 py-2 pr-10 text-sm text-text transition-colors duration-150 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:border-border/50 disabled:bg-bg disabled:opacity-50",
            error && "border-danger ring-2 ring-danger/20",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          size={16}
        />
      </div>
      {error ? (
        <p className="flex items-center gap-1 text-xs text-danger">
          <AlertCircle aria-hidden="true" size={12} />
          {error}
        </p>
      ) : helper ? (
        <p className="text-xs text-muted">{helper}</p>
      ) : null}
    </div>
  );
});