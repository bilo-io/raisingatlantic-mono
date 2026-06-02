import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "../errors";
import {
  getClinicianVerifications,
  getRecordVerifications,
} from "../adapters/verification.adapter";

export const verificationKeys = {
  all: ["verifications"] as const,
  records: () => ["verifications", "records"] as const,
  clinicians: () => ["verifications", "clinicians"] as const,
};

export function useVerificationsRecords() {
  return useQuery({
    queryKey: verificationKeys.records(),
    queryFn: getRecordVerifications,
  });
}

export function useVerificationsClinicians() {
  return useQuery({
    queryKey: verificationKeys.clinicians(),
    queryFn: getClinicianVerifications,
  });
}

export type { ApiError };
