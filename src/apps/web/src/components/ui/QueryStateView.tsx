'use client';

import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ApiError } from '@/lib/api';

type QueryLike<T> = {
  isLoading: boolean;
  isError: boolean;
  error?: ApiError | null;
  data?: T;
  refetch?: () => unknown;
};

type QueryStateViewProps<T> = {
  query: QueryLike<T>;
  skeleton: ReactNode;
  /** Default empty placeholder. Used only when `isEmpty(data)` returns true. */
  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
  errorTitle?: string;
  children: (data: T) => ReactNode;
};

/**
 * Standardised wrapper that turns a TanStack Query result into one of:
 * skeleton (loading), error card (with retry), empty state, or data render.
 * Replaces ad-hoc `{loading ? <Skeleton /> : ...}` patterns.
 */
export function QueryStateView<T>({
  query,
  skeleton,
  empty,
  isEmpty,
  errorTitle = 'Something went wrong',
  children,
}: QueryStateViewProps<T>) {
  if (query.isLoading) return <>{skeleton}</>;

  if (query.isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
      >
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">{errorTitle}</span>
        </div>
        {query.error?.message && (
          <p className="text-sm text-muted-foreground">{query.error.message}</p>
        )}
        {query.refetch && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => query.refetch?.()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (query.data === undefined) return <>{skeleton}</>;

  if (isEmpty?.(query.data)) {
    return <>{empty ?? null}</>;
  }

  return <>{children(query.data)}</>;
}
