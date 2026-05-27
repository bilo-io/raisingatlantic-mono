import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      // gcTime: Infinity so manually-seeded query data isn't garbage-collected
      // before the test asserts on it (gcTime: 0 would drop unsubscribed queries
      // immediately).
      queries: { retry: false, gcTime: Infinity, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  options: { client?: QueryClient } & Omit<RenderOptions, 'wrapper'> = {},
) {
  const client = options.client ?? createTestQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return {
    client,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}
