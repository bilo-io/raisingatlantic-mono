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
