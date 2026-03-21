
export type Tenant = {
  id: string;
  name: string;
  website?: string;
  email: string;
  phone: string;
  logoUrl?: string;
  aiHint?: string;
  status: 'Active' | 'Inactive';
};

export const dummyTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Raising Atlantic',
    website: 'https://raisingatlantic.com',
    email: 'contact@raisingatlantic.com',
    phone: '(021) 555-0100',
    logoUrl: '',
    aiHint: 'medical cross logo',
    status: 'Active',
  },
  {
    id: 'tenant-2',
    name: 'ACME',
    website: 'https://acme-health.com',
    email: 'info@acme-health.com',
    phone: '(021) 555-0200',
    logoUrl: '',
    aiHint: 'wave child logo',
    status: 'Active',
  },
  {
    id: 'tenant-3',
    name: 'Mediclinic',
    website: 'https://mediclinic.co.za',
    email: 'admin@mediclinic.co.za',
    phone: '(021) 555-0300',
    logoUrl: '',
    aiHint: 'grape leaf logo',
    status: 'Active',
  },
  {
    id: 'tenant-4',
    name: 'Disc-Chem',
    website: 'https://dischem.co.za',
    email: 'careline@dischem.co.za',
    phone: '(021) 555-0400',
    logoUrl: '',
    aiHint: 'skyline hands logo',
    status: 'Inactive',
  },
  {
    id: 'tenant-5',
    name: 'Netcare',
    website: 'https://netcare.co.za',
    email: 'support@netcare.co.za',
    phone: '(021) 555-0500',
    logoUrl: '',
    aiHint: 'mountain sunrise logo',
    status: 'Active',
  },
];
