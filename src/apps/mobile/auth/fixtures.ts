import { Role, User } from "./types";

export const fixtureUsers: Record<Role, User> = {
  parent: {
    id: "parent-jane-doe",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "parent",
  },
  clinician: {
    id: "clinician-dr-smith",
    name: "Dr. John Smith",
    email: "dr.smith@clinician.com",
    role: "clinician",
  },
  admin: {
    id: "admin-user",
    name: "Admin User",
    email: "admin@raisingatlantic.com",
    role: "admin",
  },
};
