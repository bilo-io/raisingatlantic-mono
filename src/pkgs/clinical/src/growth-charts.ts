export type GrowthCurvePoint = {
  age: number;
  line_minus_3: number;
  line_minus_2: number;
  line_0: number;
  line_plus_2: number;
  line_plus_3: number;
};

export type GrowthMetric = "weight-for-age" | "height-for-age" | "weight-for-height";
export type ChildSex = "male" | "female";

const sample = (start: number, end: number, fn: (m: number) => GrowthCurvePoint): GrowthCurvePoint[] => {
  const out: GrowthCurvePoint[] = [];
  for (let m = start; m <= end; m++) out.push(fn(m));
  return out;
};

export const boysWeightForAge: GrowthCurvePoint[] = sample(0, 60, (m) => ({
  age: m,
  line_minus_3: +(2.1 + m * 0.18).toFixed(2),
  line_minus_2: +(2.5 + m * 0.2).toFixed(2),
  line_0: +(3.3 + m * 0.24).toFixed(2),
  line_plus_2: +(4.2 + m * 0.28).toFixed(2),
  line_plus_3: +(4.8 + m * 0.31).toFixed(2),
}));

export const girlsWeightForAge: GrowthCurvePoint[] = sample(0, 60, (m) => ({
  age: m,
  line_minus_3: +(2.0 + m * 0.17).toFixed(2),
  line_minus_2: +(2.4 + m * 0.19).toFixed(2),
  line_0: +(3.2 + m * 0.23).toFixed(2),
  line_plus_2: +(4.2 + m * 0.27).toFixed(2),
  line_plus_3: +(4.8 + m * 0.3).toFixed(2),
}));

export const boysHeightForAge: GrowthCurvePoint[] = sample(0, 60, (m) => ({
  age: m,
  line_minus_3: +(46 + m * 1.1).toFixed(1),
  line_minus_2: +(48 + m * 1.15).toFixed(1),
  line_0: +(50 + m * 1.25).toFixed(1),
  line_plus_2: +(52 + m * 1.35).toFixed(1),
  line_plus_3: +(54 + m * 1.4).toFixed(1),
}));

export const girlsHeightForAge: GrowthCurvePoint[] = sample(0, 60, (m) => ({
  age: m,
  line_minus_3: +(45 + m * 1.08).toFixed(1),
  line_minus_2: +(47 + m * 1.13).toFixed(1),
  line_0: +(49 + m * 1.22).toFixed(1),
  line_plus_2: +(51 + m * 1.32).toFixed(1),
  line_plus_3: +(53 + m * 1.37).toFixed(1),
}));

export function growthCurve(sex: ChildSex, metric: GrowthMetric): GrowthCurvePoint[] {
  if (metric === "weight-for-age") return sex === "male" ? boysWeightForAge : girlsWeightForAge;
  if (metric === "height-for-age") return sex === "male" ? boysHeightForAge : girlsHeightForAge;
  return sex === "male" ? boysWeightForAge : girlsWeightForAge;
}
