import { apiClient } from '../api-client';
import { useApi } from '../data-source';
import { dummyClinicians } from '@/data/clinicians';
import { dummyUsers } from '@/data/users';

export async function getUsers(): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get('/users');
    return response.data;
  }
  return dummyUsers;
}

export async function getUserById(id: string): Promise<any> {
  if (useApi()) {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch user ${id} from API, falling back to dummy data`, error);
      // Fallback to dummy data
      const dummyUser = dummyUsers.find(u => u.id === id);
      if (dummyUser) return dummyUser;
      throw error;
    }
  }
  return dummyUsers.find(u => u.id === id);
}

export async function getClinicians(): Promise<any[]> {
  if (useApi()) {
    // Current API doesn't have a specific /clinicians endpoint, but users include clinicianProfile
    const response = await apiClient.get('/users');
    return response.data.filter((u: any) => u.role === 'Clinician');
  }
  return dummyClinicians;
}

export async function getPublicClinicians(): Promise<any[]> {
  if (useApi()) {
    try {
      const response = await apiClient.get('/users/clinicians/public');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch public clinicians from API, falling back to dummy data', error);
      return dummyClinicians;
    }
  }
  return dummyClinicians;
}

export async function createUser(data: any): Promise<any> {
  if (useApi()) {
    const response = await apiClient.post('/users', data);
    return response.data;
  }
  const newUser = { ...data, id: `user-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  dummyUsers.push(newUser);
  return newUser;
}

export async function updateUser(id: string, data: any): Promise<any> {
  if (useApi()) {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  }
  const index = dummyUsers.findIndex(u => u.id === id);
  if (index !== -1) {
    dummyUsers[index] = { ...dummyUsers[index], ...data, updatedAt: new Date().toISOString() };
    return dummyUsers[index];
  }
  throw new Error('User not found');
}

export async function deleteUser(id: string): Promise<void> {
  if (useApi()) {
    await apiClient.delete(`/users/${id}`);
    return;
  }
  const index = dummyUsers.findIndex(u => u.id === id);
  if (index !== -1) {
    dummyUsers.splice(index, 1);
  }
}
