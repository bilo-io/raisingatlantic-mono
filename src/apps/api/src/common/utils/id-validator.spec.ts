import { isUUID } from './id-validator';

describe('isUUID', () => {
  it('returns true for a canonical UUID v4', () => {
    expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('returns true for an upper-case UUID', () => {
    expect(isUUID('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
  });

  it('returns false for a mock slug like "parent-jane-doe"', () => {
    expect(isUUID('parent-jane-doe')).toBe(false);
  });

  it('returns false for a plain string', () => {
    expect(isUUID('not-a-uuid')).toBe(false);
  });

  it('returns false for empty/null input', () => {
    expect(isUUID('')).toBe(false);
    expect(isUUID(undefined as any)).toBe(false);
  });

  it('returns false for a UUID with wrong segment lengths', () => {
    expect(isUUID('550e8400-e29b-41d4-a716-44665544000')).toBe(false);
  });
});
