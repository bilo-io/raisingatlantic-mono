/** @vitest-environment jsdom */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { AxiosInstance } from 'axios';
import { createResourceHooks } from './createResourceHooks';
import { createTestQueryClient } from '../../../test/renderWithProviders';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from './errors';

vi.mock('./toast-bridge', () => ({
  useToastBridge: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}));

type Widget = { id: string; name: string };

const buildClient = () =>
  ({
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }) as unknown as AxiosInstance;

const buildHooks = (client: AxiosInstance) =>
  createResourceHooks<Widget>({
    resource: 'widgets',
    baseUrl: '/widgets',
    client,
  });

const renderWithClient = <TProps,>(callback: () => TProps) => {
  const queryClient = createTestQueryClient();
  return {
    queryClient,
    ...renderHook(callback, {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    }),
  };
};

describe('createResourceHooks', () => {
  let client: AxiosInstance;

  beforeEach(() => {
    client = buildClient();
  });

  describe('keys', () => {
    it('builds list/detail keys namespaced by resource', () => {
      const hooks = buildHooks(client);
      expect(hooks.keys.all).toEqual(['widgets']);
      expect(hooks.keys.list()).toEqual(['widgets', 'list']);
      expect(hooks.keys.list({ page: 1 } as any)).toEqual(['widgets', 'list', { page: 1 }]);
      expect(hooks.keys.detail('w-1')).toEqual(['widgets', 'detail', 'w-1']);
    });
  });

  describe('useList', () => {
    it('returns the response data on success', async () => {
      const hooks = buildHooks(client);
      (client.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: [{ id: 'w-1', name: 'A' }],
      });

      const { result } = renderWithClient(() => hooks.useList());
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ id: 'w-1', name: 'A' }]);
      expect(client.get).toHaveBeenCalledWith('/widgets');
    });

    it('applies unwrapList when provided', async () => {
      const hooks = createResourceHooks<Widget, void, Partial<Widget>, Partial<Widget>, Widget[]>({
        resource: 'widgets',
        baseUrl: '/widgets',
        client,
        unwrapList: (raw: any) => raw.items,
      });
      (client.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { items: [{ id: 'w-1', name: 'A' }] },
      });

      const { result } = renderWithClient(() => hooks.useList());
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ id: 'w-1', name: 'A' }]);
    });
  });

  describe('useGet', () => {
    it('is disabled when id is null', () => {
      const hooks = buildHooks(client);
      const { result } = renderWithClient(() => hooks.useGet(null));
      expect(result.current.fetchStatus).toBe('idle');
      expect(client.get).not.toHaveBeenCalled();
    });

    it('fetches a single resource when id is set', async () => {
      const hooks = buildHooks(client);
      (client.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { id: 'w-1', name: 'A' },
      });

      const { result } = renderWithClient(() => hooks.useGet('w-1'));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual({ id: 'w-1', name: 'A' });
      expect(client.get).toHaveBeenCalledWith('/widgets/w-1');
    });
  });

  describe('useCreate', () => {
    it('posts the dto and invalidates the list', async () => {
      const hooks = buildHooks(client);
      (client.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { id: 'w-9', name: 'New' },
      });

      const { result, queryClient } = renderWithClient(() => hooks.useCreate());
      const spy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({ name: 'New' });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(client.post).toHaveBeenCalledWith('/widgets', { name: 'New' });
      expect(spy).toHaveBeenCalledWith({ queryKey: ['widgets'] });
    });

    it('surfaces an ApiError when the request fails', async () => {
      const hooks = buildHooks(client);
      (client.post as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError('nope', 400, null),
      );

      const { result } = renderWithClient(() => hooks.useCreate());
      result.current.mutate({ name: 'X' });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeInstanceOf(ApiError);
    });
  });

  describe('useUpdate', () => {
    it('patches and invalidates both list and detail keys', async () => {
      const hooks = buildHooks(client);
      (client.patch as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { id: 'w-1', name: 'Renamed' },
      });

      const { result, queryClient } = renderWithClient(() => hooks.useUpdate());
      const spy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({ id: 'w-1', patch: { name: 'Renamed' } });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(client.patch).toHaveBeenCalledWith('/widgets/w-1', { name: 'Renamed' });
      expect(spy).toHaveBeenCalledWith({ queryKey: ['widgets'] });
      expect(spy).toHaveBeenCalledWith({ queryKey: ['widgets', 'detail', 'w-1'] });
    });
  });

  describe('useDelete', () => {
    it('optimistically removes the item from cached lists and rolls back on error', async () => {
      const hooks = buildHooks(client);
      const queryClient = createTestQueryClient();
      queryClient.setQueryData(['widgets', 'list'], [
        { id: 'w-1', name: 'A' },
        { id: 'w-2', name: 'B' },
      ]);

      (client.delete as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError('forbidden', 403, null),
      );

      const { result } = renderHook(() => hooks.useDelete(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      });

      result.current.mutate('w-1');
      await waitFor(() => expect(result.current.isError).toBe(true));

      // After rollback, the list should contain both items again
      const restored = queryClient.getQueryData<Widget[]>(['widgets', 'list']);
      expect(restored).toEqual([
        { id: 'w-1', name: 'A' },
        { id: 'w-2', name: 'B' },
      ]);
    });

    it('removes the deleted id from cached lists on success', async () => {
      const hooks = buildHooks(client);
      const queryClient = createTestQueryClient();
      queryClient.setQueryData(['widgets', 'list'], [
        { id: 'w-1', name: 'A' },
        { id: 'w-2', name: 'B' },
      ]);

      (client.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ data: undefined });

      const { result } = renderHook(() => hooks.useDelete(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      });

      result.current.mutate('w-1');
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const after = queryClient.getQueryData<Widget[]>(['widgets', 'list']);
      expect(after?.map((w) => w.id)).toEqual(['w-2']);
    });
  });
});
