import type { Child } from "@raising-atlantic/types";
import { api } from "../client";
import { useApi } from "../data-source";
import { patientsFixture } from "../fixtures/patients";

export type PatientListParams = {
  clinicianId?: string;
  practiceId?: string;
};

export async function getPatients(params?: PatientListParams): Promise<Child[]> {
  if (useApi()) {
    const res = await api.get<Child[]>("/children", { params });
    return res.data;
  }
  let list = patientsFixture;
  if (params?.clinicianId) {
    list = list.filter((c) => c.clinicianId === params.clinicianId);
  }
  return list;
}
