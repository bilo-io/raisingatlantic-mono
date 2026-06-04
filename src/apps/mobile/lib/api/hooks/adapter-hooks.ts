import type {
  Child,
  CompletedMilestone,
  CompletedVaccination,
  CreateChildInput,
  CreateCompletedMilestoneInput,
  CreateCompletedVaccinationInput,
  CreateGrowthRecordInput,
  GrowthRecord,
  Practice,
  UpdateChildInput,
  UpdateUserInput,
  User,
} from "@raising-atlantic/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveChild,
  ChildListParams,
  createChild,
  getChildById,
  getChildren,
  getChildRecords,
  updateChild,
} from "../adapters/child.adapter";
import { getPracticeById, getPublicPractices } from "../adapters/practice.adapter";
import {
  addCompletedVaccination,
  addGrowthRecord,
  addMilestone,
} from "../adapters/record.adapter";
import { updateUser } from "../adapters/user.adapter";
import { ApiError } from "../errors";

const childrenKeys = {
  all: ["children"] as const,
  list: (params?: ChildListParams) => ["children", "list", params ?? null] as const,
  detail: (id: string) => ["children", "detail", id] as const,
  records: (id: string) => ["children", "records", id] as const,
};

const practiceKeys = {
  all: ["practices"] as const,
  publicList: () => ["practices", "public-list"] as const,
  detail: (id: string) => ["practices", "detail", id] as const,
};

const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};

export function useChildrenList(params?: ChildListParams) {
  return useQuery<Child[], ApiError>({
    queryKey: childrenKeys.list(params),
    queryFn: () => getChildren(params),
  });
}

export function useChildDetail(id: string | undefined | null) {
  return useQuery<Child, ApiError>({
    queryKey: childrenKeys.detail(id ?? ""),
    queryFn: () => getChildById(id as string),
    enabled: !!id,
  });
}

export function useChildRecordsAll(id: string | undefined | null) {
  return useQuery({
    queryKey: childrenKeys.records(id ?? ""),
    queryFn: () => getChildRecords(id as string),
    enabled: !!id,
  });
}

export function useChildCreate() {
  const qc = useQueryClient();
  return useMutation<Child, ApiError, CreateChildInput>({
    mutationFn: (dto) => createChild(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childrenKeys.all });
    },
  });
}

export function useChildUpdate() {
  const qc = useQueryClient();
  return useMutation<Child, ApiError, { id: string; patch: UpdateChildInput }>({
    mutationFn: ({ id, patch }) => updateChild(id, patch),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: childrenKeys.all });
      qc.invalidateQueries({ queryKey: childrenKeys.detail(vars.id) });
    },
  });
}

export function useChildArchive() {
  const qc = useQueryClient();
  return useMutation<Child, ApiError, string>({
    mutationFn: (id) => archiveChild(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childrenKeys.all });
    },
  });
}

export function useGrowthRecordAdd(childId: string | undefined | null) {
  const qc = useQueryClient();
  return useMutation<GrowthRecord, ApiError, CreateGrowthRecordInput>({
    mutationFn: (dto) => addGrowthRecord(childId as string, dto),
    onSuccess: () => {
      if (childId) qc.invalidateQueries({ queryKey: childrenKeys.records(childId) });
    },
  });
}

export function useMilestoneAdd(childId: string | undefined | null) {
  const qc = useQueryClient();
  return useMutation<CompletedMilestone, ApiError, CreateCompletedMilestoneInput>({
    mutationFn: (dto) => addMilestone(childId as string, dto),
    onSuccess: () => {
      if (childId) qc.invalidateQueries({ queryKey: childrenKeys.records(childId) });
    },
  });
}

export function useCompletedVaccinationAdd(childId: string | undefined | null) {
  const qc = useQueryClient();
  return useMutation<CompletedVaccination, ApiError, CreateCompletedVaccinationInput>({
    mutationFn: (dto) => addCompletedVaccination(childId as string, dto),
    onSuccess: () => {
      if (childId) qc.invalidateQueries({ queryKey: childrenKeys.records(childId) });
    },
  });
}

export function usePublicPracticesList() {
  return useQuery<Practice[], ApiError>({
    queryKey: practiceKeys.publicList(),
    queryFn: () => getPublicPractices(),
  });
}

export function usePracticeDetail(id: string | undefined | null) {
  return useQuery<Practice, ApiError>({
    queryKey: practiceKeys.detail(id ?? ""),
    queryFn: () => getPracticeById(id as string),
    enabled: !!id,
  });
}

export function useUserUpdate() {
  const qc = useQueryClient();
  return useMutation<User, ApiError, { id: string; patch: UpdateUserInput }>({
    mutationFn: ({ id, patch }) => updateUser(id, patch),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: userKeys.all });
      qc.invalidateQueries({ queryKey: userKeys.detail(vars.id) });
    },
  });
}
