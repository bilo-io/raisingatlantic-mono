import { Patient } from '../types/models';
import { ResourceStatus } from '../types/enums';

export const dummyPatients: Patient[] = [
  { 
    id: '1', 
    name: 'Alex Doe', 
    dateOfBirth: '2024-02-15', 
    imageUrl: '', 
    status: ResourceStatus.ACTIVE, 
    primaryConcern: 'Feeding difficulties', 
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-08-20T10:00:00Z'
  },
  { 
    id: '2', 
    name: 'Mia Doe', 
    dateOfBirth: '2023-02-22', 
    imageUrl: '', 
    status: ResourceStatus.ACTIVE, 
    primaryConcern: 'Delayed speech', 
    createdAt: '2023-02-22T10:00:00Z',
    updatedAt: '2024-08-18T10:00:00Z'
  },
  { 
    id: '8', 
    name: 'Noah Doe', 
    dateOfBirth: '2020-08-25', 
    imageUrl: '', 
    status: ResourceStatus.ACTIVE, 
    primaryConcern: 'Speech clarity', 
    createdAt: '2020-08-25T10:00:00Z',
    updatedAt: '2024-08-26T10:00:00Z'
  },
  { 
    id: '6', 
    name: 'Leo Da Silva', 
    dateOfBirth: '2022-02-20', 
    imageUrl: '', 
    status: ResourceStatus.ACTIVE, 
    primaryConcern: 'Gross Motor Skills', 
    createdAt: '2022-02-20T10:00:00Z',
    updatedAt: '2024-08-25T10:00:00Z'
  },
  { 
    id: '7', 
    name: 'Sofia Da Silva', 
    dateOfBirth: '2018-04-12', 
    imageUrl: '', 
    status: ResourceStatus.ACTIVE, 
    primaryConcern: 'Reading Readiness', 
    createdAt: '2018-04-12T10:00:00Z',
    updatedAt: '2024-07-29T10:00:00Z'
  },
];