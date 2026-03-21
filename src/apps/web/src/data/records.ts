

export type RecordType = 'Growth' | 'Milestone' | 'Vaccination';

export type GrowthData = {
  height?: string;
  weight?: string;
  headCircumference?: string;
  notes?: string;
}

export type ChildRecord = {
  id: string;
  childId: string; 
  childName: string;
  childAvatar: string;
  childAiHint: string;
  type: RecordType;
  date: string;
  details: string | GrowthData;
  recordedBy: string; 
};

// Expanded dummy records for different children and types
export const dummyRecords: ChildRecord[] = [
  // Alex Doe's Records (Child ID 1, 6 Months)
  { id: 'rec1', childId: '1', childName: 'Alex Doe', childAvatar: '', childAiHint: 'baby happy', type: 'Growth', date: '2024-08-15', details: { height: '68cm', weight: '7.8kg', notes: '6-month check-up.' }, recordedBy: 'Dr. Smith' },
  { id: 'rec2', childId: '1', childName: 'Alex Doe', childAvatar: '', childAiHint: 'baby happy', type: 'Milestone', date: '2024-07-20', details: 'Rolls over from tummy to back.', recordedBy: 'Parent' },
  { id: 'rec3', childId: '1', childName: 'Alex Doe', childAvatar: '', childAiHint: 'baby happy', type: 'Vaccination', date: '2024-08-15', details: 'DTaP Dose 3. Full 6-month course administered.', recordedBy: 'Nurse Emily' },

  // Mia Doe's Records (Child ID 2, 18 Months)
  { id: 'rec4', childId: '2', childName: 'Mia Doe', childAvatar: '', childAiHint: 'toddler playing', type: 'Growth', date: '2024-08-22', details: { height: '82cm', weight: '11kg', notes: '18-month check-up.' }, recordedBy: 'Dr. Emily' },
  { id: 'rec5', childId: '2', childName: 'Mia Doe', childAvatar: '', childAiHint: 'toddler playing', type: 'Milestone', date: '2024-05-15', details: 'Started walking independently.', recordedBy: 'Parent' },
  { id: 'rec6', childId: '2', childName: 'Mia Doe', childAvatar: '', childAiHint: 'toddler playing', type: 'Vaccination', date: '2024-08-22', details: 'DTaP Booster. Well tolerated.', recordedBy: 'Dr. Emily' },

  // Leo Da Silva's Records (Child ID 6, 2.5 Years)
  { id: 'rec15', childId: '6', childName: 'Leo Da Silva', childAvatar: '', childAiHint: 'toddler boy playing', type: 'Growth', date: '2024-08-20', details: { height: '94.5cm', weight: '14.2kg', notes: '30-month check-up.' }, recordedBy: 'Dr. Smith' },
  { id: 'rec16', childId: '6', childName: 'Leo Da Silva', childAvatar: '', childAiHint: 'toddler boy playing', type: 'Milestone', date: '2024-07-22', details: 'Follows instructions with 2 or 3 steps.', recordedBy: 'Parent' },
  { id: 'rec19', childId: '6', childName: 'Leo Da Silva', childAvatar: '', childAiHint: 'toddler boy playing', type: 'Vaccination', date: '2023-08-20', details: 'DTaP (4th dose)', recordedBy: 'Nurse Emily' },

  // Sofia Da Silva's Records (Child ID 7)
  { id: 'rec17', childId: '7', childName: 'Sofia Da Silva', childAvatar: '', childAiHint: 'girl reading book', type: 'Vaccination', date: '2024-04-15', details: 'DTaP Booster. Well tolerated.', recordedBy: 'Nurse Emily' },
  { id: 'rec18', childId: '7', childName: 'Sofia Da Silva', childAvatar: '', childAiHint: 'girl reading book', type: 'Milestone', date: '2024-06-01', details: 'Can write her own name clearly.', recordedBy: 'Parent' },
];
