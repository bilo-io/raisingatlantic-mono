import type {
  CompletedMilestone,
  CompletedVaccination,
  CreateCompletedMilestoneInput,
  CreateCompletedVaccinationInput,
  CreateGrowthRecordInput,
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

export async function addGrowthRecord(
  childId: string,
  dto: CreateGrowthRecordInput,
): Promise<GrowthRecord> {
  if (useApi()) {
    const res = await api.post<GrowthRecord>(`/children/${childId}/growth`, dto);
    return res.data;
  }
  const now = new Date().toISOString();
  return {
    id: `growth-${Date.now()}`,
    childId,
    date: dto.date,
    height: dto.height,
    weight: dto.weight,
    headCircumference: dto.headCircumference,
    notes: dto.notes,
    status: dto.source === "CLINICIAN" ? "Active" : "Pending Assessment",
    createdAt: now,
    updatedAt: now,
  };
}

export async function addMilestone(
  childId: string,
  dto: CreateCompletedMilestoneInput,
): Promise<CompletedMilestone> {
  if (useApi()) {
    const res = await api.post<CompletedMilestone>(`/children/${childId}/milestones`, dto);
    return res.data;
  }
  const now = new Date().toISOString();
  return {
    id: `ms-${Date.now()}`,
    childId,
    milestoneId: dto.milestoneId,
    dateAchieved: dto.dateAchieved,
    notes: dto.notes,
    status: dto.source === "CLINICIAN" ? "Active" : "Pending Assessment",
    createdAt: now,
    updatedAt: now,
  };
}

export async function addCompletedVaccination(
  childId: string,
  dto: CreateCompletedVaccinationInput,
): Promise<CompletedVaccination> {
  if (useApi()) {
    const res = await api.post<CompletedVaccination>(`/children/${childId}/vaccinations`, dto);
    return res.data;
  }
  const now = new Date().toISOString();
  return {
    id: `vax-${Date.now()}`,
    childId,
    vaccineId: dto.vaccineId,
    dateAdministered: dto.dateAdministered,
    batchNumber: dto.batchNumber,
    expiryDate: dto.expiryDate,
    manufacturer: dto.manufacturer,
    administeredByName: dto.administeredByName,
    clinicName: dto.clinicName,
    source: dto.source ?? "PARENT",
    status: dto.source === "CLINICIAN" ? "Active" : "Pending Assessment",
    createdAt: now,
    updatedAt: now,
  };
}
