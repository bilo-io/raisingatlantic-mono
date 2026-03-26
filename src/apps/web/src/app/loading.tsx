import { Skeleton } from '@/components/ui/skeleton';

/**
 * Root-level streaming loading UI.
 * Renders instantly while any top-level page (e.g. landing) is processing.
 */
export default function RootLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav skeleton */}
      <div className="flex items-center justify-between px-6 h-16 border-b">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6 py-24 px-4">
        <Skeleton className="h-12 w-96 rounded-xl" />
        <Skeleton className="h-5 w-80" />
        <div className="flex gap-4">
          <Skeleton className="h-11 w-36 rounded-lg" />
          <Skeleton className="h-11 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
