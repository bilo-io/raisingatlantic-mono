import { Settings } from "lucide-react-native";
import React from "react";
import { ComingSoon } from "../../../components/ComingSoon";

export default function SystemScreen() {
  return (
    <ComingSoon
      title="System"
      Icon={Settings}
      blurb="Global configuration and platform settings."
    />
  );
}
