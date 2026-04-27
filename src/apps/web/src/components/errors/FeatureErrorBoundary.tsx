'use client';

import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
    >
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">This section failed to load</span>
      </div>
      {error?.message && (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      )}
      <Button type="button" variant="outline" size="sm" onClick={resetErrorBoundary}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

type FeatureErrorBoundaryProps = {
  children: ReactNode;
  fallback?: (props: FallbackProps) => ReactNode;
  onReset?: () => void;
};

/**
 * In-page error boundary for feature islands (charts, async cards) that
 * shouldn't blow up the whole route when they fail. For full-route
 * boundaries use Next's built-in `error.tsx`.
 */
export function FeatureErrorBoundary({
  children,
  fallback,
  onReset,
}: FeatureErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={fallback ? (props) => <>{fallback(props)}</> : DefaultFallback}
      onReset={onReset}
    >
      {children}
    </ErrorBoundary>
  );
}
