'use client';

import type { Practice } from '@/data/practices';
import { apiClient, createResourceHooks } from '@/lib/api';

export const practicesResource = createResourceHooks<
  Practice,
  void,
  Partial<Practice>,
  Partial<Practice>
>({
  resource: 'practices',
  baseUrl: '/practices',
  client: apiClient,
  copy: {
    create: { success: 'Practice saved' },
    update: { success: 'Practice updated' },
    delete: { success: 'Practice deleted' },
  },
});

export const {
  keys: practiceKeys,
  useList: usePractices,
  useGet: usePractice,
  useCreate: useCreatePractice,
  useUpdate: useUpdatePractice,
  useDelete: useDeletePractice,
} = practicesResource;
