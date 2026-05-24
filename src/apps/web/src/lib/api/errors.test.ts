import { describe, expect, it } from 'vitest';
import axios from 'axios';
import { ApiError, isApiError, toApiError } from './errors';

describe('ApiError', () => {
  it('captures message, status and data', () => {
    const err = new ApiError('bad', 400, { foo: 1 });
    expect(err.message).toBe('bad');
    expect(err.status).toBe(400);
    expect(err.data).toEqual({ foo: 1 });
    expect(err.name).toBe('ApiError');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('isApiError', () => {
  it('recognises an ApiError instance', () => {
    expect(isApiError(new ApiError('x', 500, null))).toBe(true);
  });

  it('rejects regular errors', () => {
    expect(isApiError(new Error('plain'))).toBe(false);
    expect(isApiError(null)).toBe(false);
    expect(isApiError('string')).toBe(false);
  });
});

describe('toApiError', () => {
  it('returns the same ApiError when given one', () => {
    const original = new ApiError('keep', 418, null);
    expect(toApiError(original)).toBe(original);
  });

  it('converts an AxiosError with body.message string', () => {
    const ax = new axios.AxiosError(
      'Request failed',
      undefined,
      undefined,
      undefined,
      {
        status: 422,
        data: { message: 'Validation failed', error: 'Unprocessable' },
        statusText: 'x',
        headers: {},
        config: { headers: {} as any },
      } as any,
    );
    const result = toApiError(ax);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBe(422);
    expect(result.message).toBe('Validation failed');
  });

  it('joins an array message with commas', () => {
    const ax = new axios.AxiosError(
      'x',
      undefined,
      undefined,
      undefined,
      {
        status: 400,
        data: { message: ['a is required', 'b must be email'] },
        statusText: 'x',
        headers: {},
        config: { headers: {} as any },
      } as any,
    );
    expect(toApiError(ax).message).toBe('a is required, b must be email');
  });

  it('falls back to axios message and status 0 when no response', () => {
    const ax = new axios.AxiosError('Network Error');
    const result = toApiError(ax);
    expect(result.status).toBe(0);
    expect(result.message).toBe('Network Error');
  });

  it('wraps a generic Error', () => {
    const result = toApiError(new Error('boom'));
    expect(result.status).toBe(0);
    expect(result.message).toBe('boom');
  });

  it('wraps an unknown value', () => {
    const result = toApiError({ weird: true });
    expect(result.message).toBe('Unknown error');
    expect(result.status).toBe(0);
    expect(result.data).toEqual({ weird: true });
  });
});
