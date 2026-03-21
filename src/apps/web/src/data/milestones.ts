
export type Milestone = {
    id: string;
    category: 'Social/Emotional' | 'Language/Communication' | 'Cognitive' | 'Movement/Physical';
    description: string;
};

export type MilestoneAgeGroup = {
    age: string;
    milestones: Milestone[];
};

export const standardMilestonesByAge: MilestoneAgeGroup[] = [
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
