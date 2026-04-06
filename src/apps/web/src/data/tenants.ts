import { BaseEntity } from '../types/models';
import { ResourceStatus } from '../types/enums';

export interface Tenant extends BaseEntity {
  name: string;
  website?: string;
  email: string;
  phone: string;
  logoUrl?: string;
  status: ResourceStatus;
}

export const dummyTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Raising Atlantic',
    website: 'https://raisingatlantic.com',
    email: 'contact@raisingatlantic.com',
    phone: '(021) 555-0100',
    logoUrl: '',
    status: ResourceStatus.ACTIVE,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'tenant-2',
    name: 'ACME',
    website: 'https://acme-health.com',
    email: 'info@acme-health.com',
    phone: '(021) 555-0200',
    logoUrl: '',
    status: ResourceStatus.ACTIVE,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'tenant-3',
    name: 'Mediclinic',
    website: 'https://mediclinic.co.za',
    email: 'admin@mediclinic.co.za',
    phone: '(021) 555-0300',
    logoUrl: '',
    status: ResourceStatus.ACTIVE,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'tenant-4',
    name: 'Disc-Chem',
    website: 'https://dischem.co.za',
    email: 'careline@dischem.co.za',
    phone: '(021) 555-0400',
    logoUrl: '',
    status: ResourceStatus.INACTIVE,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'tenant-5',
    name: 'Netcare',
    website: 'https://netcare.co.za',
    email: 'support@netcare.co.za',
    phone: '(021) 555-0500',
    logoUrl: '',
    status: ResourceStatus.ACTIVE,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
];
