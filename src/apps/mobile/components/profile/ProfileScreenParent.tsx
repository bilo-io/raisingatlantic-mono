// TODO: M1.6 — replace this thin wrapper with parent-specific fields
// (display name, phone, preferred language, notification opt-in/out, POPIA DSAR trigger, account deletion request).
import React from "react";
import { ProfileScreenBase } from "./ProfileScreenBase";

export function ProfileScreenParent() {
  return <ProfileScreenBase />;
}
