import type { CreateUserInput, UpdateUserInput, User } from "@raising-atlantic/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../client";
import { createResourceHooks } from "../createResourceHooks";
import { getMe } from "../adapters/user.adapter";

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

export function useMe() {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: getMe,
  });
}
