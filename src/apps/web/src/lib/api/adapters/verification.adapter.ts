import { apiClient } from '../api-client';
import { useApi } from '../data-source';
import { cliniciansToVerify, recordsToVerify } from '@/data/verifications';

export async function getCliniciansForVerification(): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get('/v1/verifications/clinicians');
    return response.data;
  }
  return cliniciansToVerify;
}

export async function getRecordsForVerification(): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get('/v1/verifications/records');
    return response.data;
  }
  return recordsToVerify;
}
