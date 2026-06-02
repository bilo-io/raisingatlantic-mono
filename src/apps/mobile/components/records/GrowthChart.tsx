import type { GrowthRecord } from "@raising-atlantic/types";
import { growthCurve, type ChildSex, type GrowthMetric } from "@raising-atlantic/clinical";
import React from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";
import { useTheme } from "../../theme/useTheme";
import { Text } from "../ui";

type Props = {
  records: GrowthRecord[];
  dateOfBirth: string;
  sex: ChildSex;
  metric?: GrowthMetric;
};

const CHART_W = 320;
const CHART_H = 220;
const PAD_LEFT = 32;
const PAD_RIGHT = 8;
const PAD_TOP = 8;
const PAD_BOTTOM = 28;

function monthsBetween(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

export function GrowthChart({ records, dateOfBirth, sex, metric = "weight-for-age" }: Props) {
  const { tokens } = useTheme();
  const curve = growthCurve(sex, metric);
  if (curve.length === 0) return null;

  const xMin = curve[0].age;
  const xMax = curve[curve.length - 1].age;
  let yMin = curve[0].line_minus_3;
  let yMax = curve[curve.length - 1].line_plus_3;

  const points = records
    .map((r) => ({
      x: monthsBetween(dateOfBirth, r.date),
      y: metric === "weight-for-age" ? parseFloat(r.weight ?? "0") : parseFloat(r.height ?? "0"),
    }))
    .filter((p) => p.y > 0);

  for (const p of points) {
    if (p.y < yMin) yMin = p.y;
    if (p.y > yMax) yMax = p.y;
  }

  const plotW = CHART_W - PAD_LEFT - PAD_RIGHT;
  const plotH = CHART_H - PAD_TOP - PAD_BOTTOM;

  const sx = (x: number) => PAD_LEFT + ((x - xMin) / Math.max(1, xMax - xMin)) * plotW;
  const sy = (y: number) => PAD_TOP + plotH - ((y - yMin) / Math.max(0.001, yMax - yMin)) * plotH;

  const toPolyline = (key: keyof typeof curve[0]) =>
    curve.map((c) => `${sx(c.age)},${sy(c[key] as number)}`).join(" ");

  return (
    <View style={{ marginTop: 8 }}>
      <Text variant="bodyStrong" style={{ marginBottom: 2 }}>
        {metric === "weight-for-age" ? "Weight-for-age (kg)" : "Height-for-age (cm)"}
      </Text>
      <Text variant="muted" style={{ marginBottom: 8 }}>
        WHO reference curves · −3, −2, 0, +2, +3 SD
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: tokens.border,
          borderRadius: 12,
          padding: 8,
          backgroundColor: tokens.card,
        }}
      >
        <Svg width={CHART_W} height={CHART_H}>
          <Line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={PAD_TOP + plotH} stroke={tokens.border} strokeWidth={1} />
          <Line
            x1={PAD_LEFT}
            y1={PAD_TOP + plotH}
            x2={PAD_LEFT + plotW}
            y2={PAD_TOP + plotH}
            stroke={tokens.border}
            strokeWidth={1}
          />
          <Polyline points={toPolyline("line_minus_3")} stroke={tokens.destructive} strokeWidth={1} strokeDasharray="4 4" fill="none" />
          <Polyline points={toPolyline("line_minus_2")} stroke={tokens.mutedForeground} strokeWidth={1} strokeDasharray="2 3" fill="none" />
          <Polyline points={toPolyline("line_0")} stroke={tokens.primary} strokeWidth={2} fill="none" />
          <Polyline points={toPolyline("line_plus_2")} stroke={tokens.mutedForeground} strokeWidth={1} strokeDasharray="2 3" fill="none" />
          <Polyline points={toPolyline("line_plus_3")} stroke={tokens.destructive} strokeWidth={1} strokeDasharray="4 4" fill="none" />
          {points.map((p, idx) => (
            <Circle key={idx} cx={sx(p.x)} cy={sy(p.y)} r={4} fill={tokens.primary} />
          ))}
        </Svg>
      </View>
    </View>
  );
}
