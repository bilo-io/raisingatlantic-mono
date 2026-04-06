import { apiClient } from '../api-client';
import { useApi } from '../data-source';
import { dummyPractices } from '@/data/practices';

export interface Practice {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  manager?: string;
  status: 'Active' | 'Inactive' | 'Temporarily Closed';
  createdAt?: string;
  updatedAt?: string;
}

export const getPractices = async (): Promise<Practice[]> => {
  if (useApi()) {
    try {
      const response = await apiClient.get('/v1/practices');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch practices from API, falling back to dummy data', error);
      return dummyPractices as Practice[];
    }
  }
  return dummyPractices as Practice[];
};

export const getPracticeById = async (id: string): Promise<Practice> => {
  if (useApi()) {
    try {
      const response = await apiClient.get(`/v1/practices/${id}`);
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
