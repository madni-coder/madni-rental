import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FormField({ label, helper, error, required, children, className }) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {helper && !error && (
        <p className="text-xs text-muted-foreground mt-0.5">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
