import { Users } from "lucide-react-native";
import React from "react";
import { ComingSoon } from "../../../components/ComingSoon";

export default function UsersScreen() {
  return (
    <ComingSoon
      title="Users"
      Icon={Users}
      blurb="Manage all platform users."
    />
  );
}
