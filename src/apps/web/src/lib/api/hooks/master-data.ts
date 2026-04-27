'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import type { ApiError } from '../errors';

/**
 * Master-data lookups (vaccinations, milestones, growth reference, etc).
 * Backend mounts these under `/records/...` (see api master-data controller),
 * so we expose them as a small set of typed read-only hooks rather than
 * funnelling through createResourceHooks.
 */
export const masterDataKeys = {
  all: ['master-data'] as const,
  growth: ['master-data', 'growth'] as const,
  vaccinations: ['master-data', 'vaccinations'] as const,
  vaccinationsCompleted: (childId: string) =>
    ['master-data', 'vaccinations', 'completed', childId] as const,
  milestones: ['master-data', 'milestones'] as const,
  milestonesCompleted: (childId: string) =>
    ['master-data', 'milestones', 'completed', childId] as const,
};

function read<T>(path: string) {
  return async () => (await apiClient.get<T>(path)).data;
}

export function useGrowthReference<T = unknown>(): UseQueryResult<T, ApiError> {
  return useQuery<T, ApiError>({
    queryKey: masterDataKeys.growth,
    queryFn: read<T>('/records/growth'),
  });
}

export function useVaccinationCatalog<T = unknown>(): UseQueryResult<T, ApiError> {
  return useQuery<T, ApiError>({
    queryKey: masterDataKeys.vaccinations,
    queryFn: read<T>('/records/vaccinations'),
  });
}

export function useMilestoneCatalog<T = unknown>(): UseQueryResult<T, ApiError> {
  return useQuery<T, ApiError>({
    queryKey: masterDataKeys.milestones,
    queryFn: read<T>('/records/milestones'),
  });
}
