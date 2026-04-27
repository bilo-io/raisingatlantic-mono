'use client';

import type { ChildDetail } from '@/types/models';
import { apiClient, createResourceHooks } from '@/lib/api';

export const childrenResource = createResourceHooks<
  ChildDetail,
  void,
  Partial<ChildDetail>,
  Partial<ChildDetail>
>({
  resource: 'children',
  baseUrl: '/children',
  client: apiClient,
  copy: {
    create: { success: 'Child added' },
    update: { success: 'Child updated' },
    delete: { success: 'Child removed' },
  },
});

export const {
  keys: childKeys,
  useList: useChildren,
  useGet: useChild,
  useCreate: useCreateChild,
  useUpdate: useUpdateChild,
  useDelete: useDeleteChild,
} = childrenResource;
