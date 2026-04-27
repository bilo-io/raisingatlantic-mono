'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import type { ApiError } from '../errors';
import type { User } from '@/types/models';

/**
 * Public, unauthenticated read of the clinician directory.
 * Backend route: GET /v1/users/clinicians/public.
 */
export const cliniciansPublicKeys = {
  all: ['clinicians', 'public'] as const,
};

export function usePublicClinicians(): UseQueryResult<User[], ApiError> {
  return useQuery<User[], ApiError>({
    queryKey: cliniciansPublicKeys.all,
    queryFn: async () => {
      const res = await apiClient.get<User[]>('/users/clinicians/public');
      return res.data;
    },
  });
}

export function usePublicPractices<T = unknown>(): UseQueryResult<T, ApiError> {
  return useQuery<T, ApiError>({
    queryKey: ['practices', 'public'] as const,
    queryFn: async () => {
      const res = await apiClient.get<T>('/practices/public');
      return res.data;
    },
  });
}
