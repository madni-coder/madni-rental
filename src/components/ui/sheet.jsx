"use client";

import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export const SheetContent = forwardRef(function SheetContent({ children, className, ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
      <DialogPrimitive.Content
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-[560px] flex-col overflow-hidden border-l border-border bg-surface px-6 py-5 shadow-[var(--shadow-modal)] transition-transform duration-200 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
        <DialogPrimitive.Close asChild>
          <button
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-border/30 hover:text-text focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
            type="button"
          >
            <X size={18} />
          </button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export function SheetHeader({ className, ...props }) {
  return <div className={cn("border-b border-border pb-5 pr-10", className)} {...props} />;
}

export function SheetTitle({ className, ...props }) {
  return <DialogPrimitive.Title className={cn("flex items-center gap-2 text-lg font-semibold text-text", className)} {...props} />;
}

export function SheetDescription({ className, ...props }) {
  return <DialogPrimitive.Description className={cn("mt-2 text-sm text-muted", className)} {...props} />;
}