import { Skeleton } from '@/components/ui/skeleton';

/**
 * Streaming loading UI for the child profile detail page.
 * Renders immediately while the heavy chart/record data is processed.
 */
export default function ChildProfileLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Back button */}
      <Skeleton className="h-9 w-40 rounded-lg" />

      {/* Profile card header */}
      <div className="rounded-xl border shadow-xl overflow-hidden">
        <div className="bg-muted/30 p-6 flex items-start gap-6">
          <Skeleton className="h-32 w-32 rounded-full shrink-0" />
          <div className="flex-1 space-y-3 pt-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-48" />
              ))}
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-6 space-y-6">
          <Skeleton className="h-14 w-full rounded-lg" />
          {/* Tabs */}
          <Skeleton className="h-10 w-full rounded-lg" />
          {/* Tab content */}
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
