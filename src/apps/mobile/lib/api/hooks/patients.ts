import { useQuery } from "@tanstack/react-query";
import { getPatients, type PatientListParams } from "../adapters/patient.adapter";

export const patientKeys = {
  all: ["patients"] as const,
  list: (params?: PatientListParams) =>
    params ? (["patients", "list", params] as const) : (["patients", "list"] as const),
};

export function usePatients(params?: PatientListParams) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => getPatients(params),
  });
}
