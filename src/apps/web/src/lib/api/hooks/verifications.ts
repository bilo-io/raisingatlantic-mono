'use client';

import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import type { ApiError } from '../errors';
import { useToastBridge } from '../toast-bridge';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type ClinicianVerification = {
  id: string;
  clinicianId: string;
  status: VerificationStatus;
  submittedAt?: string;
  reviewerId?: string;
  reviewedAt?: string;
  notes?: string;
};

export type RecordVerification = {
  id: string;
  recordId: string;
  childId?: string;
  status: VerificationStatus;
  submittedAt?: string;
  reviewerId?: string;
  reviewedAt?: string;
};

const keys = {
  all: ['verifications'] as const,
  clinicians: ['verifications', 'clinicians'] as const,
  records: ['verifications', 'records'] as const,
};

export function useClinicianVerifications(): UseQueryResult<ClinicianVerification[], ApiError> {
  return useQuery<ClinicianVerification[], ApiError>({
    queryKey: keys.clinicians,
    queryFn: async () => {
      const res = await apiClient.get<ClinicianVerification[]>('/verifications/clinicians');
      return res.data;
    },
  });
}

export function useRecordVerifications(): UseQueryResult<RecordVerification[], ApiError> {
  return useQuery<RecordVerification[], ApiError>({
    queryKey: keys.records,
    queryFn: async () => {
      const res = await apiClient.get<RecordVerification[]>('/verifications/records');
      return res.data;
    },
  });
}

/**
 * Approve/reject mutations — backend endpoints are not yet implemented
 * (gap G-VER-02 in the audit). The hook is wired so calling code can be
 * written against the final shape; the hook will fail with a clear toast
 * until the backend lands.
 */
type DecisionInput = { id: string; status: 'approved' | 'rejected'; notes?: string };

export function useDecideClinicianVerification() {
  const qc = useQueryClient();
  const toast = useToastBridge();
  return useMutation<ClinicianVerification, ApiError, DecisionInput>({
    mutationFn: async ({ id, status, notes }) => {
      const res = await apiClient.patch<ClinicianVerification>(
        `/verifications/clinicians/${id}`,
        { status, notes },
      );
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success(vars.status === 'approved' ? 'Clinician approved' : 'Clinician rejected');
    },
    onError: (err) => toast.error('Could not update verification', err.message),
  });
}

export function useDecideRecordVerification() {
  const qc = useQueryClient();
  const toast = useToastBridge();
  return useMutation<RecordVerification, ApiError, DecisionInput>({
    mutationFn: async ({ id, status, notes }) => {
      const res = await apiClient.patch<RecordVerification>(
        `/verifications/records/${id}`,
        { status, notes },
      );
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success(vars.status === 'approved' ? 'Record verified' : 'Record rejected');
    },
    onError: (err) => toast.error('Could not update verification', err.message),
  });
}

export const verificationKeys = keys;
