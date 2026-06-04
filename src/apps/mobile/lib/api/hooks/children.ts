import type { Child, CreateChildInput, UpdateChildInput } from "@raising-atlantic/types";
import { api } from "../client";
import { createResourceHooks } from "../createResourceHooks";

export const childrenResource = createResourceHooks<Child, void, CreateChildInput, UpdateChildInput>({
  resource: "children",
  baseUrl: "/children",
  client: api,
  copy: {
    create: { success: "Child added" },
    update: { success: "Child updated" },
    delete: { success: "Child archived" },
  },
});

export const {
  keys: childKeys,
  useList: useChildren,
  useGet: useChild,
  useCreate: useCreateChild,
  useUpdate: useUpdateChild,
  useDelete: useArchiveChild,
} = childrenResource;
