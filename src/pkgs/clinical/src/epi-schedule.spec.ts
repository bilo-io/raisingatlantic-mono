import {
  ageInMonths,
  bucketVaccine,
  epiSchedule,
  standardVaccinationSchedule,
} from "./epi-schedule";

// Real schedule entries used as fixtures — do not invent age gates (CLAUDE.md: EPI logic is sacred).
const dtap1 = epiSchedule.find((v) => v.id === "dtap1")!; // minMonths 2, maxMonths 3
const hepB1 = epiSchedule.find((v) => v.id === "hepB1")!; // minMonths 0, maxMonths 1

// Mid-month, midday dates so a ±14h timezone shift can never cross a month boundary.
const at = (year: number, monthIndex: number) => new Date(year, monthIndex, 15, 12, 0, 0);
const dobNoon = "2024-01-15T12:00:00";

describe("ageInMonths", () => {
  it("counts whole calendar-month steps between DOB and asOf", () => {
    expect(ageInMonths(dobNoon, at(2024, 6))).toBe(6); // Jan → Jul
  });

  it("crosses year boundaries correctly", () => {
    expect(ageInMonths("2023-11-15T12:00:00", at(2024, 1))).toBe(3); // Nov → Feb
  });

  it("ignores day-of-month (same calendar month → 0)", () => {
    expect(ageInMonths("2024-06-20T12:00:00", at(2024, 5))).toBe(0);
  });

  it("returns 0 for an unparseable date string", () => {
    expect(ageInMonths("not-a-date", at(2024, 6))).toBe(0);
  });

  it("clamps a future date of birth to 0 (never negative)", () => {
    expect(ageInMonths("2025-01-15T12:00:00", at(2024, 5))).toBe(0);
  });

  it("uses the current date when asOf is omitted (default param)", () => {
    // A DOB well in the past must yield a positive age regardless of when the test runs.
    expect(ageInMonths("2000-01-15T12:00:00")).toBeGreaterThan(0);
  });
});

describe("bucketVaccine", () => {
  it("returns 'complete' when the vaccine id is in the completed set, regardless of age", () => {
    const completed = new Set<string>(["dtap1"]);
    // Age 0 would otherwise be 'upcoming' for dtap1 (min 2), but completion wins.
    expect(bucketVaccine(dtap1, "2024-01-20T12:00:00", completed, at(2024, 0))).toBe("complete");
  });

  it("returns 'upcoming' before the minimum age", () => {
    // age 1 month < minMonths 2
    expect(bucketVaccine(dtap1, dobNoon, new Set(), at(2024, 1))).toBe("upcoming");
  });

  it("returns 'due' at the lower age-gate boundary (months === minMonths)", () => {
    // age 2 === minMonths 2
    expect(bucketVaccine(dtap1, dobNoon, new Set(), at(2024, 2))).toBe("due");
  });

  it("returns 'due' at the upper age-gate boundary (months === maxMonths)", () => {
    // age 3 === maxMonths 3 (not yet overdue)
    expect(bucketVaccine(dtap1, dobNoon, new Set(), at(2024, 3))).toBe("due");
  });

  it("returns 'overdue' once past the maximum age", () => {
    // age 4 > maxMonths 3
    expect(bucketVaccine(dtap1, dobNoon, new Set(), at(2024, 4))).toBe("overdue");
  });

  it("treats a birth-dose (min 0) as 'due' at age 0 and 'overdue' past its window", () => {
    expect(bucketVaccine(hepB1, "2024-01-20T12:00:00", new Set(), at(2024, 0))).toBe("due"); // age 0, min 0
    expect(bucketVaccine(hepB1, dobNoon, new Set(), at(2024, 3))).toBe("overdue"); // age 3 > max 1
  });

  it("falls back to the current date when asOf is omitted (default param)", () => {
    // A 2000 DOB is decades past every age gate → overdue when not completed.
    expect(bucketVaccine(dtap1, "2000-01-15T12:00:00", new Set())).toBe("overdue");
  });
});

describe("epiSchedule data integrity", () => {
  it("has unique vaccine ids", () => {
    const ids = epiSchedule.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps minMonths <= maxMonths for every entry", () => {
    for (const v of epiSchedule) {
      expect(v.minMonths).toBeLessThanOrEqual(v.maxMonths);
    }
  });

  it("tags every entry with a known track", () => {
    for (const v of epiSchedule) {
      expect(["EPI", "PRIVATE"]).toContain(v.track);
    }
  });
});

describe("standardVaccinationSchedule", () => {
  it("mirrors the epiSchedule ids in order", () => {
    expect(standardVaccinationSchedule.map((v) => v.id)).toEqual(epiSchedule.map((v) => v.id));
  });

  it("strips the internal minMonths/maxMonths age-gate fields", () => {
    for (const v of standardVaccinationSchedule) {
      expect(v).not.toHaveProperty("minMonths");
      expect(v).not.toHaveProperty("maxMonths");
    }
  });
});
