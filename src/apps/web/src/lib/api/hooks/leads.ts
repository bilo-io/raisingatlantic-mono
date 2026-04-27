'use client';

import { apiClient, createResourceHooks } from '@/lib/api';

export type Lead = {
  id: string;
  email: string;
  name?: string;
  message?: string;
  source?: string;
  createdAt?: string;
};

export const leadsResource = createResourceHooks<Lead, void, Partial<Lead>, Partial<Lead>>({
  resource: 'leads',
  baseUrl: '/leads',
  client: apiClient,
  copy: {
    create: { success: 'Thanks — we’ll be in touch shortly' },
  },
});

export const {
  keys: leadKeys,
  useCreate: useCreateLead,
  // List/get/update/delete intentionally not re-exported — leads are write-only from the public site.
} = leadsResource;
