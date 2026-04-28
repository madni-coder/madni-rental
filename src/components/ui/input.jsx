import { forwardRef } from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(function Input(
  { className, error, helper, icon, label, onClear, type = "text", ...props },
  ref,
) {
  const showClear = typeof onClear === "function" && props.value;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="block text-xs font-medium uppercase tracking-[0.24em] text-muted">
          {label}
        </label>
      ) : null}
      <div className="relative flex items-center">
        {icon ? <span className="pointer-events-none absolute left-3 text-muted">{icon}</span> : null}
        <input
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text transition-colors duration-150 outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:border-border/50 disabled:bg-bg disabled:opacity-50 read-only:cursor-default read-only:border-border/30 read-only:bg-bg/50 read-only:text-muted",
            icon && "pl-9",
            showClear && "pr-8",
            error && "border-danger ring-2 ring-danger/20",
            className,
          )}
          ref={ref}
          type={type}
          {...props}
        />
        {showClear ? (
          <button
            aria-label="Clear"
            className="absolute right-2.5 text-muted transition-colors hover:text-text"
            onClick={onClear}
            type="button"
          >
            <X size={14} />
          </button>
        ) : null}
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