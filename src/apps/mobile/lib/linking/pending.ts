let pendingPath: string | null = null;

function looksLikeAuthRoute(path: string): boolean {
  return path.includes("/(auth)") || path.startsWith("/login");
}

export function setPendingDeepLink(path: string | null): void {
  if (!path) {
    pendingPath = null;
    return;
  }
  if (looksLikeAuthRoute(path)) return;
  pendingPath = path;
}

export function consumePendingDeepLink(): string | null {
  const next = pendingPath;
  pendingPath = null;
  return next;
}

export function peekPendingDeepLink(): string | null {
  return pendingPath;
}
