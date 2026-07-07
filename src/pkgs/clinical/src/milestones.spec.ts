import { milestonesByAge } from "./milestones";

const VALID_CATEGORIES = [
  "Social/Emotional",
  "Language/Communication",
  "Cognitive",
  "Movement/Physical",
];

describe("milestonesByAge", () => {
  it("covers the expected age bands in order", () => {
    expect(milestonesByAge.map((g) => g.age)).toEqual([
      "2 months",
      "4 months",
      "6 months",
      "9 months",
      "1 year",
      "18 months",
    ]);
  });

  it("has a non-empty milestone list for every age band", () => {
    for (const group of milestonesByAge) {
      expect(group.milestones.length).toBeGreaterThan(0);
    }
  });

  it("uses globally unique milestone ids", () => {
    const ids = milestonesByAge.flatMap((g) => g.milestones.map((m) => m.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("assigns every milestone a known developmental category and a description", () => {
    for (const group of milestonesByAge) {
      for (const milestone of group.milestones) {
        expect(VALID_CATEGORIES).toContain(milestone.category);
        expect(milestone.description.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
