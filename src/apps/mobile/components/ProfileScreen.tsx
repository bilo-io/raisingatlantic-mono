import React from "react";
import { useAuth } from "../auth/useAuth";
import { ProfileScreenAdmin } from "./profile/ProfileScreenAdmin";
import { ProfileScreenClinician } from "./profile/ProfileScreenClinician";
import { ProfileScreenParent } from "./profile/ProfileScreenParent";

export function ProfileScreen() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "clinician") return <ProfileScreenClinician />;
  if (user.role === "admin") return <ProfileScreenAdmin />;
  return <ProfileScreenParent />;
}
