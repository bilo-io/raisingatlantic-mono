export type Role = "parent" | "clinician" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
