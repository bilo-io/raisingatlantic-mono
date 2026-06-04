import type {
  Child,
  CompletedMilestone,
  CompletedVaccination,
  CreateChildInput,
  GrowthRecord,
  UpdateChildInput,
} from "@raising-atlantic/types";
import { api } from "../client";
import { useApi } from "../data-source";
import { childrenFixture } from "../fixtures/children";
import { growthRecordsFixture } from "../fixtures/growth";
import { milestonesFixture } from "../fixtures/milestones";
import { completedVaccinationsFixture } from "../fixtures/children";

export type ChildRecords = {
  growth: GrowthRecord[];
  milestones: CompletedMilestone[];
  vaccinations: CompletedVaccination[];
};

export type ChildListParams = {
  tenantId?: string;
  clinicianId?: string;
  parentId?: string;
};

export async function getChildren(params?: ChildListParams): Promise<Child[]> {
  if (useApi()) {
    const res = await api.get<Child[]>("/children", { params });
    return res.data;
  }
  let list = childrenFixture;
  if (params?.parentId) list = list.filter((c) => c.parentId === params.parentId);
  if (params?.clinicianId) list = list.filter((c) => c.clinicianId === params.clinicianId);
  return list;
}

export async function getChildById(id: string): Promise<Child> {
  if (useApi()) {
    const res = await api.get<Child>(`/children/${id}`);
    return res.data;
  }
  const match = childrenFixture.find((c) => c.id === id);
  if (!match) throw new Error(`Child ${id} not found`);
  return match;
}

export async function getChildRecords(id: string): Promise<ChildRecords> {
  if (useApi()) {
    const res = await api.get<ChildRecords>(`/children/${id}/records`);
    return res.data;
  }
  return {
    growth: growthRecordsFixture.filter((r) => r.childId === id),
    milestones: milestonesFixture.filter((m) => m.childId === id),
    vaccinations: completedVaccinationsFixture.filter((v) => v.childId === id),
  };
}

export async function createChild(dto: CreateChildInput): Promise<Child> {
  if (useApi()) {
    const res = await api.post<Child>("/children", dto);
    return res.data;
  }
  const now = new Date().toISOString();
  return {
    id: `child-${Date.now()}`,
    parentId: dto.parentId,
    clinicianId: dto.clinicianId,
    name: dto.name,
    firstName: dto.firstName,
    lastName: dto.lastName,
    gender: dto.gender,
    dateOfBirth: dto.dateOfBirth,
    imageUrl: dto.imageUrl,
    status: dto.status ?? "Active",
    notes: dto.notes,
    progress: dto.progress ?? 0,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateChild(id: string, patch: UpdateChildInput): Promise<Child> {
  if (useApi()) {
    const res = await api.patch<Child>(`/children/${id}`, patch);
    return res.data;
  }
  const existing = await getChildById(id);
  return { ...existing, ...patch, updatedAt: new Date().toISOString() };
}

export async function archiveChild(id: string): Promise<Child> {
  if (useApi()) {
    const res = await api.patch<Child>(`/children/${id}`, { status: "Archived" });
    return res.data;
  }
  const existing = await getChildById(id);
  return { ...existing, status: "Archived", updatedAt: new Date().toISOString() };
}
