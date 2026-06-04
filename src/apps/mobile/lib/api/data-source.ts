export function useApi(): boolean {
  return process.env.EXPO_PUBLIC_USE_API === "true";
}

export async function withDataSource<T>(
  apiFn: () => Promise<T>,
  mockData: T | (() => T | Promise<T>),
): Promise<T> {
  if (useApi()) {
    return apiFn();
  }
  return typeof mockData === "function" ? (mockData as () => T | Promise<T>)() : mockData;
}
