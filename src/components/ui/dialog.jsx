"use client";

import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = forwardRef(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export const DialogContent = forwardRef(function DialogContent(
  { children, className, showClose = true, size = "md", ...props },
  ref,
) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-[10vh] z-50 w-[calc(100%-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface p-0 shadow-[var(--shadow-modal)] transition duration-200 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100",
          sizeStyles[size],
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close asChild>
            <button
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-border/30 hover:text-text focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
              type="button"
            >
              <X size={18} />
            </button>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export function DialogHeader({ className, ...props }) {
  return <div className={cn("space-y-2 border-b border-border px-6 py-5", className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn("flex items-center gap-2 pr-10 text-lg font-semibold text-text", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return <DialogPrimitive.Description className={cn("text-sm text-muted", className)} {...props} />;
}

export function DialogBody({ className, ...props }) {
  return <div className={cn("max-h-[60vh] overflow-y-auto px-6 py-5", className)} {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-end gap-3 border-t border-border px-6 py-4", className)}
      {...props}
    />
  );
}