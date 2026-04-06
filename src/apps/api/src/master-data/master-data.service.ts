import { Injectable } from '@nestjs/common';

export interface Milestone {
  id: string;
  category: string;
  description: string;
}

export interface MilestoneAgeGroup {
  age: string;
  milestones: Milestone[];
}

export interface Vaccination {
  id: string;
  name: string;
  recommendedAge: string;
  doseInfo: string;
}

@Injectable()
export class MasterDataService {
  private readonly milestones: MilestoneAgeGroup[] = [
    {
      age: '2 Months',
      milestones: [
        { id: 'm_2mo_soc_1', category: 'Social/Emotional', description: 'Begins to smile at people' },
        { id: 'm_2mo_soc_2', category: 'Social/Emotional', description: 'Can briefly calm himself (may bring hands to mouth)' },
        { id: 'm_2mo_lan_1', category: 'Language/Communication', description: 'Coos, makes gurgling sounds' },
        { id: 'm_2mo_mot_1', category: 'Movement/Physical', description: 'Can hold head up and begins to push up when lying on tummy' },
      ],
    },
    {
      age: '4 Months',
      milestones: [
        { id: 'm_4mo_soc_1', category: 'Social/Emotional', description: 'Smiles spontaneously, especially at people' },
        { id: 'm_4mo_lan_1', category: 'Language/Communication', description: 'Babbles with expression and copies sounds he hears' },
        { id: 'm_4mo_cog_1', category: 'Cognitive', description: 'Lets you know if she is happy or sad' },
        { id: 'm_4mo_mot_1', category: 'Movement/Physical', description: 'Holds head steady, unsupported' },
      ],
    },
    {
      age: '6 Months',
      milestones: [
        { id: 'm_6mo_soc_1', category: 'Social/Emotional', description: 'Knows familiar faces and begins to know if someone is a stranger' },
        { id: 'm_6mo_lan_1', category: 'Language/Communication', description: 'Responds to sounds by making sounds' },
        { id: 'm_6mo_cog_1', category: 'Cognitive', description: 'Brings things to mouth' },
        { id: 'm_6mo_mot_1', category: 'Movement/Physical', description: 'Rolls over in both directions (front to back, back to front)' },
      ],
    },
    {
      age: '9 Months',
      milestones: [
        { id: 'm_9mo_soc_1', category: 'Social/Emotional', description: 'May be afraid of strangers' },
        { id: 'm_9mo_lan_1', category: 'Language/Communication', description: 'Understands "no"' },
        { id: 'm_9mo_cog_1', category: 'Cognitive', description: 'Plays peek-a-boo' },
        { id: 'm_9mo_mot_1', category: 'Movement/Physical', description: 'Pulls to stand, holding on' },
      ],
    },
    {
      age: '1 Year',
      milestones: [
        { id: 'm_1yr_soc_1', category: 'Social/Emotional', description: 'Is shy or nervous with strangers' },
        { id: 'm_1yr_lan_1', category: 'Language/Communication', description: 'Says "mama" and "dada" and exclamations like "uh-oh!"' },
        { id: 'm_1yr_cog_1', category: 'Cognitive', description: 'Copies gestures' },
        { id: 'm_1yr_mot_1', category: 'Movement/Physical', description: 'May take a few steps without holding on' },
      ],
    },
    {
      age: '18 Months',
      milestones: [
        { id: 'm_18mo_soc_1', category: 'Social/Emotional', description: 'May have temper tantrums' },
        { id: 'm_18mo_lan_1', category: 'Language/Communication', description: 'Says several single words' },
        { id: 'm_18mo_cog_1', category: 'Cognitive', description: 'Points to one body part' },
        { id: 'm_18mo_mot_1', category: 'Movement/Physical', description: 'Walks alone' },
      ],
    },
    {
      age: '2 Years',
      milestones: [
        { id: 'm_2yr_soc_1', category: 'Social/Emotional', description: 'Gets excited when with other children' },
        { id: 'm_2yr_lan_1', category: 'Language/Communication', description: 'Knows names of familiar people and body parts' },
        { id: 'm_2yr_cog_1', category: 'Cognitive', description: 'Begins to sort shapes and colors' },
        { id: 'm_2yr_mot_1', category: 'Movement/Physical', description: 'Kicks a ball' },
      ],
    },
    {
      age: '3 Years',
      milestones: [
        { id: 'm_3yr_soc_1', category: 'Social/Emotional', description: 'Shows a wide range of emotions' },
        { id: 'm_3yr_lan_1', category: 'Language/Communication', description: 'Follows instructions with 2 or 3 steps' },
        { id: 'm_3yr_cog_1', category: 'Cognitive', description: 'Can work toys with buttons, levers, and moving parts' },
        { id: 'm_3yr_mot_1', category: 'Movement/Physical', description: 'Climbs well' },
      ],
    },
    {
      age: '4 Years',
      milestones: [
        { id: 'm_4yr_soc_1', category: 'Social/Emotional', description: 'Would rather play with other children than by himself' },
        { id: 'm_4yr_lan_1', category: 'Language/Communication', description: 'Tells stories' },
        { id: 'm_4yr_cog_1', category: 'Cognitive', description: 'Names some colors and some numbers' },
        { id: 'm_4yr_mot_1', category: 'Movement/Physical', description: 'Hops and stands on one foot up to 2 seconds' },
      ],
    },
    {
      age: '5 Years',
      milestones: [
        { id: 'm_5yr_soc_1', category: 'Social/Emotional', description: 'Wants to be like friends' },
        { id: 'm_5yr_lan_1', category: 'Language/Communication', description: 'Speaks very clearly' },
        { id: 'm_5yr_cog_1', category: 'Cognitive', description: 'Counts 10 or more things' },
        { id: 'm_5yr_mot_1', category: 'Movement/Physical', description: 'Can do a somersault' },
      ],
    },
  ];

  private readonly vaccinations: Vaccination[] = [
    { id: 'hepB1', name: 'Hepatitis B (HepB)', recommendedAge: 'Birth', doseInfo: '1st dose' },
    { id: 'hepB2', name: 'Hepatitis B (HepB)', recommendedAge: '1-2 Months', doseInfo: '2nd dose' },
    { id: 'rv1', name: 'Rotavirus (RV)', recommendedAge: '2 Months', doseInfo: '1st dose' },
    { id: 'dtap1', name: 'DTaP', recommendedAge: '2 Months', doseInfo: '1st dose' },
    { id: 'hib1', name: 'Hib', recommendedAge: '2 Months', doseInfo: '1st dose' },
    { id: 'pcv1', name: 'PCV13', recommendedAge: '2 Months', doseInfo: '1st dose' },
    { id: 'polio1', name: 'IPV (Polio)', recommendedAge: '2 Months', doseInfo: '2nd dose' },
    { id: 'rv2', name: 'Rotavirus (RV)', recommendedAge: '4 Months', doseInfo: '2nd dose' },
    { id: 'dtap2', name: 'DTaP', recommendedAge: '4 Months', doseInfo: '2nd dose' },
    { id: 'hib2', name: 'Hib', recommendedAge: '4 Months', doseInfo: '2nd dose' },
    { id: 'pcv2', name: 'PCV13', recommendedAge: '4 Months', doseInfo: '2nd dose' },
    { id: 'polio2', name: 'IPV (Polio)', recommendedAge: '4 Months', doseInfo: '2nd dose' },
    { id: 'hepB3', name: 'Hepatitis B (HepB)', recommendedAge: '6-18 Months', doseInfo: '3rd dose' },
    { id: 'dtap3', name: 'DTaP', recommendedAge: '6 Months', doseInfo: '3rd dose' },
    { id: 'hib3', name: 'Hib', recommendedAge: '6 Months', doseInfo: '3rd dose (if needed)' },
    { id: 'pcv3', name: 'PCV13', recommendedAge: '6 Months', doseInfo: '3rd dose' },
    { id: 'polio3', name: 'IPV (Polio)', recommendedAge: '6-18 Months', doseInfo: '3rd dose' },
    { id: 'flu', name: 'Influenza (Flu)', recommendedAge: 'Annually starting at 6 Months', doseInfo: 'Yearly' },
    { id: 'mmr1', name: 'MMR', recommendedAge: '12-15 Months', doseInfo: '1st dose' },
    { id: 'varicella1', name: 'Varicella (Chickenpox)', recommendedAge: '12-15 Months', doseInfo: '1st dose' },
    { id: 'hepA1', name: 'Hepatitis A (HepA)', recommendedAge: '12-23 Months', doseInfo: '1st dose (2-dose series)' },
    { id: 'dtap4', name: 'DTaP', recommendedAge: '15-18 Months', doseInfo: '4th dose' },
    { id: 'hib4', name: 'Hib', recommendedAge: '12-15 Months', doseInfo: 'Booster' },
    { id: 'pcv4', name: 'PCV13', recommendedAge: '12-15 Months', doseInfo: '4th dose' },
  ];

  findAllMilestones(): MilestoneAgeGroup[] {
    return this.milestones;
  }

  findAllVaccinations(): Vaccination[] {
    return this.vaccinations;
  }
}
