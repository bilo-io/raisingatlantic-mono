import { useQuery } from "@tanstack/react-query";
import {
  getFeatureFlags,
  getSystemHealth,
  getTenantSummaries,
} from "../adapters/system.adapter";

export const systemKeys = {
  all: ["system"] as const,
  health: () => ["system", "health"] as const,
  featureFlags: () => ["system", "feature-flags"] as const,
  tenants: () => ["system", "tenants"] as const,
};

export function useSystemHealth() {
  return useQuery({
    queryKey: systemKeys.health(),
    queryFn: getSystemHealth,
  });
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: systemKeys.featureFlags(),
    queryFn: getFeatureFlags,
  });
}

export function useTenantSummaries() {
  return useQuery({
    queryKey: systemKeys.tenants(),
    queryFn: getTenantSummaries,
  });
}
