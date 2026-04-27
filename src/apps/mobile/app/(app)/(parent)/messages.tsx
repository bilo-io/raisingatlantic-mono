import { MessageSquare } from "lucide-react-native";
import React from "react";
import { ComingSoon } from "../../../components/ComingSoon";

export default function MessagesScreen() {
  return (
    <ComingSoon
      title="Messages"
      Icon={MessageSquare}
      blurb="Direct conversations with your care team."
    />
  );
}
