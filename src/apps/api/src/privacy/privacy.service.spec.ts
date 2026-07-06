import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { User } from '../users/users.model';
import { Child } from '../children/children.model';

const AS_OF = new Date('2026-06-30T12:00:00Z');

describe('PrivacyService', () => {
  let service: PrivacyService;
  let userFindOne: jest.Mock;
  let childFind: jest.Mock;

  beforeEach(async () => {
    userFindOne = jest.fn();
    childFind = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrivacyService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: userFindOne },
        },
        { provide: getRepositoryToken(Child), useValue: { find: childFind } },
      ],
    }).compile();

    service = module.get(PrivacyService);
  });

  it('assembles the data subject + nested child records into one export', async () => {
    userFindOne.mockResolvedValue({
      id: 'u1',
      name: 'Test Parent',
      email: 'parent@example.com',
      phone: '+27123',
      role: 'parent',
      createdAt: AS_OF,
      updatedAt: AS_OF,
    });
    childFind.mockResolvedValue([
      {
        id: 'c1',
        name: 'Test Child',
        firstName: 'Test',
        lastName: 'Child',
        gender: 'female',
        dateOfBirth: '2024-01-01',
        status: 'Active',
        createdAt: AS_OF,
        updatedAt: AS_OF,
        growthRecords: [{ id: 'g1' }],
        completedVaccinations: [{ id: 'v1', vaccineId: 'hepB1' }],
      },
    ]);

    const result = await service.exportUserData('u1', AS_OF);

    expect(result.format).toBe('json');
    expect(result.exportedAt).toBe('2026-06-30T12:00:00.000Z');
    expect(result.dataSubject).toMatchObject({
      id: 'u1',
      email: 'parent@example.com',
    });
    expect(result.children).toHaveLength(1);
    expect(result.children[0]).toMatchObject({ id: 'c1', name: 'Test Child' });
    expect(result.children[0].growthRecords).toEqual([{ id: 'g1' }]);
    expect(result.children[0].vaccinations).toEqual([
      { id: 'v1', vaccineId: 'hepB1' },
    ]);
    // Child query must be scoped to the requesting subject.
    expect(childFind).toHaveBeenCalledWith(
      expect.objectContaining({ where: { parent: { id: 'u1' } } }),
    );
  });

  it('returns an empty children array for a subject with no children', async () => {
    userFindOne.mockResolvedValue({
      id: 'clin1',
      name: 'Dr Who',
      email: 'doc@example.com',
      phone: '+27999',
      role: 'clinician',
      createdAt: AS_OF,
      updatedAt: AS_OF,
    });
    childFind.mockResolvedValue([]);

    const result = await service.exportUserData('clin1', AS_OF);

    expect(result.children).toEqual([]);
    expect(result.dataSubject).toMatchObject({
      id: 'clin1',
      role: 'clinician',
    });
  });

  it('throws NotFoundException for an unknown subject', async () => {
    userFindOne.mockResolvedValue(null);

    await expect(
      service.exportUserData('missing', AS_OF),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(childFind).not.toHaveBeenCalled();
  });
});
