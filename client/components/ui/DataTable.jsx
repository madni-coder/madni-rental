import { Inbox } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = 'No records found.',
  pagination,
}) {
  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background border-b border-border hover:bg-background">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-left"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-border last:border-0">
                {columns.map((col) => (
                  <TableCell key={col.key} className="px-4 py-3">
                    <Skeleton className="h-4 bg-border/30" style={{ width: col.skeletonWidth || '80%' }} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="px-4 py-12 text-center">
                <Inbox size={32} className="text-muted-foreground mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow
                key={row._id || i}
                className="border-b border-border last:border-0 hover:bg-border/20 transition-colors duration-100"
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className="px-4 py-3 text-sm text-foreground">
                    {col.render ? col.render(row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex justify-between items-center px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <span>
            Showing {pagination.from}–{pagination.to} of {pagination.total} results
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={pagination.onPrev}
              disabled={pagination.page <= 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={pagination.onNext}
              disabled={pagination.page >= pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
