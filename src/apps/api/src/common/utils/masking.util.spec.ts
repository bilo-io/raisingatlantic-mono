import { maskEmail, maskPhone } from './masking.util';

describe('maskEmail', () => {
  it('masks the local part keeping the first two characters', () => {
    expect(maskEmail('jane.doe@example.com')).toBe('ja***@example.com');
  });

  it('fully masks the local part when it is two characters or fewer', () => {
    expect(maskEmail('ab@example.com')).toBe('***@example.com');
    expect(maskEmail('a@example.com')).toBe('***@example.com');
  });

  it('returns the original string when it is not a valid email', () => {
    expect(maskEmail('not-an-email')).toBe('not-an-email');
  });

  it('returns falsy input unchanged', () => {
    expect(maskEmail('')).toBe('');
    expect(maskEmail(undefined as any)).toBeUndefined();
  });
});

describe('maskPhone', () => {
  it('keeps first four and last four characters', () => {
    expect(maskPhone('+27 82 123 4567')).toBe('+27  *** 4567');
  });

  it('falls back to a generic mask for very short strings', () => {
    expect(maskPhone('12345')).toBe('***-***-****');
  });

  it('returns falsy input unchanged', () => {
    expect(maskPhone('')).toBe('');
    expect(maskPhone(undefined as any)).toBeUndefined();
  });
});
