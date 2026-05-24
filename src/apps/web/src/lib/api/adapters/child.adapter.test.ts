import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/data/children', () => ({
  childrenDetails: [
    { id: 'c-mock', name: 'Mock Child', completedVaccinations: [] },
  ],
}));

vi.mock('@/data/records', () => ({
  dummyRecords: [
    { id: 'r-1', childId: 'c-mock', type: 'Growth' },
    { id: 'r-2', childId: 'c-other', type: 'Growth' },
  ],
}));

import {
  getChildren,
  getChildById,
  getUnifiedRecords,
  createChild,
  updateChild,
  deleteChild,
  addCompletedVaccination,
} from './child.adapter';
import { apiClient } from '../api-client';

const ORIGINAL = process.env.NEXT_PUBLIC_USE_API;

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  process.env.NEXT_PUBLIC_USE_API = ORIGINAL;
});

describe('child.adapter (mock mode)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_USE_API = 'false';
  });

  it('getChildren returns mock data when API is off', async () => {
    const result = await getChildren();
    expect(result).toEqual([
      expect.objectContaining({ id: 'c-mock', name: 'Mock Child' }),
    ]);
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it('getChildById finds by id', async () => {
    await expect(getChildById('c-mock')).resolves.toMatchObject({ id: 'c-mock' });
  });

  it('getChildById throws when not found', async () => {
    await expect(getChildById('missing')).rejects.toThrow('Child not found');
  });

  it('getUnifiedRecords filters mock records by childId', async () => {
    const records = await getUnifiedRecords('c-mock');
    expect(records).toEqual([expect.objectContaining({ id: 'r-1' })]);
  });
});

describe('child.adapter (API mode)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_USE_API = 'true';
  });

  it('getChildren forwards filters as query params and unwraps parent/clinician ids', async () => {
    (apiClient.get as any).mockResolvedValue({
      data: [
        { id: 'c-1', parent: { id: 'p-1' }, clinician: { id: 'cl-1' } },
      ],
    });

    const result = await getChildren({ tenantId: 't-1', clinicianId: 'cl-1' });

    expect(apiClient.get).toHaveBeenCalledWith('/children?tenantId=t-1&clinicianId=cl-1');
    expect(result[0]).toMatchObject({ parentId: 'p-1', clinicianId: 'cl-1' });
  });

  it('getChildById flattens parent and clinician', async () => {
    (apiClient.get as any).mockResolvedValue({
      data: { id: 'c-1', parent: { id: 'p-1' }, clinician: { id: 'cl-1' } },
    });

    const result = await getChildById('c-1');
    expect(result).toMatchObject({ id: 'c-1', parentId: 'p-1', clinicianId: 'cl-1' });
  });

  it('getUnifiedRecords hits /:id/records', async () => {
    (apiClient.get as any).mockResolvedValue({ data: [{ id: 'r-1' }] });
    await getUnifiedRecords('c-1');
    expect(apiClient.get).toHaveBeenCalledWith('/children/c-1/records');
  });

  it('createChild posts to /children', async () => {
    (apiClient.post as any).mockResolvedValue({ data: { id: 'c-99' } });
    await createChild({ name: 'New' });
    expect(apiClient.post).toHaveBeenCalledWith('/children', { name: 'New' });
  });

  it('updateChild patches the id', async () => {
    (apiClient.patch as any).mockResolvedValue({ data: { id: 'c-1', name: 'Renamed' } });
    await updateChild('c-1', { name: 'Renamed' });
    expect(apiClient.patch).toHaveBeenCalledWith('/children/c-1', { name: 'Renamed' });
  });

  it('addCompletedVaccination posts to /:id/vaccinations', async () => {
    (apiClient.post as any).mockResolvedValue({ data: { id: 'cv-1' } });
    await addCompletedVaccination('c-1', { vaccineId: 'opv', dateAdministered: '2024-01-01' });
    expect(apiClient.post).toHaveBeenCalledWith(
      '/children/c-1/vaccinations',
      expect.objectContaining({ vaccineId: 'opv' }),
    );
  });

  it('deleteChild deletes by id', async () => {
    (apiClient.delete as any).mockResolvedValue({});
    await deleteChild('c-1');
    expect(apiClient.delete).toHaveBeenCalledWith('/children/c-1');
  });
});
