import type { UpdateUserInput, User, UserRole } from "@raising-atlantic/types";
import { api } from "../client";
import { useApi } from "../data-source";
import { usersFixture } from "../fixtures/users";

export type UserListParams = {
  role?: UserRole;
  tenantId?: string;
};

export async function getUsers(params?: UserListParams): Promise<User[]> {
  if (useApi()) {
    const res = await api.get<User[]>("/users", { params });
    return res.data;
  }
  let list = usersFixture;
  if (params?.role) list = list.filter((u) => u.role === params.role);
  return list;
}

export async function getUserById(id: string): Promise<User> {
  if (useApi()) {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  }
  const match = usersFixture.find((u) => u.id === id);
  if (!match) throw new Error(`User ${id} not found`);
  return match;
}

export async function getMe(): Promise<User> {
  if (useApi()) {
    const res = await api.get<User>("/users/me");
    return res.data;
  }
  return usersFixture[0];
}

export async function updateUser(id: string, patch: UpdateUserInput): Promise<User> {
  if (useApi()) {
    const res = await api.patch<User>(`/users/${id}`, patch);
    return res.data;
  }
  const existing = await getUserById(id);
  return { ...existing, ...patch };
}
