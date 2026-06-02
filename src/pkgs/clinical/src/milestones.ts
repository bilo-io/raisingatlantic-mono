import type { MilestoneAgeGroup } from "@raising-atlantic/types";

export const milestonesByAge: MilestoneAgeGroup[] = [
  {
    age: "2 months",
    milestones: [
      { id: "ms-2m-social", category: "Social/Emotional", description: "Begins to smile at people" },
      { id: "ms-2m-language", category: "Language/Communication", description: "Coos, makes gurgling sounds" },
      { id: "ms-2m-cognitive", category: "Cognitive", description: "Pays attention to faces" },
      { id: "ms-2m-movement", category: "Movement/Physical", description: "Can hold head up and begins to push up when lying on tummy" },
    ],
  },
  {
    age: "4 months",
    milestones: [
      { id: "ms-4m-social", category: "Social/Emotional", description: "Smiles spontaneously, especially at people" },
      { id: "ms-4m-language", category: "Language/Communication", description: "Begins to babble" },
      { id: "ms-4m-cognitive", category: "Cognitive", description: "Reaches for toy with one hand" },
      { id: "ms-4m-movement", category: "Movement/Physical", description: "Holds head steady, unsupported" },
    ],
  },
  {
    age: "6 months",
    milestones: [
      { id: "ms-6m-social", category: "Social/Emotional", description: "Knows familiar faces and begins to know if someone is a stranger" },
      { id: "ms-6m-language", category: "Language/Communication", description: "Responds to sounds by making sounds" },
      { id: "ms-6m-cognitive", category: "Cognitive", description: "Looks around at things nearby" },
      { id: "ms-6m-movement", category: "Movement/Physical", description: "Rolls over in both directions" },
    ],
  },
  {
    age: "9 months",
    milestones: [
      { id: "ms-9m-social", category: "Social/Emotional", description: "May be afraid of strangers" },
      { id: "ms-9m-language", category: "Language/Communication", description: "Understands 'no'" },
      { id: "ms-9m-cognitive", category: "Cognitive", description: "Watches the path of something as it falls" },
      { id: "ms-9m-movement", category: "Movement/Physical", description: "Stands, holding on" },
    ],
  },
  {
    age: "1 year",
    milestones: [
      { id: "ms-12m-social", category: "Social/Emotional", description: "Is shy or nervous with strangers" },
      { id: "ms-12m-language", category: "Language/Communication", description: "Responds to simple spoken requests" },
      { id: "ms-12m-cognitive", category: "Cognitive", description: "Explores things in different ways, like shaking, banging, throwing" },
      { id: "ms-12m-movement", category: "Movement/Physical", description: "Gets to a sitting position without help" },
    ],
  },
  {
    age: "18 months",
    milestones: [
      { id: "ms-18m-social", category: "Social/Emotional", description: "Likes to hand things to others as play" },
      { id: "ms-18m-language", category: "Language/Communication", description: "Says several single words" },
      { id: "ms-18m-cognitive", category: "Cognitive", description: "Knows what ordinary things are for, e.g., telephone, brush, spoon" },
      { id: "ms-18m-movement", category: "Movement/Physical", description: "Walks alone" },
    ],
  },
];
