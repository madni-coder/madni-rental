import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef(function Textarea(
  { className, error, helper, label, rows = 4, ...props },
  ref,
) {
    return (
      <div className="space-y-1.5">
        {label ? (
          <label className="block text-xs font-medium uppercase tracking-[0.24em] text-muted">
            {label}
          </label>
        ) : null}
        <textarea
          aria-invalid={Boolean(error)}
          className={cn(
            "min-h-20 w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-text transition-colors duration-150 outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:border-border/50 disabled:bg-bg disabled:opacity-50 read-only:cursor-default read-only:border-border/30 read-only:bg-bg/50 read-only:text-muted",
            error && "border-danger ring-2 ring-danger/20",
            className,
          )}
          ref={ref}
          rows={rows}
          {...props}
        />
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
  },
);