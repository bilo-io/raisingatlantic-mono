import type { ClinicianForVerification, VerifiableRecord } from "@raising-atlantic/types";
import { api } from "../client";
import { useApi } from "../data-source";
import {
  pendingClinicianVerificationsFixture,
  pendingRecordVerificationsFixture,
} from "../fixtures/verifications";

export async function getRecordVerifications(): Promise<VerifiableRecord[]> {
  if (useApi()) {
    const res = await api.get<VerifiableRecord[]>("/verifications/records");
    return res.data;
  }
  return pendingRecordVerificationsFixture;
}

export async function getClinicianVerifications(): Promise<ClinicianForVerification[]> {
  if (useApi()) {
    const res = await api.get<ClinicianForVerification[]>("/verifications/clinicians");
    return res.data;
  }
  return pendingClinicianVerificationsFixture;
}
