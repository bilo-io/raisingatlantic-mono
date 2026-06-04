import type { Vaccination } from "@raising-atlantic/types";

export type EpiVaccine = Vaccination & {
  minMonths: number;
  maxMonths: number;
};

export const epiSchedule: EpiVaccine[] = [
  { id: "hepB1", name: "Hepatitis B (HepB)", recommendedAge: "Birth", doseInfo: "1st dose", track: "EPI", minMonths: 0, maxMonths: 1 },
  { id: "hepB2", name: "Hepatitis B (HepB)", recommendedAge: "1-2 Months", doseInfo: "2nd dose", track: "EPI", minMonths: 1, maxMonths: 2 },
  { id: "rv1", name: "Rotavirus (RV)", recommendedAge: "2 Months", doseInfo: "1st dose", track: "EPI", minMonths: 2, maxMonths: 3 },
  { id: "dtap1", name: "DTaP", recommendedAge: "2 Months", doseInfo: "1st dose", track: "EPI", minMonths: 2, maxMonths: 3 },
  { id: "hib1", name: "Hib", recommendedAge: "2 Months", doseInfo: "1st dose", track: "EPI", minMonths: 2, maxMonths: 3 },
  { id: "pcv1", name: "PCV13", recommendedAge: "2 Months", doseInfo: "1st dose", track: "EPI", minMonths: 2, maxMonths: 3 },
  { id: "polio1", name: "IPV (Polio)", recommendedAge: "2 Months", doseInfo: "2nd dose", track: "EPI", minMonths: 2, maxMonths: 3 },
  { id: "rv2", name: "Rotavirus (RV)", recommendedAge: "4 Months", doseInfo: "2nd dose", track: "EPI", minMonths: 4, maxMonths: 5 },
  { id: "dtap2", name: "DTaP", recommendedAge: "4 Months", doseInfo: "2nd dose", track: "EPI", minMonths: 4, maxMonths: 5 },
  { id: "hib2", name: "Hib", recommendedAge: "4 Months", doseInfo: "2nd dose", track: "EPI", minMonths: 4, maxMonths: 5 },
  { id: "pcv2", name: "PCV13", recommendedAge: "4 Months", doseInfo: "2nd dose", track: "EPI", minMonths: 4, maxMonths: 5 },
  { id: "polio2", name: "IPV (Polio)", recommendedAge: "4 Months", doseInfo: "2nd dose", track: "EPI", minMonths: 4, maxMonths: 5 },
  { id: "hepB3", name: "Hepatitis B (HepB)", recommendedAge: "6-18 Months", doseInfo: "3rd dose", track: "EPI", minMonths: 6, maxMonths: 18 },
  { id: "dtap3", name: "DTaP", recommendedAge: "6 Months", doseInfo: "3rd dose", track: "EPI", minMonths: 6, maxMonths: 7 },
  { id: "hib3", name: "Hib", recommendedAge: "6 Months", doseInfo: "3rd dose (if needed)", track: "EPI", minMonths: 6, maxMonths: 7 },
  { id: "pcv3", name: "PCV13", recommendedAge: "6 Months", doseInfo: "3rd dose", track: "EPI", minMonths: 6, maxMonths: 7 },
  { id: "polio3", name: "IPV (Polio)", recommendedAge: "6-18 Months", doseInfo: "3rd dose", track: "EPI", minMonths: 6, maxMonths: 18 },
  { id: "flu", name: "Influenza (Flu)", recommendedAge: "Annually starting at 6 Months", doseInfo: "Yearly", track: "PRIVATE", minMonths: 6, maxMonths: 216 },
  { id: "mmr1", name: "MMR", recommendedAge: "12-15 Months", doseInfo: "1st dose", track: "EPI", minMonths: 12, maxMonths: 15 },
  { id: "varicella1", name: "Varicella (Chickenpox)", recommendedAge: "12-15 Months", doseInfo: "1st dose", track: "PRIVATE", minMonths: 12, maxMonths: 15 },
  { id: "hepA1", name: "Hepatitis A (HepA)", recommendedAge: "12-23 Months", doseInfo: "1st dose (2-dose series)", track: "PRIVATE", minMonths: 12, maxMonths: 23 },
  { id: "dtap4", name: "DTaP", recommendedAge: "15-18 Months", doseInfo: "4th dose", track: "EPI", minMonths: 15, maxMonths: 18 },
  { id: "hib4", name: "Hib", recommendedAge: "12-15 Months", doseInfo: "Booster", track: "EPI", minMonths: 12, maxMonths: 15 },
  { id: "pcv4", name: "PCV13", recommendedAge: "12-15 Months", doseInfo: "4th dose", track: "EPI", minMonths: 12, maxMonths: 15 },
];

export const standardVaccinationSchedule: Vaccination[] = epiSchedule.map(({ minMonths: _min, maxMonths: _max, ...v }) => v);

export type VaccineBucket = "due" | "overdue" | "upcoming" | "complete";

export function ageInMonths(dateOfBirth: string, asOf: Date = new Date()): number {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;
  const months = (asOf.getFullYear() - dob.getFullYear()) * 12 + (asOf.getMonth() - dob.getMonth());
  return months < 0 ? 0 : months;
}

export function bucketVaccine(
  vaccine: EpiVaccine,
  dateOfBirth: string,
  completedIds: Set<string>,
  asOf: Date = new Date(),
): VaccineBucket {
  if (completedIds.has(vaccine.id)) return "complete";
  const months = ageInMonths(dateOfBirth, asOf);
  if (months > vaccine.maxMonths) return "overdue";
  if (months >= vaccine.minMonths) return "due";
  return "upcoming";
}
