import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TableSkeletonProps = {
  rows?: number;
  cols?: number;
  hasHeader?: boolean;
  className?: string;
};

export function TableSkeleton({
  rows = 5,
  cols = 4,
  hasHeader = true,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn('w-full space-y-2', className)} role="status" aria-label="Loading rows">
      {hasHeader && (
        <div
          className="grid gap-3 px-3 py-2 border-b"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-3/4" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-3 px-3 py-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
