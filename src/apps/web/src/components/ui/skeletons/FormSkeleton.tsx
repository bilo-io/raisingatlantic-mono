import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function FormSkeleton({
  fields = 6,
  hasSubmit = true,
  className,
}: {
  fields?: number;
  hasSubmit?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4 max-w-xl', className)} role="status" aria-label="Loading form">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      {hasSubmit && <Skeleton className="h-10 w-32 mt-6" />}
    </div>
  );
}
