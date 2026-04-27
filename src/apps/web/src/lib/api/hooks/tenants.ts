'use client';

import type { Tenant } from '@/data/tenants';
import { apiClient, createResourceHooks } from '@/lib/api';

export const tenantsResource = createResourceHooks<Tenant, void, Partial<Tenant>, Partial<Tenant>>({
  resource: 'tenants',
  baseUrl: '/tenants',
  client: apiClient,
  copy: {
    create: { success: 'Tenant created' },
    update: { success: 'Tenant updated' },
    delete: { success: 'Tenant deleted' },
  },
});

export const {
  keys: tenantKeys,
  useList: useTenants,
  useGet: useTenant,
  useCreate: useCreateTenant,
  useUpdate: useUpdateTenant,
  useDelete: useDeleteTenant,
} = tenantsResource;
