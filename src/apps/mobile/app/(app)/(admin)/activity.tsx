import { Activity } from "lucide-react-native";
import React from "react";
import { ComingSoon } from "../../../components/ComingSoon";

export default function ActivityScreen() {
  return (
    <ComingSoon
      title="Activity"
      Icon={Activity}
      blurb="Recent platform events and audit history."
    />
  );
}
