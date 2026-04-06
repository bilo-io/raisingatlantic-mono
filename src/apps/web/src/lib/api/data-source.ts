/**
 * Determines if the application should fetch data from the API or use local mock data.
 * Governed by the NEXT_PUBLIC_USE_API environment variable.
 */
export function useApi(): boolean {
  // Check environment variable
  const envValue = process.env.NEXT_PUBLIC_USE_API;
  
  // Default to false (mock data) if not set, otherwise convert string to boolean
  return envValue === 'true';
}

/**
 * Helper to wrap data fetching logic with the API toggle.
 */
export async function withDataSource<T>(
  apiFn: () => Promise<T>,
  mockData: T | (() => T)
): Promise<T> {
  if (useApi()) {
    try {
      return await apiFn();
    } catch (error) {
      console.warn('API fetch failed, falling back to mock data:', error);
      // Optional: Fallback to mock data on API error during migration
      // return typeof mockData === 'function' ? (mockData as any)() : mockData;
      throw error; // Fail-fast as per implementation plan recommendation
    }
  }
  
  return typeof mockData === 'function' ? (mockData as any)() : mockData;
}
