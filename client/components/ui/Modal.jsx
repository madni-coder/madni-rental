import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  icon: Icon,
  size = 'md',
  footer,
  children,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          'bg-card border-border p-0 mt-[10vh]',
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={20} className="text-primary" aria-hidden="true" />}
            <DialogTitle className="text-lg font-semibold text-foreground">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto max-h-[60vh]">{children}</div>

        {/* Footer */}
        {footer && (
          <DialogFooter className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
