import { useQuery } from "@tanstack/react-query";
import { getActivity, type ActivityFilters } from "../adapters/activity.adapter";

export const activityKeys = {
  all: ["activity"] as const,
  list: (filters?: ActivityFilters) =>
    filters === undefined ? (["activity", "list"] as const) : (["activity", "list", filters] as const),
};

export function useActivity(filters?: ActivityFilters) {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: () => getActivity(filters),
  });
}
