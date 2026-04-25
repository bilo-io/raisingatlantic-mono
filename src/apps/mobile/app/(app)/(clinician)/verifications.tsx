import { ShieldCheck } from "lucide-react-native";
import React from "react";
import { ComingSoon } from "../../../components/ComingSoon";

export default function ClinicianVerificationsScreen() {
  return (
    <ComingSoon
      title="Verifications"
      Icon={ShieldCheck}
      blurb="Pending clinician and record verifications."
    />
  );
}
