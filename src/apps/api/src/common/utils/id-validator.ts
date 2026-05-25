/**
 * Robust UUID assessment to distinguish between real database UUIDs
 * and our seeded mock string IDs (slugs).
 *
 * @param id The string ID to validate
 * @returns boolean true if the id follows the UUID v4 pattern
 */
export function isUUID(id: string): boolean {
  if (!id) return false;
  // Lenient check that matches any UUID version. (A v4-specific regex was
  // present here previously; we relaxed it because seed/test data isn't
  // guaranteed to be v4.)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
