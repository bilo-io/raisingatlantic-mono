import { CalendarDays } from "lucide-react-native";
import React from "react";
import { ComingSoon } from "../../../components/ComingSoon";

export default function ScheduleScreen() {
  return (
    <ComingSoon
      title="Schedule"
      Icon={CalendarDays}
      blurb="Your appointments for today and the week ahead."
    />
  );
}
