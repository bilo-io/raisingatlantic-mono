import { ShieldCheck } from "lucide-react-native";
import React from "react";
import { ComingSoon } from "../../../components/ComingSoon";

export default function AdminVerificationsScreen() {
  return (
    <ComingSoon
      title="Verifications"
      Icon={ShieldCheck}
      blurb="Oversee pending verifications across the platform."
    />
  );
}
