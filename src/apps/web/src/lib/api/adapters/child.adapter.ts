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

export async function getChildren(): Promise<Child[]> {
  if (useApi()) {
    const response = await apiClient.get('/v1/children');
    return response.data;
  }
  return childrenDetails as any;
}

export async function getChildById(id: string): Promise<Child> {
  if (useApi()) {
    const response = await apiClient.get(`/v1/children/${id}`);
    return response.data;
  }
  const child = childrenDetails.find(c => c.id === id);
  if (!child) throw new Error('Child not found');
  return child as any;
}

export async function getUnifiedRecords(childId: string): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get(`/v1/children/${childId}/records`);
    return response.data;
  }
  // Return mock records filtered by child ID
  return dummyRecords.filter(r => r.childId === childId);
}
