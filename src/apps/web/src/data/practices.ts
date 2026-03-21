
export type Practice = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string; // Or province, using 'WC' for Western Cape
  zip: string;
  phone: string;
  website?: string;
  status: 'Active' | 'Inactive' | 'Temporarily Closed';
  manager?: string; 
  aiHint?: string; 
  tenantId: string;
};

export const dummyPractices: Practice[] = [
  { 
    id: '1', 
    name: 'Atlantic Child Development', 
    address: 'Suite 101, The Point Mall, 76 Regent Rd', 
    city: 'Sea Point, Cape Town', 
    state: 'WC', 
    zip: '8005', 
    phone: '(021) 439-1234', 
    website: 'https://www.atlanticchild.com/',
    status: 'Active', 
    manager: 'Dr. Sarah Miller', 
    aiHint: 'modern pediatric clinic',
    tenantId: 'tenant-1'
  },
  { 
    id: '2', 
    name: 'Barnard Pediatric Specialists', 
    address: 'Christiaan Barnard Memorial Hospital, 1 Articulator St, Foreshore', 
    city: 'Cape Town', 
    state: 'WC', 
    zip: '8001', 
    phone: '(021) 480-5678', 
    status: 'Active', 
    manager: 'Prof. A. James', 
    aiHint: 'hospital pediatric ward',
    tenantId: 'tenant-1'
  },
  { 
    id: '3', 
    name: 'Table Mountain Childrens Clinic', 
    address: '15 Derry Street, Vredehoek', 
    city: 'Cape Town', 
    state: 'WC', 
    zip: '8001', 
    phone: '(021) 461-9876', 
    status: 'Active', 
    manager: 'Dr. Linda Khumalo', 
    aiHint: 'child friendly clinic',
    tenantId: 'tenant-2'
  },
  { 
    id: '4', 
    name: 'Southern Suburbs Kids Care', 
    address: '25 Main Road, Claremont', 
    city: 'Cape Town', 
    state: 'WC', 
    zip: '7708', 
    phone: '(021) 671-2345', 
    status: 'Active', 
    aiHint: 'suburban medical practice',
    tenantId: 'tenant-2'
  },
  { 
    id: '5', 
    name: 'Cape Flats Child Wellness', 
    address: '10 Wellness Ave, Mitchells Plain', 
    city: 'Cape Town', 
    state: 'WC', 
    zip: '7785', 
    phone: '(021) 391-8765', 
    status: 'Temporarily Closed', 
    manager: 'Ms. Fatima Adams', 
    aiHint: 'community health center',
    tenantId: 'tenant-3'
  },
  { 
    id: '6', 
    name: 'Winelands Pediatric Group', 
    address: '3 Fabriek Street, Paarl', 
    city: 'Paarl', // Near Cape Town
    state: 'WC', 
    zip: '7646', 
    phone: '(021) 872-3456', 
    status: 'Active', 
    aiHint: 'rural clinic building',
    tenantId: 'tenant-3'
  },
  { 
    id: '7', 
    name: 'Blouberg Coastal Kids', 
    address: '44 Marine Drive, Bloubergstrand', 
    city: 'Cape Town', 
    state: 'WC', 
    zip: '7441', 
    phone: '(021) 554-6789', 
    status: 'Inactive', 
    manager: 'Dr. Ben Peters', 
    aiHint: 'clinic sea view',
    tenantId: 'tenant-5' 
  },
  { 
    id: '8', 
    name: 'Helderberg Child Health', 
    address: 'Main Road, Somerset West', 
    city: 'Somerset West', // Near Cape Town
    state: 'WC', 
    zip: '7130', 
    phone: '(021) 851-9900', 
    status: 'Active', 
    aiHint: 'health practice building',
    tenantId: 'tenant-5'
  },
];
