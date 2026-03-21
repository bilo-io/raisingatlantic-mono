

export type Patient = {
  id: string;
  name: string;
  age: string;
  avatar: string;
  lastUpdate: string;
  status: 'Active' | 'Inactive' | 'Discharged' | 'Pending Assessment';
  primaryConcern?: string;
  aiHint: string;
};

export const dummyPatients: Patient[] = [
  { id: '1', name: 'Alex Doe', age: '6 Months', avatar: '', lastUpdate: '2024-08-20', status: 'Active', primaryConcern: 'Feeding difficulties', aiHint: 'baby happy' },
  { id: '2', name: 'Mia Doe', age: '18 Months', avatar: '', lastUpdate: '2024-08-18', status: 'Active', primaryConcern: 'Delayed speech', aiHint: 'toddler playing' },
  { id: '8', name: 'Noah Doe', age: '4 Years', avatar: '', lastUpdate: '2024-08-26', status: 'Active', primaryConcern: 'Speech clarity', aiHint: 'boy building blocks' },
  { id: '6', name: 'Leo Da Silva', age: '2.5 Years', avatar: '', lastUpdate: '2024-08-25', status: 'Active', primaryConcern: 'Gross Motor Skills', aiHint: 'toddler boy playing'},
  { id: '7', name: 'Sofia Da Silva', age: '6 Yrs', avatar: '', lastUpdate: '2024-07-29', status: 'Active', primaryConcern: 'Reading Readiness', aiHint: 'girl reading book'},
];

    