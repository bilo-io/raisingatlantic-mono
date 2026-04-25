import { ClipboardList } from "lucide-react-native";
import React from "react";
import { ComingSoon } from "../../../components/ComingSoon";

export default function ClinicianRecordsScreen() {
  return (
    <ComingSoon
      title="Records"
      Icon={ClipboardList}
      blurb="Growth, milestones and vaccinations."
    />
  );
}
