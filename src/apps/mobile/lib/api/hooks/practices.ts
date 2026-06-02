import type {
  CreatePracticeInput,
  Practice,
  UpdatePracticeInput,
} from "@raising-atlantic/types";
import { api } from "../client";
import { createResourceHooks } from "../createResourceHooks";

export const practicesResource = createResourceHooks<
  Practice,
  void,
  CreatePracticeInput,
  UpdatePracticeInput
>({
  resource: "practices",
  baseUrl: "/practices",
  client: api,
  copy: {
    create: { success: "Practice created" },
    update: { success: "Practice updated" },
    delete: { success: "Practice removed" },
  },
});

export const {
  keys: practiceKeys,
  useList: usePractices,
  useGet: usePractice,
} = practicesResource;
