
export type Vaccination = {
  id: string;
  name: string;
  recommendedAge: string;
  doseInfo: string;
};

export const standardVaccinationSchedule: Vaccination[] = [
  { id: 'hepB1', name: "Hepatitis B (HepB)", recommendedAge: "Birth", doseInfo: "1st dose" },
  { id: 'hepB2', name: "Hepatitis B (HepB)", recommendedAge: "1-2 Months", doseInfo: "2nd dose" },
  { id: 'rv1', name: "Rotavirus (RV)", recommendedAge: "2 Months", doseInfo: "1st dose" },
  { id: 'dtap1', name: "DTaP", recommendedAge: "2 Months", doseInfo: "1st dose" },
  { id: 'hib1', name: "Hib", recommendedAge: "2 Months", doseInfo: "1st dose" },
  { id: 'pcv1', name: "PCV13", recommendedAge: "2 Months", doseInfo: "1st dose" },
  { id: 'polio1', name: "IPV (Polio)", recommendedAge: "2 Months", doseInfo: "2nd dose" },
  { id: 'rv2', name: "Rotavirus (RV)", recommendedAge: "4 Months", doseInfo: "2nd dose" },
  { id: 'dtap2', name: "DTaP", recommendedAge: "4 Months", doseInfo: "2nd dose" },
  { id: 'hib2', name: "Hib", recommendedAge: "4 Months", doseInfo: "2nd dose" },
  { id: 'pcv2', name: "PCV13", recommendedAge: "4 Months", doseInfo: "2nd dose" },
  { id: 'polio2', name: "IPV (Polio)", recommendedAge: "4 Months", doseInfo: "2nd dose" },
  { id: 'hepB3', name: "Hepatitis B (HepB)", recommendedAge: "6-18 Months", doseInfo: "3rd dose" },
  { id: 'dtap3', name: "DTaP", recommendedAge: "6 Months", doseInfo: "3rd dose" },
  { id: 'hib3', name: "Hib", recommendedAge: "6 Months", doseInfo: "3rd dose (if needed)" },
  { id: 'pcv3', name: "PCV13", recommendedAge: "6 Months", doseInfo: "3rd dose" },
  { id: 'polio3', name: "IPV (Polio)", recommendedAge: "6-18 Months", doseInfo: "3rd dose" },
  { id: 'flu', name: "Influenza (Flu)", recommendedAge: "Annually starting at 6 Months", doseInfo: "Yearly" },
  { id: 'mmr1', name: "MMR", recommendedAge: "12-15 Months", doseInfo: "1st dose" },
  { id: 'varicella1', name: "Varicella (Chickenpox)", recommendedAge: "12-15 Months", doseInfo: "1st dose" },
  { id: 'hepA1', name: "Hepatitis A (HepA)", recommendedAge: "12-23 Months", doseInfo: "1st dose (2-dose series)" },
  { id: 'dtap4', name: "DTaP", recommendedAge: "15-18 Months", doseInfo: "4th dose" },
  { id: 'hib4', name: "Hib", recommendedAge: "12-15 Months", doseInfo: "Booster" },
  { id: 'pcv4', name: "PCV13", recommendedAge: "12-15 Months", doseInfo: "4th dose" },
];
