import { cn } from "@/lib/utils";

export function PageHeader({ action, className, title }) {
  return (
    <div className={cn("mb-6 flex items-center justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-bold text-text">{title}</h1>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}