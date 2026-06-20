import * as Linking from "expo-linking";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../auth/useAuth";
import { consumePendingDeepLink, setPendingDeepLink } from "./pending";

function urlToRouterPath(url: string | null): string | null {
  if (!url) return null;
  const parsed = Linking.parse(url);
  if (!parsed.path) return null;
  const path = parsed.path.startsWith("/") ? parsed.path : `/${parsed.path}`;
  return path;
}

export function useDeepLinkGate(): void {
  const url = Linking.useURL();
  const router = useRouter();
  const { user, isHydrating } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isHydrating) return;
    const path = urlToRouterPath(url);
    if (!path) return;

    if (!user) {
      setPendingDeepLink(path);
      const inAuth = segments[0] === "(auth)";
      if (!inAuth) {
        router.replace("/(auth)/login");
      }
      return;
    }

    const pending = consumePendingDeepLink() ?? path;
    if (segments.join("/") !== pending.replace(/^\//, "")) {
      router.replace(pending as never);
    }
  }, [url, user, isHydrating, router, segments]);
}
