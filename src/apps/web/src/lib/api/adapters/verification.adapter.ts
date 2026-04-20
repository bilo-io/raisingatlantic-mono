import { apiClient } from '../api-client';
import { useApi } from '../data-source';
import { cliniciansToVerify, recordsToVerify } from '@/data/verifications';

export async function getCliniciansForVerification(): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get('/verifications/clinicians');
    return response.data;
  }
  return cliniciansToVerify;
}

export async function getRecordsForVerification(): Promise<any[]> {
  if (useApi()) {
    const response = await apiClient.get('/verifications/records');
    return response.data.map((r: any) => ({
      ...r,
      childName: r.child?.name || 'Unknown Child',
      recordType: r.type || 'Growth', // Backend currently returns 'type'
      issue: r.notes || "Inconsistent measurements or needs review",
      dateFlagged: r.createdAt || new Date().toISOString(),
      flaggedBy: "System",
      status: r.status // Map status from the record
    }));
  }
  return recordsToVerify;
}
