import { apiClient } from '../api-client';
import { useApi } from '../data-source';
import { childrenDetails } from '@/data/children';
import { dummyRecords } from '@/data/records';

export interface Child {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  parentId: string;
  clinicianId?: string;
  imageUrl?: string;
  status: string;
  notes: string;
  completedMilestones: any[];
  completedVaccinations: any[];
  growthRecords: any[];
  updatedAt: string;
  createdAt: string;
  progress?: number;
}

export async function getChildren(filters?: { tenantId?: string; clinicianId?: string }): Promise<Child[]> {
  if (useApi()) {
    const params = new URLSearchParams();
    if (filters?.tenantId) params.append('tenantId', filters.tenantId);
    if (filters?.clinicianId) params.append('clinicianId', filters.clinicianId);
    
    const response = await apiClient.get(`/children?${params.toString()}`);
    return response.data.map((child: any) => ({
      ...child,
      parentId: child.parent?.id,
      clinicianId: child.clinician?.id,
    }));
  }
  return childrenDetails as any;
}

export async function getChildById(id: string): Promise<Child> {
  if (useApi()) {
    const response = await apiClient.get(`/children/${id}`);
    const child = response.data;
    return {
      ...child,
      parentId: child.parent?.id,
      clinicianId: child.clinician?.id,
    };
  }
  const child = childrenDetails.find(c => c.id === id);
  if (!child) throw new Error('Child not found');
  return child as any;
}

export async function getUnifiedRecords(childId: string): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get(`/children/${childId}/records`);
    return response.data;
  }
  // Return mock records filtered by child ID
  return dummyRecords.filter(r => r.childId === childId);
}
export async function createChild(data: Partial<Child>): Promise<Child> {
  if (useApi()) {
    const response = await apiClient.post('/children', data);
    return response.data;
  }
  const newChild = { 
    ...data, 
    id: `child-${Date.now()}`, 
    progress: 0,
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  } as any;
  childrenDetails.push(newChild);
  return newChild;
}

export async function updateChild(id: string, data: Partial<Child>): Promise<Child> {
  if (useApi()) {
    const response = await apiClient.patch(`/children/${id}`, data);
    return response.data;
  }
  const index = childrenDetails.findIndex(c => c.id === id);
  if (index !== -1) {
    childrenDetails[index] = { ...childrenDetails[index], ...data, updatedAt: new Date().toISOString() } as any;
    return childrenDetails[index] as any;
  }
  throw new Error('Child not found');
}

export interface CompletedVaccinationInput {
  vaccineId: string;
  dateAdministered: string;
  batchNumber?: string;
  expiryDate?: string;
  manufacturer?: string;
  administeredByName?: string;
  clinicName?: string;
  source?: 'CLINICIAN' | 'PARENT';
}

export async function addCompletedVaccination(childId: string, data: CompletedVaccinationInput): Promise<any> {
  if (useApi()) {
    const response = await apiClient.post(`/children/${childId}/vaccinations`, data);
    return response.data;
  }
  const child = childrenDetails.find(c => c.id === childId);
  if (!child) throw new Error('Child not found');
  const record = {
    id: `cv-${Date.now()}`,
    ...data,
  };
  (child as any).completedVaccinations = [...((child as any).completedVaccinations || []), record];
  return record;
}

export async function deleteChild(id: string): Promise<void> {
  if (useApi()) {
    await apiClient.delete(`/children/${id}`);
    return;
  }
  const index = childrenDetails.findIndex(c => c.id === id);
  if (index !== -1) {
    childrenDetails.splice(index, 1);
  }
}
