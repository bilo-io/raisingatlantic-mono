import { validate } from 'class-validator';
import { CreatePracticeDto } from './create-practice.dto';

const tenantId = 'eb8c8f5d-d922-4a0b-9c8a-788b77098e9b';

function build(overrides: Partial<CreatePracticeDto>): CreatePracticeDto {
  return Object.assign(new CreatePracticeDto(), {
    tenantId,
    name: 'City Clinic',
    address: '123 Main St',
    city: 'Johannesburg',
    state: 'Gauteng',
    zip: '2000',
    phone: '+27113334444',
    ...overrides,
  });
}

describe('CreatePracticeDto lat/lng bounds', () => {
  it('accepts coordinates within range', async () => {
    const errors = await validate(build({ latitude: -26.2, longitude: 28.04 }));
    expect(errors).toEqual([]);
  });

  it('rejects latitude > 90', async () => {
    const errors = await validate(build({ latitude: 91, longitude: 0 }));
    expect(errors.some((e) => e.property === 'latitude')).toBe(true);
  });

  it('rejects longitude < -180', async () => {
    const errors = await validate(build({ latitude: 0, longitude: -200 }));
    expect(errors.some((e) => e.property === 'longitude')).toBe(true);
  });

  it('rejects non-numeric latitude', async () => {
    const errors = await validate(
      build({ latitude: 'north' as unknown as number, longitude: 0 }),
    );
    expect(errors.some((e) => e.property === 'latitude')).toBe(true);
  });
});
