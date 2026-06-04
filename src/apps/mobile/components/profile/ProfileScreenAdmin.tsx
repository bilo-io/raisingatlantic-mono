// TODO: M3.6 — replace this thin wrapper with admin-specific fields
// (tenant-admin vs super-admin scope, recent admin actions).
import React from "react";
import { ProfileScreenBase } from "./ProfileScreenBase";

export function ProfileScreenAdmin() {
  return <ProfileScreenBase />;
}
