'use client';

import { apiClient, createResourceHooks } from '@/lib/api';

export type ReportType = 'GROWTH' | 'VACCINATION' | 'MILESTONE' | 'GENERAL';

export type Report = {
  id: string;
  childId: string;
  type: ReportType;
  title?: string;
  data?: Record<string, unknown>;
  recordedAt: string;
  recordedById?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const reportsResource = createResourceHooks<
  Report,
  { childId?: string; type?: ReportType } | void,
  Partial<Report>,
  Partial<Report>
>({
  resource: 'reports',
  baseUrl: '/reports',
  client: apiClient,
  listPath: (params) => {
    if (!params) return '/reports';
    const search = new URLSearchParams();
    if (params.childId) search.set('childId', params.childId);
    if (params.type) search.set('type', params.type);
    const qs = search.toString();
    return qs ? `/reports?${qs}` : '/reports';
  },
  copy: {
    create: { success: 'Record saved' },
    update: { success: 'Record updated' },
    delete: { success: 'Record deleted' },
  },
});

export const {
  keys: reportKeys,
  useList: useReports,
  useGet: useReport,
  useCreate: useCreateReport,
  useUpdate: useUpdateReport,
  useDelete: useDeleteReport,
} = reportsResource;
