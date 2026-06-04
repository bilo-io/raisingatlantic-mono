import type { FeatureFlag, SystemHealth, TenantSummary } from "@raising-atlantic/types";
import { fixtureTenantId, fixtureTenantIdB } from "./users";

const NOW = "2026-01-15T10:00:00.000Z";

export const systemHealthFixture: SystemHealth = {
  status: "ok",
  lastCheckedAt: NOW,
  components: {
    api: "ok",
    db: "ok",
    queue: "degraded",
  },
};

export const featureFlagsFixture: FeatureFlag[] = [
  {
    key: "parent.growth-charts",
    label: "Parent · Growth charts (mobile)",
    enabled: true,
    rolloutPercent: 100,
  },
  {
    key: "parent.epi-reminders",
    label: "Parent · EPI vaccine push reminders",
    enabled: true,
    rolloutPercent: 50,
  },
  {
    key: "clinician.bulk-verify",
    label: "Clinician · Bulk verify records",
    enabled: false,
    rolloutPercent: 0,
  },
  {
    key: "admin.activity-export",
    label: "Admin · System-log CSV export",
    enabled: false,
  },
  {
    key: "popia.dsar-self-serve",
    label: "POPIA · Self-serve DSAR export",
    enabled: true,
    rolloutPercent: 25,
  },
];

export const tenantSummariesFixture: TenantSummary[] = [
  {
    id: fixtureTenantId,
    name: "Cape Town Paediatrics",
    userCount: 6,
    practiceCount: 2,
  },
  {
    id: fixtureTenantIdB,
    name: "Joburg Family Health",
    userCount: 3,
    practiceCount: 1,
  },
];
