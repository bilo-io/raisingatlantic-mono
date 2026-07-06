import {
  boysWeightForAge,
  girlsWeightForAge,
  boysHeightForAge,
  girlsHeightForAge,
  growthCurve,
  type GrowthCurvePoint,
} from "./growth-charts";

describe("growthCurve selector", () => {
  it("returns the sex-specific weight-for-age dataset", () => {
    expect(growthCurve("male", "weight-for-age")).toBe(boysWeightForAge);
    expect(growthCurve("female", "weight-for-age")).toBe(girlsWeightForAge);
  });

  it("returns the sex-specific height-for-age dataset", () => {
    expect(growthCurve("male", "height-for-age")).toBe(boysHeightForAge);
    expect(growthCurve("female", "height-for-age")).toBe(girlsHeightForAge);
  });

  it("KNOWN LIMITATION: weight-for-height has no dataset and falls back to weight-for-age", () => {
    // Documenting current behaviour, NOT asserting it is clinically correct.
    // Flagged for clinical review — no weight-for-height reference band exists yet.
    expect(growthCurve("male", "weight-for-height")).toBe(boysWeightForAge);
    expect(growthCurve("female", "weight-for-height")).toBe(girlsWeightForAge);
  });
});

describe.each([
  ["boysWeightForAge", boysWeightForAge],
  ["girlsWeightForAge", girlsWeightForAge],
  ["boysHeightForAge", boysHeightForAge],
  ["girlsHeightForAge", girlsHeightForAge],
])("%s reference band", (_name, dataset: GrowthCurvePoint[]) => {
  it("covers ages 0–60 months sequentially", () => {
    expect(dataset).toHaveLength(61);
    dataset.forEach((point, index) => expect(point.age).toBe(index));
  });

  it("keeps the SD lines strictly ordered at every age", () => {
    for (const p of dataset) {
      expect(p.line_minus_3).toBeLessThan(p.line_minus_2);
      expect(p.line_minus_2).toBeLessThan(p.line_0);
      expect(p.line_0).toBeLessThan(p.line_plus_2);
      expect(p.line_plus_2).toBeLessThan(p.line_plus_3);
    }
  });

  it("has positive measurements on every line", () => {
    for (const p of dataset) {
      for (const value of [p.line_minus_3, p.line_minus_2, p.line_0, p.line_plus_2, p.line_plus_3]) {
        expect(value).toBeGreaterThan(0);
      }
    }
  });
});
