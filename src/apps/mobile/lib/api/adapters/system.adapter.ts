import type { FeatureFlag, SystemHealth, TenantSummary } from "@raising-atlantic/types";
import { api } from "../client";
import { useApi } from "../data-source";
import {
  featureFlagsFixture,
  systemHealthFixture,
  tenantSummariesFixture,
} from "../fixtures/system";

export async function getSystemHealth(): Promise<SystemHealth> {
  if (useApi()) {
    const res = await api.get<SystemHealth>("/health");
    return res.data;
  }
  return systemHealthFixture;
}

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  if (useApi()) {
    const res = await api.get<FeatureFlag[]>("/feature-flags");
    return res.data;
  }
  return featureFlagsFixture;
}

export async function getTenantSummaries(): Promise<TenantSummary[]> {
  if (useApi()) {
    const res = await api.get<TenantSummary[]>("/tenants");
    return res.data;
  }
  return tenantSummariesFixture;
}
