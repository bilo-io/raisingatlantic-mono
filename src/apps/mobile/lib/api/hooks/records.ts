import { useQuery } from "@tanstack/react-query";
import {
  getGrowthRecords,
  getMilestones,
  getVaccinations,
} from "../adapters/record.adapter";

export const recordKeys = {
  all: ["records"] as const,
  growth: (childId: string) => ["records", "growth", childId] as const,
  milestones: (childId: string) => ["records", "milestones", childId] as const,
  vaccinations: (childId: string) => ["records", "vaccinations", childId] as const,
};

export function useGrowthRecords(childId: string | undefined | null) {
  return useQuery({
    queryKey: recordKeys.growth(childId ?? ""),
    queryFn: () => getGrowthRecords(childId as string),
    enabled: !!childId,
  });
}

export function useMilestones(childId: string | undefined | null) {
  return useQuery({
    queryKey: recordKeys.milestones(childId ?? ""),
    queryFn: () => getMilestones(childId as string),
    enabled: !!childId,
  });
}

export function useVaccinations(childId: string | undefined | null) {
  return useQuery({
    queryKey: recordKeys.vaccinations(childId ?? ""),
    queryFn: () => getVaccinations(childId as string),
    enabled: !!childId,
  });
}
