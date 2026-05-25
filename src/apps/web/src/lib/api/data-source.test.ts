import { afterEach, describe, expect, it, vi } from 'vitest';
import { useApi, withDataSource } from './data-source';

const ORIGINAL = process.env.NEXT_PUBLIC_USE_API;

afterEach(() => {
  process.env.NEXT_PUBLIC_USE_API = ORIGINAL;
  vi.restoreAllMocks();
});

describe('useApi', () => {
  it('returns true only when env var is exactly "true"', () => {
    process.env.NEXT_PUBLIC_USE_API = 'true';
    expect(useApi()).toBe(true);

    process.env.NEXT_PUBLIC_USE_API = 'false';
    expect(useApi()).toBe(false);

    process.env.NEXT_PUBLIC_USE_API = '';
    expect(useApi()).toBe(false);

    delete process.env.NEXT_PUBLIC_USE_API;
    expect(useApi()).toBe(false);
  });
});

describe('withDataSource', () => {
  it('returns mock data when the API toggle is off', async () => {
    process.env.NEXT_PUBLIC_USE_API = 'false';
    const apiFn = vi.fn();
    const result = await withDataSource(apiFn, ['mock']);
    expect(result).toEqual(['mock']);
    expect(apiFn).not.toHaveBeenCalled();
  });

  it('calls the mock factory function when given one', async () => {
    process.env.NEXT_PUBLIC_USE_API = 'false';
    const factory = vi.fn().mockReturnValue(['fresh']);
    const result = await withDataSource(vi.fn(), factory);
    expect(result).toEqual(['fresh']);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('invokes the api function when the toggle is on', async () => {
    process.env.NEXT_PUBLIC_USE_API = 'true';
    const apiFn = vi.fn().mockResolvedValue(['live']);
    await expect(withDataSource(apiFn, ['mock'])).resolves.toEqual(['live']);
  });

  it('rethrows api errors (fail-fast)', async () => {
    process.env.NEXT_PUBLIC_USE_API = 'true';
    const apiFn = vi.fn().mockRejectedValue(new Error('boom'));
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(withDataSource(apiFn, ['mock'])).rejects.toThrow('boom');
  });
});
