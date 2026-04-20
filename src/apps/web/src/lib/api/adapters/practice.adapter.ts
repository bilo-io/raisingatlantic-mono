import { apiClient } from '../api-client';
import { useApi } from '../data-source';
import { dummyPractices } from '@/data/practices';

export interface Practice {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email?: string;
  website?: string;
  manager?: string;
  tenantId: string;
  status: 'Active' | 'Inactive' | 'Temporarily Closed';
  createdAt?: string;
  updatedAt?: string;
}

export const getPractices = async (): Promise<Practice[]> => {
  if (useApi()) {
    try {
      const response = await apiClient.get('/practices');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch practices from API, falling back to dummy data', error);
      return dummyPractices as Practice[];
    }
  }
  return dummyPractices as Practice[];
};

export const getPublicPractices = async (): Promise<Practice[]> => {
  if (useApi()) {
    try {
      const response = await apiClient.get('/practices/public');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch public practices from API, falling back to dummy data', error);
      return dummyPractices as Practice[];
    }
  }
  return dummyPractices as Practice[];
};

export const getPracticeById = async (id: string): Promise<Practice> => {
  if (useApi()) {
    try {
      const response = await apiClient.get(`/practices/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch practice ${id} from API, falling back to dummy data`, error);
      const dummy = dummyPractices.find(p => p.id === id);
      if (!dummy) throw new Error('Practice not found');
      return dummy as Practice;
    }
  }
  const dummy = dummyPractices.find(p => p.id === id);
  if (!dummy) throw new Error('Practice not found');
  return dummy as Practice;
};
export const createPractice = async (data: Partial<Practice>): Promise<Practice> => {
  if (useApi()) {
    const response = await apiClient.post('/practices', data);
    return response.data;
  }
  const newPractice = { ...data, id: `practice-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Practice;
  dummyPractices.push(newPractice as any);
  return newPractice;
};

export const updatePractice = async (id: string, data: Partial<Practice>): Promise<Practice> => {
  if (useApi()) {
    const response = await apiClient.patch(`/practices/${id}`, data);
    return response.data;
  }
  const index = dummyPractices.findIndex(p => p.id === id);
  if (index !== -1) {
    dummyPractices[index] = { ...dummyPractices[index], ...data, updatedAt: new Date().toISOString() } as any;
    return dummyPractices[index] as any;
  }
  throw new Error('Practice not found');
};

export const deletePractice = async (id: string): Promise<void> => {
  if (useApi()) {
    await apiClient.delete(`/practices/${id}`);
    return;
  }
  const index = dummyPractices.findIndex(p => p.id === id);
  if (index !== -1) {
    dummyPractices.splice(index, 1);
  }
};
