import type { SystemLog, SystemLogLevel } from "@raising-atlantic/types";
import { api } from "../client";
import { useApi } from "../data-source";
import { activityFixture } from "../fixtures/activity";

export type ActivityFilters = {
  level?: SystemLogLevel;
  type?: string;
};

export async function getActivity(filters?: ActivityFilters): Promise<SystemLog[]> {
  if (useApi()) {
    const res = await api.get<SystemLog[]>("/system-logs", { params: filters });
    return res.data;
  }
  let list = activityFixture;
  if (filters?.level) list = list.filter((l) => l.level === filters.level);
  if (filters?.type) list = list.filter((l) => l.type === filters.type);
  return list;
}
