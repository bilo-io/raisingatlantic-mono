import { apiClient } from '../api-client';
import { useApi } from '../data-source';
import { dummyTenants, type Tenant } from '@/data/tenants';

export async function getTenants(): Promise<Tenant[]> {
  if (useApi()) {
    try {
      const response = await apiClient.get('/tenants');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tenants from API, falling back to dummy data', error);
      return dummyTenants;
    }
  }
  return dummyTenants;
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  if (useApi()) {
    try {
      const response = await apiClient.get(`/tenants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch tenant ${id} from API, falling back to dummy data`, error);
      return dummyTenants.find(t => t.id === id) || null;
    }
  }
  return dummyTenants.find(t => t.id === id) || null;
}

export async function createTenant(tenantData: Partial<Tenant>): Promise<Tenant> {
  if (useApi()) {
    const response = await apiClient.post('/tenants', tenantData);
    return response.data;
  }
  const newTenant = {
    ...tenantData,
    id: `tenant-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Tenant;
  return newTenant;
}

export async function updateTenant(id: string, tenantData: Partial<Tenant>): Promise<Tenant> {
  if (useApi()) {
    const response = await apiClient.patch(`/tenants/${id}`, tenantData);
    return response.data;
  }
  return { ...tenantData, id, updatedAt: new Date().toISOString() } as Tenant;
}

export async function deleteTenant(id: string): Promise<void> {
  if (useApi()) {
    await apiClient.delete(`/tenants/${id}`);
    return;
  }
  console.log(`Mock: Deleted tenant ${id}`);
}
