import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

/**
 * Subset of NestJS class-validator-style 4xx payloads that can be mapped
 * to per-field form errors. Accepts either:
 *  - `{ message: string[] }` (Nest default)
 *  - `{ errors: { field: string; message: string }[] }` (custom)
 */
export type FieldErrorPayload =
  | { errors: Array<{ field: string; message: string }> }
  | { message: string | string[] };

export function isAxiosFieldErrorPayload(data: unknown): data is FieldErrorPayload {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.errors)) return true;
  if (typeof d.message === 'string' || Array.isArray(d.message)) return true;
  return false;
}

export function applyServerFieldErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  payload: FieldErrorPayload,
): void {
  if ('errors' in payload && Array.isArray(payload.errors)) {
    for (const e of payload.errors) {
      form.setError(e.field as Path<T>, { type: 'server', message: e.message });
    }
    return;
  }
  // Nest's default class-validator output is `{ message: string[] }` where
  // each item starts with the field name. We can't reliably split it back
  // into fields, so attach as a root error if present.
  if ('message' in payload) {
    const msg = Array.isArray(payload.message) ? payload.message.join(', ') : payload.message;
    form.setError('root.serverError' as Path<T>, { type: 'server', message: msg });
  }
}
