import type { CreateUserInput, UpdateUserInput, User } from "@raising-atlantic/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../client";
import { createResourceHooks } from "../createResourceHooks";
import {
  getMe,
  getUserById,
  getUsers,
  type UserListParams,
} from "../adapters/user.adapter";

export const usersResource = createResourceHooks<User, void, CreateUserInput, UpdateUserInput>({
  resource: "users",
  baseUrl: "/users",
  client: api,
  copy: {
    create: { success: "User created" },
    update: { success: "User updated" },
    delete: { success: "User removed" },
  },
});

export const {
  keys: userKeys,
  useList: useUsersList,
  useGet: useUser,
  useCreate: useCreateUser,
  useUpdate: useUpdateUser,
  useDelete: useDeleteUser,
} = usersResource;

export function useUsers(params?: UserListParams) {
  return useQuery({
    queryKey: ["users", "list", params ?? null],
    queryFn: () => getUsers(params),
  });
}

export function useUserById(id: string | undefined | null) {
  return useQuery({
    queryKey: ["users", "detail", id ?? ""],
    queryFn: () => {
      if (!id) throw new Error("Missing user id");
      return getUserById(id);
    },
    enabled: !!id,
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: getMe,
  });
}
