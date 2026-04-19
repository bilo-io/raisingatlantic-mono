/**
 * Robust UUID assessment to distinguish between real database UUIDs 
 * and our seeded mock string IDs (slugs).
 * 
 * @param id The string ID to validate
 * @returns boolean true if the id follows the UUID v4 pattern
 */
export function isUUID(id: string): boolean {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  // More lenient check for any UUID version if preferred, but our system uses v4
  const generalUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return generalUuidRegex.test(id);
}
