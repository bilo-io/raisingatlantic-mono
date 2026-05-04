'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  /** Override the title shown in the error card. */
  title?: string;
  /** Override the muted-tone description. */
  description?: string;
  /** Where the secondary "back" action sends the user. Defaults to '/'. */
  homeHref?: string;
  /** Label for the secondary action. Defaults to 'Return Home'. */
  homeLabel?: string;
};

/**
 * Shared route-level error template re-used by every Next.js error.tsx
 * boundary. Logs to the console in dev and exposes "Try Again" + a
 * configurable secondary action.
 */
export function RouteError({
  error,
  reset,
  title = 'Something went wrong',
  description = 'We encountered an unexpected issue while loading this page. Our team has been notified.',
  homeHref = '/',
  homeLabel = 'Return Home',
}: RouteErrorProps) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-6">
      <Card className="max-w-md w-full shadow-lg border-destructive/20 text-center">
        <CardHeader className="flex flex-col items-center">
          <div className="bg-destructive/10 p-4 rounded-full mb-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">{title}</CardTitle>
          <CardDescription className="text-base mt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground text-left overflow-auto max-h-32 mb-2 font-mono">
            {error.message || 'An unknown network or server error occurred.'}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="default" onClick={() => reset()}>
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = homeHref;
            }}
          >
            {homeLabel}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
