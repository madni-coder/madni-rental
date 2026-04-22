import { cn } from "@/lib/utils";

export function Table({ className, ...props }) {
  return <table className={cn("min-w-full text-sm", className)} {...props} />;
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("bg-bg/40", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn(className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={cn("border-b border-border/80 transition-colors duration-150 hover:bg-bg/35", className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        "px-5 py-3 text-left text-xs font-medium uppercase tracking-[0.24em] text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return <td className={cn("px-5 py-4 align-middle text-sm text-text", className)} {...props} />;
}