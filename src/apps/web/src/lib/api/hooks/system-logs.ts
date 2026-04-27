'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import type { ApiError } from '../errors';

export type SystemLog = {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, unknown>;
  createdAt: string;
  actorId?: string;
};

export type SystemLogFilters = {
  level?: SystemLog['level'];
  search?: string;
  from?: string;
  to?: string;
};

export const systemLogKeys = {
  all: ['system-logs'] as const,
  list: (filters?: SystemLogFilters) =>
    filters ? (['system-logs', 'list', filters] as const) : (['system-logs', 'list'] as const),
};

export function useSystemLogs(
  filters?: SystemLogFilters,
): UseQueryResult<SystemLog[], ApiError> {
  return useQuery<SystemLog[], ApiError>({
    queryKey: systemLogKeys.list(filters),
    queryFn: async () => {
      const search = new URLSearchParams();
      if (filters?.level) search.set('level', filters.level);
      if (filters?.search) search.set('q', filters.search);
      if (filters?.from) search.set('from', filters.from);
      if (filters?.to) search.set('to', filters.to);
      const qs = search.toString();
      const res = await apiClient.get<SystemLog[]>(qs ? `/system-logs?${qs}` : '/system-logs');
      return res.data;
    },
  });
}
