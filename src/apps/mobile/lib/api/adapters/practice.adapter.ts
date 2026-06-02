import type { Practice } from "@raising-atlantic/types";
import { api } from "../client";
import { useApi } from "../data-source";
import { practicesFixture } from "../fixtures/practices";

export async function getPractices(): Promise<Practice[]> {
  if (useApi()) {
    const res = await api.get<Practice[]>("/practices");
    return res.data;
  }
  return practicesFixture;
}

export async function getPublicPractices(): Promise<Practice[]> {
  if (useApi()) {
    const res = await api.get<Practice[]>("/practices/public");
    return res.data;
  }
  return practicesFixture;
}

export async function getPracticeById(id: string): Promise<Practice> {
  if (useApi()) {
    const res = await api.get<Practice>(`/practices/${id}`);
    return res.data;
  }
  const match = practicesFixture.find((p) => p.id === id);
  if (!match) throw new Error(`Practice ${id} not found`);
  return match;
}
