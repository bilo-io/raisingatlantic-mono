import { Stethoscope } from "lucide-react-native";
import React from "react";
import { ComingSoon } from "../../../components/ComingSoon";

export default function PatientsScreen() {
  return (
    <ComingSoon
      title="Patients"
      Icon={Stethoscope}
      blurb="Your assigned patient list."
    />
  );
}
