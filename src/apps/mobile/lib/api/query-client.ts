import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./errors";

const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 409, 422]);

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && NON_RETRYABLE_STATUSES.has(error.status)) {
    return false;
  }
  return failureCount < 3;
}

function backoffDelay(attempt: number): number {
  return Math.min(1000 * 2 ** attempt, 30_000);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, err) => shouldRetry(failureCount, err),
      retryDelay: backoffDelay,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, err) => shouldRetry(failureCount, err),
      retryDelay: backoffDelay,
    },
  },
});
