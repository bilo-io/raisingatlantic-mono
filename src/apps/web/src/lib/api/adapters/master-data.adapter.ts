import { apiClient } from '../api-client';
import { useApi } from '../data-source';
import { standardMilestonesByAge } from '@/data/milestones';
import { standardVaccinationSchedule } from '@/data/vaccinations';

export async function getMilestones(): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get('/records/milestones');
    return response.data;
  }
  return standardMilestonesByAge;
}

export async function getVaccinationSchedule(): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get('/records/vaccinations');
    return response.data;
  }
  return standardVaccinationSchedule;
}

export async function getGrowthRecords(): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get('/records/growth');
    return response.data;
  }
  return []; // No dummy records for growth yet
}

export async function getAllCompletedMilestones(): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get('/records/milestones/completed');
    return response.data;
  }
  return [];
}

export async function getAllCompletedVaccinations(): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get('/records/vaccinations/completed');
    return response.data;
  }
  return [];
}
