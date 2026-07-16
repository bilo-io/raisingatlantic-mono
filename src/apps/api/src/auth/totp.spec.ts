import {
  base32Decode,
  base32Encode,
  generateTotpSecret,
  totpCode,
  verifyTotp,
  totpUri,
} from './totp';

// RFC 6238 Appendix B test vectors use the ASCII seed "12345678901234567890";
// its base32 encoding is GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ. The published
// 8-digit SHA-1 codes truncate to these 6-digit values.
const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

describe('totp', () => {
  it('matches the RFC 6238 SHA-1 test vectors', () => {
    expect(totpCode(RFC_SECRET, 59 * 1000)).toBe('287082'); // 94287082
    expect(totpCode(RFC_SECRET, 1111111109 * 1000)).toBe('081804'); // 07081804
    expect(totpCode(RFC_SECRET, 1234567890 * 1000)).toBe('005924'); // 89005924
    expect(totpCode(RFC_SECRET, 2000000000 * 1000)).toBe('279037'); // 69279037
  });

  it('base32 round-trips the RFC seed', () => {
    expect(base32Encode(Buffer.from('12345678901234567890'))).toBe(RFC_SECRET);
    expect(base32Decode(RFC_SECRET).toString()).toBe('12345678901234567890');
  });

  it('verifies the current code and tolerates ±1 step of clock drift', () => {
    const now = 1234567890 * 1000;
    const code = totpCode(RFC_SECRET, now);
    expect(verifyTotp(RFC_SECRET, code, now)).toBe(true);
    expect(verifyTotp(RFC_SECRET, code, now + 30_000)).toBe(true);
    expect(verifyTotp(RFC_SECRET, code, now - 30_000)).toBe(true);
    expect(verifyTotp(RFC_SECRET, code, now + 90_000)).toBe(false);
    expect(verifyTotp(RFC_SECRET, '000000', now)).toBe(false);
    expect(verifyTotp(RFC_SECRET, 'abcdef', now)).toBe(false);
  });

  it('generates distinct base32 secrets', () => {
    const a = generateTotpSecret();
    const b = generateTotpSecret();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Z2-7]{32}$/);
    expect(base32Decode(a)).toHaveLength(20);
  });

  it('builds a scannable otpauth URI', () => {
    expect(totpUri('ABC234', 'Raising Atlantic', 'dr@clinic.test')).toBe(
      'otpauth://totp/Raising%20Atlantic:dr%40clinic.test?secret=ABC234&issuer=Raising%20Atlantic',
    );
  });
});
