import type {
  CompletedMilestone,
  CompletedVaccination,
  GrowthRecord,
} from "@raising-atlantic/types";
import { api } from "../client";
import { useApi } from "../data-source";
import { completedVaccinationsFixture } from "../fixtures/children";
import { growthRecordsFixture } from "../fixtures/growth";
import { milestonesFixture } from "../fixtures/milestones";

export async function getGrowthRecords(childId: string): Promise<GrowthRecord[]> {
  if (useApi()) {
    const res = await api.get<{ growth: GrowthRecord[] }>(`/children/${childId}/records`);
    return res.data.growth;
  }
  return growthRecordsFixture.filter((r) => r.childId === childId);
}

export async function getMilestones(childId: string): Promise<CompletedMilestone[]> {
  if (useApi()) {
    const res = await api.get<{ milestones: CompletedMilestone[] }>(
      `/children/${childId}/records`,
    );
    return res.data.milestones;
  }
  return milestonesFixture.filter((m) => m.childId === childId);
}

export async function getVaccinations(childId: string): Promise<CompletedVaccination[]> {
  if (useApi()) {
    const res = await api.get<{ vaccinations: CompletedVaccination[] }>(
      `/children/${childId}/records`,
    );
    return res.data.vaccinations;
  }
  return completedVaccinationsFixture.filter((v) => v.childId === childId);
}
