import React from "react";
import { useAuth } from "../auth/useAuth";
import { DashboardHomeAdmin } from "./dashboard/DashboardHomeAdmin";
import { DashboardHomeClinician } from "./dashboard/DashboardHomeClinician";
import { DashboardHomeParent } from "./dashboard/DashboardHomeParent";

export function DashboardHome() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "clinician") return <DashboardHomeClinician />;
  if (user.role === "admin") return <DashboardHomeAdmin />;
  return <DashboardHomeParent />;
}
