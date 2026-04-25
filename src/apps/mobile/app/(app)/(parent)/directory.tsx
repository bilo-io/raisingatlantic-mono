import { Compass } from "lucide-react-native";
import React from "react";
import { ComingSoon } from "../../../components/ComingSoon";

export default function DirectoryScreen() {
  return (
    <ComingSoon
      title="Directory"
      Icon={Compass}
      blurb="Find practices and clinicians."
    />
  );
}
